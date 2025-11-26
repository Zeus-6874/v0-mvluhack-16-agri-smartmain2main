"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import WeatherWidget from "@/components/WeatherWidget"
import { Droplets, AlertTriangle, Info, Bell, Thermometer, Loader2, RefreshCw } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function WeatherAlerts() {
  const { language, t } = useI18n()
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {language === "hi" ? "मौसम अलर्ट और सिंचाई गाइड" : "Weather Alerts & Irrigation Guide"}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {language === "hi"
                ? "मौसम की जानकारी और सिंचाई के सुझाव प्राप्त करें"
                : "Get weather information and irrigation recommendations"}
            </p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm">
            {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            {language === "hi" ? "रिफ्रेश" : "Refresh"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Current Weather - Enhanced card */}
            <Card className="border-2 border-blue-200 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-lg">{language === "hi" ? "वर्तमान मौसम" : "Current Weather"}</CardTitle>
              </CardHeader>
              <CardContent>
                <WeatherWidget language={language} />
              </CardContent>
            </Card>

            {/* Weather Alerts - Enhanced cards */}
            <Card className="border-2 border-gray-200 shadow-md bg-white">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Bell className="h-5 w-5 text-red-600" />
                  {language === "hi" ? "मौसम अलर्ट" : "Weather Alerts"}
                  <Badge variant="secondary">{weatherAlerts.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  /* Using index for keys instead of IDs */
                  weatherAlerts.map((alert, index) => (
                    <div
                      key={`alert-${index}`}
                      className={`p-3 sm:p-4 border-2 rounded-lg ${getAlertColor(alert.severity)} shadow-sm hover:shadow-md transition-all`}
                    >
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                            <h3 className="font-medium text-sm sm:text-base">{alert.title}</h3>
                            <span className="text-xs text-gray-500">{alert.time}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-700 break-words">{alert.message}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Enhanced cards */}
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-2 border-gray-200 shadow-md bg-white sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">{language === "hi" ? "मौसम आंकड़े" : "Weather Statistics"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="text-sm">{language === "hi" ? "औसत तापमान" : "Avg Temperature"}</span>
                  </div>
                  <span className="font-bold">26°C</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">{language === "hi" ? "कुल बारिश" : "Total Rainfall"}</span>
                  </div>
                  <span className="font-bold">85mm</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 shadow-md bg-white">
              <CardHeader>
                <CardTitle className="text-lg">{language === "hi" ? "त्वरित कार्य" : "Quick Actions"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-sm sm:text-base"
                  onClick={() => alert(language === "hi" ? "अलर्ट सुविधा जल्द आ रही है" : "Alert feature coming soon")}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {language === "hi" ? "अलर्ट सेट करें" : "Set Alerts"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent text-sm sm:text-base"
                  onClick={() => (window.location.href = "/field-management")}
                >
                  <Droplets className="h-4 w-4 mr-2" />
                  {language === "hi" ? "सिंचाई प्लान करें" : "Plan Irrigation"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
