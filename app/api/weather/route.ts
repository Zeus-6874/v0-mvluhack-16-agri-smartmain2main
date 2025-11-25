import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Location coordinates are required. Please enable location access." },
        { status: 400 },
      )
    }

    const weatherData = await fetchOpenWeatherMap(lat, lon, await getDb())
    if (weatherData) {
      return NextResponse.json({
        success: true,
        weather: weatherData,
      })
    }

    return NextResponse.json({ error: "Unable to fetch weather data" }, { status: 502 })
  } catch (error) {
    console.error("Weather API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function fetchOpenWeatherMap(lat: string, lon: string, db: any) {
  try {
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY
    if (!openWeatherApiKey) return null

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`,
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${openWeatherApiKey}&units=metric`,
      ),
    ])

    if (!currentResponse.ok || !forecastResponse.ok) {
      return null
    }

    const currentData = await currentResponse.json()
    const forecastData = await forecastResponse.json()

    const dailyForecast = []
    const processedDays = new Set()

    for (const item of forecastData.list.slice(0, 40)) {
      const date = new Date(item.dt * 1000)
      const dayKey = date.toDateString()

      if (!processedDays.has(dayKey) && dailyForecast.length < 5) {
        processedDays.add(dayKey)
        const dayName =
          dailyForecast.length === 0
            ? "Today"
            : dailyForecast.length === 1
              ? "Tomorrow"
              : date.toLocaleDateString("en", { weekday: "short" })

        dailyForecast.push({
          day: dayName,
          temp: Math.round(item.main.temp),
          condition: item.weather[0].main.toLowerCase(),
          rain: Math.round((item.pop || 0) * 100),
        })
      }
    }

    const weatherPayload = {
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main.toLowerCase(),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6),
      rainfall: currentData.rain?.["1h"] || 0,
      visibility: currentData.visibility ? Math.round(currentData.visibility / 1000) : 10,
      pressure: currentData.main.pressure,
      uvIndex: 5,
      location: currentData.name,
      forecast: dailyForecast,
    }

    try {
      await db.collection("weather_data").insertOne({
        location: weatherPayload.location,
        temperature: weatherPayload.temperature,
        humidity: weatherPayload.humidity,
        rainfall: weatherPayload.rainfall,
        wind_speed: weatherPayload.windSpeed,
        weather_condition: weatherPayload.condition,
        date: new Date().toISOString().split("T")[0],
        created_at: new Date(),
      })
    } catch (dbError) {
      console.log("Failed to cache OpenWeatherMap data:", dbError)
    }

    return weatherPayload
  } catch (error) {
    console.error("OpenWeatherMap API error:", error)
    return null
  }
}

async function fetchOpenMeteo(lat: number, lon: number, locationName: string, db: any) {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current_weather: "true",
      hourly: "relativehumidity_2m,precipitation",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode",
      timezone: "auto",
    })

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
    if (!response.ok) return null

    const data = await response.json()
    if (!data.current_weather) return null

    const humidity = data.hourly?.relativehumidity_2m?.[0] ?? 60
    const rainfall = data.hourly?.precipitation?.[0] ?? 0

    const forecast =
      data.daily?.time?.slice(0, 5).map((date: string, index: number) => ({
        day:
          index === 0
            ? "Today"
            : index === 1
              ? "Tomorrow"
              : new Date(date).toLocaleDateString("en", { weekday: "short" }),
        temp: Math.round(data.daily.temperature_2m_max?.[index] ?? data.current_weather.temperature),
        condition: mapWeatherCodeToCondition(data.daily.weathercode?.[index]),
        rain: data.daily.precipitation_probability_max?.[index] ?? 0,
      })) || []

    const weatherPayload = {
      temperature: Math.round(data.current_weather.temperature),
      condition: mapWeatherCodeToCondition(data.current_weather.weathercode),
      humidity: Math.round(humidity),
      windSpeed: Math.round(data.current_weather.windspeed),
      rainfall: Math.round(rainfall * 10) / 10,
      visibility: 8,
      pressure: 1013,
      uvIndex: 5,
      location: locationName,
      forecast,
    }

    try {
      await db.collection("weather_data").insertOne({
        location: weatherPayload.location,
        temperature: weatherPayload.temperature,
        humidity: weatherPayload.humidity,
        rainfall: weatherPayload.rainfall,
        wind_speed: weatherPayload.windSpeed,
        weather_condition: weatherPayload.condition,
        date: new Date().toISOString().split("T")[0],
        created_at: new Date(),
      })
    } catch (dbError) {
      console.log("Failed to cache Open-Meteo data:", dbError)
    }

    return weatherPayload
  } catch (error) {
    console.error("Open-Meteo API error:", error)
    return null
  }
}

function mapWeatherCodeToCondition(code: number) {
  const weatherMap: Record<number, string> = {
    0: "clear",
    1: "partly-cloudy",
    2: "partly-cloudy",
    3: "cloudy",
    45: "fog",
    48: "fog",
    51: "rain",
    53: "rain",
    55: "rain",
    61: "rain",
    63: "rain",
    65: "rainy",
    71: "snow",
    73: "snow",
    75: "snow",
    80: "rain",
    81: "rain",
    82: "rain",
    95: "thunderstorm",
    96: "thunderstorm",
    99: "thunderstorm",
  }
  return weatherMap[code] || "partly-cloudy"
}
