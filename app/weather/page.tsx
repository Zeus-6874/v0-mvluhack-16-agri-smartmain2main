"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import WeatherWidget from "@/components/WeatherWidget"
import { Droplets, AlertTriangle, Info, Bell, Loader2, RefreshCw } from "lucide-react"
import { useTranslate, useTolgee } from "@tolgee/react"

export default function WeatherAlerts() {
  const { t } = useTranslate()
  const tolgee = useTolgee(["language"])
  const language = tolgee.getLanguage() || "en"
  const [weatherAlerts, setWeatherAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchWeatherData = async () => {
    try {
      const response = await fetch("/api/weather?location=Delhi")
      const data = await response.json()

      if (data.success && data.weather) {
        // Create alerts based on weather conditions
        const alerts: any[] = []

        if (data.weather.rainfall > 50) {
          alerts.push({
            type: "warning",
            title: language === "hi" ? "भारी बारिश चेतावनी" : "Heavy Rainfall Warning",
            message:
              language === "hi"
                ? `${data.weather.rainfall}mm बारिश हो रही है। जल निकासी की व्यवस्था करें।`
                : `${data.weather.rainfall}mm rainfall detected. Prepare drainage systems.`,
            time: "Now",
            severity: "high",
          })
        }

        if (data.weather.temperature > 20 && data.weather.temperature < 25) {
          alerts.push({
            type: "info",
            title: language === "hi" ? "अनुकूल तापमान" : "Favorable Temperature",
            message:
              language === "hi"
                ? `गेहूं के अंकुरण के लिए आदर्श तापमान (${data.weather.temperature}°C)`
                : `Ideal temperature for wheat germination (${data.weather.temperature}°C)`,
            time: "Now",
            severity: "low",
          })
        }

        setWeatherAlerts(
          alerts.length > 0
            ? alerts
            : [
                {
                  type: "info",
                  title: language === "hi" ? "सामान्य मौसम" : "Normal Weather",
                  message: language === "hi" ? "मौसम स्थिर है" : "Weather conditions are stable",
                  time: "Now",
                  severity: "low",
                },
              ],
        )
      }
    } catch (error) {
      console.error("Error fetching weather data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchWeatherData()
  }, [language])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchWeatherData()
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "caution":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-orange-200 bg-orange-50"
      default:
        return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t("weather-alerts-title")}</h1>
            <p className="text-sm sm:text-base text-gray-600">{t("weather-alerts-description")}</p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
            {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            {t("refresh")}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Current Weather - Enhanced card */}
            <Card className="border-2 border-blue-200 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-lg">{t("current-weather")}</CardTitle>
              </CardHeader>
              <CardContent>
                <WeatherWidget language={language} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Enhanced cards */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-2 border-green-200 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-lg">{t("quick-actions")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-sm sm:text-base"
                  onClick={() => alert(t("alert-feature-soon"))}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {t("set-alerts")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-sm sm:text-base"
                  onClick={() => (window.location.href = "/field-management")}
                >
                  <Droplets className="h-4 w-4 mr-2" />
                  {t("plan-irrigation")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
