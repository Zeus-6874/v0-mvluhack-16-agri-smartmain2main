import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"
import type { Db } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")
    const location = searchParams.get("location") || "Your Location"

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Location coordinates are required. Please enable location access." },
        { status: 400 },
      )
    }

    const weatherData = await fetchOpenMeteo(Number.parseFloat(lat), Number.parseFloat(lon), location, await getDb())

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

async function fetchOpenMeteo(lat: number, lon: number, locationName: string, db: Db) {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,surface_pressure",
      hourly: "precipitation",
      daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code",
      timezone: "auto",
    })

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
    if (!response.ok) {
      console.error("Open-Meteo API error:", response.statusText)
      return null
    }

    const data = await response.json()
    if (!data.current) {
      console.error("No current weather data from Open-Meteo")
      return null
    }

    const current = data.current
    const humidity = Math.round(current.relative_humidity_2m ?? 60)
    const rainfall = Math.round((current.precipitation ?? 0) * 10) / 10

    const forecast =
      data.daily?.time?.slice(0, 5).map((date: string, index: number) => ({
        day:
          index === 0
            ? "Today"
            : index === 1
              ? "Tomorrow"
              : new Date(date).toLocaleDateString("en", { weekday: "short" }),
        temp: Math.round(data.daily.temperature_2m_max?.[index] ?? current.temperature_2m),
        condition: mapWeatherCodeToCondition(data.daily.weather_code?.[index] ?? current.weather_code),
        rain: data.daily.precipitation_probability_max?.[index] ?? 0,
      })) || []

    const weatherPayload = {
      temperature: Math.round(current.temperature_2m),
      condition: mapWeatherCodeToCondition(current.weather_code),
      humidity: humidity,
      windSpeed: Math.round(current.wind_speed_10m * 3.6), // Convert m/s to km/h
      rainfall: rainfall,
      visibility: 10, // Open-Meteo doesn't provide visibility
      pressure: Math.round(current.surface_pressure ?? 1013),
      uvIndex: 5, // Open-Meteo free tier doesn't provide UV index
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

function mapWeatherCodeToCondition(code: number): string {
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
    56: "rain",
    57: "rain",
    61: "rain",
    63: "rain",
    65: "rainy",
    66: "rain",
    67: "rain",
    71: "snow",
    73: "snow",
    75: "snow",
    77: "snow",
    80: "rain",
    81: "rain",
    82: "rainy",
    85: "snow",
    86: "snow",
    95: "thunderstorm",
    96: "thunderstorm",
    99: "thunderstorm",
  }
  return weatherMap[code] || "partly-cloudy"
}
