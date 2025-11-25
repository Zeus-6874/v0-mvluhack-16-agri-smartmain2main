"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Sprout,
  CloudRain,
  TrendingUp,
  Plus,
  Settings,
  Calendar,
  Droplets,
  BarChart3,
  MapPin,
  Wind,
  Cloud,
  AlertCircle,
} from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import CropCard from "@/components/CropCard" // Assuming CropCard component exists

interface Profile {
  full_name: string
  phone: string
  state: string
  district: string
  village: string
  farm_size: number
  main_crops: string
  soil_type: string
  irrigation_type: string
}

interface DashboardClientProps {
  profile: Profile | null
}

const cropIcons: Record<string, string> = {
  wheat: "🌾",
  corn: "🌽",
  maize: "🌽",
  tomato: "🍅",
  onion: "🧅",
  rice: "🌾",
  potato: "🥔",
  cotton: "☁️",
  sugarcane: "🎋",
  soybean: "🫘",
}

export default function DashboardClient({ profile }: DashboardClientProps) {
  const router = useRouter()
  const { language, t } = useI18n()
  const [weather, setWeather] = useState<any>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [activeCrops, setActiveCrops] = useState<any[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([])

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const location = profile?.district || profile?.state || "Delhi"
        const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
        const data = await response.json()
        console.log("[v0] Weather data received:", data)
        if (data.success) {
          setWeather(data.weather)
        }
      } catch (error) {
        console.error("Weather fetch error:", error)
      } finally {
        setWeatherLoading(false)
      }
    }
    fetchWeather()
  }, [profile])

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch real crop cycles from database
        const cropsRes = await fetch("/api/crop-cycles")
        const cropsData = await cropsRes.json()
        if (cropsData.success && cropsData.cropCycles) {
          setActiveCrops(cropsData.cropCycles.filter((c: any) => c.status === "growing" || c.status === "planted"))
        }

        // Fetch real field activities/tasks
        const tasksRes = await fetch("/api/field-activities")
        const tasksData = await tasksRes.json()
        if (tasksData.success && tasksData.activities) {
          setUpcomingTasks(tasksData.activities.slice(0, 3))
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    fetchUserData()
  }, [])

  const stats = [
    {
      label: language === "hi" ? "कुल क्षेत्र" : language === "mr" ? "एकूण क्षेत्र" : "Total Area",
      value: profile?.farm_size ? profile.farm_size.toFixed(1) : "0",
      unit: language === "hi" ? "हेक्टेयर" : language === "mr" ? "हेक्टर" : "hectares",
      icon: Sprout,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: language === "hi" ? "सक्रिय फसलें" : language === "mr" ? "सक्रिय पिके" : "Active Crops",
      value: activeCrops.length,
      unit: language === "hi" ? "फसलें" : language === "mr" ? "पिके" : "crops",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: language === "hi" ? "औसत उपज" : language === "mr" ? "सरासरी उत्पादन" : "Avg Yield",
      value: "0",
      unit: "t/ha",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: language === "hi" ? "वर्षा" : language === "mr" ? "पाऊस" : "Rainfall",
      value: weather?.rainfall ? weather.rainfall.toFixed(1) : "0",
      unit: "mm",
      icon: CloudRain,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
  ]

  const generateWeatherAlerts = () => {
    if (!weather) return []

    const alerts: any[] = []
    const temp = weather.main?.temp ?? weather.temperature
    const humidity = weather.main?.humidity ?? weather.humidity
    const rainfall = weather.rainfall ?? 0
    const windSpeed = weather.wind?.speed ?? weather.windSpeed ?? 0

    if (!temp || !humidity) return []

    // Heavy rainfall alert
    if (rainfall > 50) {
      alerts.push({
        type: "warning",
        title:
          language === "hi" ? "भारी बारिश चेतावनी" : language === "mr" ? "मुसळधार पाऊस चेतावनी" : "Heavy Rainfall Warning",
        message:
          language === "hi"
            ? `${rainfall}mm बारिश का पूर्वानुमान। जल निकासी तैयार करें।`
            : language === "mr"
              ? `${rainfall}mm पाऊस अपेक्षित. जलनिर्गालन व्यवस्था करा।`
              : `${rainfall}mm rainfall expected. Prepare drainage systems.`,
        time: language === "hi" ? "अभी" : language === "mr" ? "आता" : "Now",
        severity: "high",
      })
    }

    // Extreme temperature alert
    if (temp < 10) {
      alerts.push({
        type: "warning",
        title: language === "hi" ? "ठंड चेतावनी" : language === "mr" ? "थंडी चेतावनी" : "Cold Warning",
        message:
          language === "hi"
            ? `तापमान ${temp}°C तक गिर सकता है। फसलों की सुरक्षा करें।`
            : language === "mr"
              ? `तापमान ${temp}°C पर्यंत घसरू शकते. पिकांचे संरक्षण करा।`
              : `Temperature may drop to ${temp}°C. Protect sensitive crops.`,
        time: language === "hi" ? "अभी" : language === "mr" ? "आता" : "Now",
        severity: "high",
      })
    }

    // High humidity alert
    if (humidity > 80) {
      alerts.push({
        type: "caution",
        title: language === "hi" ? "उच्च नमी" : language === "mr" ? "उच्च आर्द्रता" : "High Humidity",
        message:
          language === "hi"
            ? `नमी ${humidity}% है। फंगल रोगों से सावधान रहें।`
            : language === "mr"
              ? `आर्द्रता ${humidity}% आहे. बुरशीजन्य रोगांपासून सावध राहा।`
              : `Humidity at ${humidity}%. Watch for fungal diseases.`,
        time: language === "hi" ? "अभी" : language === "mr" ? "आता" : "Now",
        severity: "medium",
      })
    }

    // Favorable conditions
    if (temp >= 20 && temp <= 30 && humidity >= 40 && humidity <= 70) {
      alerts.push({
        type: "info",
        title: language === "hi" ? "अनुकूल मौसम" : language === "mr" ? "अनुकूल हवामान" : "Favorable Weather",
        message:
          language === "hi"
            ? `खेती के लिए आदर्श परिस्थितियां (${temp}°C, ${humidity}% नमी)`
            : language === "mr"
              ? `शेतीसाठी आदर्श परिस्थिती (${temp}°C, ${humidity}% आर्द्रता)`
              : `Ideal conditions for farming (${temp}°C, ${humidity}% humidity)`,
        time: language === "hi" ? "अभी" : language === "mr" ? "आता" : "Now",
        severity: "low",
      })
    }

    return alerts.length > 0 ? alerts : []
  }

  const weatherAlerts = generateWeatherAlerts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {language === "hi" ? "डैशबोर्ड" : language === "mr" ? "डॅशबोर्ड" : "Dashboard"}
          </h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            {profile?.full_name && (
              <>
                <span>
                  {language === "hi" ? "नमस्ते" : language === "mr" ? "नमस्कार" : "Welcome"}, {profile.full_name}
                </span>
                {profile?.village && (
                  <span className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 mr-1" />
                    {profile.village}, {profile.district}
                  </span>
                )}
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
            onClick={() => router.push("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            {language === "hi" ? "सेटिंग्स" : language === "mr" ? "सेटिंग्ज" : "Settings"}
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => router.push("/field-management")}
          >
            <Plus className="mr-2 h-4 w-4" />
            {language === "hi" ? "फसल जोड़ें" : language === "mr" ? "पीक जोडा" : "Add Crop"}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-sm">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1 text-gray-900">
                    {stat.value} <span className="text-xs sm:text-sm font-normal text-gray-400">{stat.unit}</span>
                  </p>
                </div>
                <div className={`p-2 sm:p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left Column - Crops */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Active Crops */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg sm:text-xl">
                <div className="flex items-center">
                  <Sprout className="mr-2 h-5 w-5 text-green-600" />
                  {language === "hi" ? "सक्रिय फसलें" : language === "mr" ? "सक्रिय पिके" : "Active Crops"}
                </div>
                <Button
                  onClick={() => router.push("/field-management")}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {language === "hi" ? "फसल जोड़ें" : language === "mr" ? "पीक जोडा" : "Add Crop"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeCrops.length === 0 ? (
                <div className="text-center py-8">
                  <Sprout className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">
                    {language === "hi"
                      ? "कोई सक्रिय फसल नहीं"
                      : language === "mr"
                        ? "कोणतेही सक्रिय पीक नाही"
                        : "No active crops"}
                  </p>
                  <Button onClick={() => router.push("/field-management")} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {language === "hi" ? "पहली फसल जोड़ें" : language === "mr" ? "पहिले पीक जोडा" : "Add First Crop"}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCrops.map((crop) => (
                    <CropCard key={crop.id} crop={crop} language={language} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">
                {language === "hi" ? "त्वरित कार्य" : language === "mr" ? "जलद क्रिया" : "Quick Actions"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{/* Quick Actions content here */}</div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Weather & Tasks */}
        <div className="space-y-4 sm:space-y-6">
          {/* Weather Widget */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                {t("dashboard.weather")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weatherLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : weather ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-4xl font-bold">
                        {weather.main ? Math.round(weather.main.temp) : weather.temperature || 25}°C
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 capitalize">
                        {weather.weather?.[0]?.description || weather.condition || t("weather.clear")}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {weather.name || weather.location || profile?.district || "Location"}
                      </p>
                    </div>
                    <div className="text-6xl">
                      {weather.weather?.[0]?.main === "Clear" || weather.condition === "clear"
                        ? "☀️"
                        : weather.weather?.[0]?.main === "Clouds" || weather.condition === "clouds"
                          ? "☁️"
                          : weather.weather?.[0]?.main === "Rain" || weather.condition === "rain"
                            ? "🌧️"
                            : weather.weather?.[0]?.main === "Snow"
                              ? "❄️"
                              : "🌤️"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t("weather.humidity")}</p>
                        <p className="text-sm font-semibold">{weather.main?.humidity || weather.humidity || 65}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t("weather.wind")}</p>
                        <p className="text-sm font-semibold">{weather.wind?.speed || weather.windSpeed || 5} m/s</p>
                      </div>
                    </div>
                  </div>

                  {weatherAlerts.map((alert) => (
                    <div
                      key={alert.title}
                      className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800"
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">{alert.title}</p>
                          <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">{alert.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-4 text-center">{t("weather.unavailable")}</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                {language === "hi" ? "आगामी कार्य" : language === "mr" ? "आगामी कामे" : "Upcoming Tasks"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    {language === "hi"
                      ? "कोई कार्य नहीं है"
                      : language === "mr"
                        ? "कोणतेही काम नाही"
                        : "No tasks scheduled"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          task.priority === "high"
                            ? "bg-red-500"
                            : task.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 break-words">
                          {task.activity_type || task.task}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(task.scheduled_date || task.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
