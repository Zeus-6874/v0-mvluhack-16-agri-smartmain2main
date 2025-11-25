import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "Delhi"
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    const alerts = []

    // Fetch current weather
    const weatherResponse = await fetch(
      `/api/weather?location=${location}${lat && lon ? `&lat=${lat}&lon=${lon}` : ""}`,
    )
    const weatherData = await weatherResponse.json()

    if (weatherData.success && weatherData.weather) {
      const weather = weatherData.weather

      // Rain alert
      if (weather.condition?.toLowerCase().includes("rain") || weather.rainfall > 0) {
        alerts.push({
          id: "rain_alert",
          type: "warning",
          priority: "high",
          title: {
            en: "Rain Expected",
            hi: "बारिश की संभावना",
            mr: "पाऊस अपेक्षित",
          },
          message: {
            en: `Light rain expected today. Plan irrigation accordingly. Expected rainfall: ${weather.rainfall}mm`,
            hi: `आज हल्की बारिश की संभावना है। सिंचाई की योजना बनाएं। अपेक्षित वर्षा: ${weather.rainfall}mm`,
            mr: `आज हलका पाऊस अपेक्षित आहे. पाणीपुरवठा योजना करा. अपेक्षित पाऊस: ${weather.rainfall}mm`,
          },
          icon: "rain",
          timestamp: new Date().toISOString(),
        })
      }

      // Temperature alert for crop growth
      if (weather.temperature >= 20 && weather.temperature <= 25) {
        alerts.push({
          id: "temp_optimal",
          type: "info",
          priority: "medium",
          title: {
            en: "Optimal Temperature",
            hi: "अनुकूल तापमान",
            mr: "अनुकूल तापमान",
          },
          message: {
            en: `Current temperature (${weather.temperature}°C) is ideal for wheat germination`,
            hi: `वर्तमान तापमान (${weather.temperature}°C) गेहूं के अंकुरण के लिए आदर्श है`,
            mr: `सध्याचे तापमान (${weather.temperature}°C) गव्हाच्या उगवणीसाठी आदर्श आहे`,
          },
          icon: "temperature",
          timestamp: new Date().toISOString(),
        })
      }

      // High temperature warning
      if (weather.temperature > 35) {
        alerts.push({
          id: "heat_warning",
          type: "warning",
          priority: "high",
          title: {
            en: "High Temperature Alert",
            hi: "उच्च तापमान चेतावनी",
            mr: "उच्च तापमान इशारा",
          },
          message: {
            en: `Temperature is ${weather.temperature}°C. Increase irrigation and provide shade to sensitive crops`,
            hi: `तापमान ${weather.temperature}°C है। सिंचाई बढ़ाएं और संवेदनशील फसलों को छाया प्रदान करें`,
            mr: `तापमान ${weather.temperature}°C आहे. पाणीपुरवठा वाढवा आणि संवेदनशील पिकांना सावली द्या`,
          },
          icon: "sun",
          timestamp: new Date().toISOString(),
        })
      }

      // Low humidity warning
      if (weather.humidity < 40) {
        alerts.push({
          id: "low_humidity",
          type: "warning",
          priority: "medium",
          title: {
            en: "Low Humidity Alert",
            hi: "कम नमी चेतावनी",
            mr: "कमी आर्द्रता इशारा",
          },
          message: {
            en: `Humidity is ${weather.humidity}%. Increase irrigation frequency`,
            hi: `नमी ${weather.humidity}% है। सिंचाई की आवृत्ति बढ़ाएं`,
            mr: `आर्द्रता ${weather.humidity}% आहे. पाणीपुरवठा वारंवारता वाढवा`,
          },
          icon: "droplets",
          timestamp: new Date().toISOString(),
        })
      }

      // Strong wind warning
      if (weather.windSpeed > 40) {
        alerts.push({
          id: "wind_warning",
          type: "danger",
          priority: "high",
          title: {
            en: "Strong Wind Alert",
            hi: "तेज़ हवा चेतावनी",
            mr: "जोरदार वारा इशारा",
          },
          message: {
            en: `Strong winds (${weather.windSpeed} km/h). Protect tall crops and structures`,
            hi: `तेज़ हवाएं (${weather.windSpeed} km/h)। ऊंची फसलों और संरचनाओं की सुरक्षा करें`,
            mr: `जोरदार वारा (${weather.windSpeed} km/h). उंच पिके आणि संरचनांचे संरक्षण करा`,
          },
          icon: "wind",
          timestamp: new Date().toISOString(),
        })
      }

      // Check forecast for upcoming rain
      if (weather.forecast && Array.isArray(weather.forecast)) {
        const tomorrowForecast = weather.forecast[1]
        if (tomorrowForecast && tomorrowForecast.rain > 50) {
          alerts.push({
            id: "forecast_rain",
            type: "info",
            priority: "medium",
            title: {
              en: "Rain Forecast",
              hi: "बारिश का पूर्वानुमान",
              mr: "पाऊस अंदाज",
            },
            message: {
              en: `Rain expected tomorrow (${tomorrowForecast.rain}% chance). Prepare accordingly`,
              hi: `कल बारिश की संभावना (${tomorrowForecast.rain}%)। तैयारी करें`,
              mr: `उद्या पाऊस अपेक्षित (${tomorrowForecast.rain}% शक्यता). तयारी करा`,
            },
            icon: "calendar",
            timestamp: new Date().toISOString(),
          })
        }
      }
    }

    // Store alerts in database
    const db = await getDb()
    if (alerts.length > 0) {
      await db.collection("weather_alerts").deleteMany({
        location: location,
        timestamp: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Delete alerts older than 24 hours
      })

      await db.collection("weather_alerts").insertMany(
        alerts.map((alert) => ({
          ...alert,
          location,
          createdAt: new Date(),
        })),
      )
    }

    return NextResponse.json({
      success: true,
      alerts,
      location,
    })
  } catch (error) {
    console.error("Weather Alerts API Error:", error)
    return NextResponse.json({ error: "Failed to fetch weather alerts" }, { status: 500 })
  }
}
