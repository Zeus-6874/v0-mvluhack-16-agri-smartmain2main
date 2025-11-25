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
import { useToast } from "@/hooks/use-toast"
import CropCard from "@/components/CropCard"
import AddCropModal from "@/components/AddCropModal"

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
  const { toast } = useToast()
  const [weather, setWeather] = useState<any>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [activeCrops, setActiveCrops] = useState<any[]>([])
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([])
  const [fields, setFields] = useState<any[]>([])
  const [showAddCropModal, setShowAddCropModal] = useState(false)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        console.log("[v0] Fetching weather for profile:", profile)
        const location = profile?.district || profile?.state || "Delhi"
        const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
        const data = await response.json()
        console.log("[v0] Weather data received:", data)
        if (data.success && data.weather) {
          setWeather(data.weather)
        } else {
          console.error("[v0] Weather fetch failed:", data)
        }
      } catch (error) {
        console.error("[v0] Weather fetch error:", error)
      } finally {
        setWeatherLoading(false)
      }
    }

    if (profile) {
      fetchWeather()
    }
  }, [profile])

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const cropsRes = await fetch("/api/crop-cycles")
      const cropsData = await cropsRes.json()
      if (cropsData.success && cropsData.crop_cycles) {
        setActiveCrops(cropsData.crop_cycles.filter((c: any) => c.status === "growing" || c.status === "planted"))
      }

      const tasksRes = await fetch("/api/field-activities")
      const tasksData = await tasksRes.json()
      if (tasksData.success && tasksData.activities) {
        setUpcomingTasks(tasksData.activities.slice(0, 3))
      }

      const fieldsRes = await fetch("/api/fields")
      const fieldsData = await fieldsRes.json()
      if (fieldsData.success && fieldsData.fields) {
        setFields(fieldsData.fields)
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleDeleteCrop = async (cropId: number) => {
    try {
      console.log("[v0] Deleting crop:", cropId)

      const response = await fetch(`/api/crop-cycles/${cropId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      console.log("[v0] Delete response:", data)

      if (data.success) {
        toast({
          title: t("common.success"),
          description: t("dashboard.cropDeleted"),
        })
        // Refresh the page to show updated data
        window.location.reload()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("[v0] Delete error:", error)
      toast({
        title: t("common.error"),
        description: t("common.errorOccurred"),
        variant: "destructive",
      })
    }
  }

  const stats = [
    {
      label: t("dashboard.totalArea"),
      value: profile?.farm_size ? profile.farm_size.toFixed(1) : "0",
      unit: t("dashboard.hectares"),
      icon: Sprout,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: t("dashboard.activeCrops"),
      value: activeCrops.length,
      unit: t("dashboard.crops"),
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: t("dashboard.avgYield"),
      value: "0",
      unit: "t/ha",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: t("dashboard.rainfall"),
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

    if (rainfall > 50) {
      alerts.push({
        type: "warning",
        title: t("dashboard.heavyRainfallWarning"),
        message: t("dashboard.heavyRainfallMessage", { rainfall }),
        time: t("common.now"),
        severity: "high",
      })
    }

    if (temp < 10) {
      alerts.push({
        type: "warning",
        title: t("dashboard.coldWarning"),
        message: t("dashboard.coldMessage", { temp }),
        time: t("common.now"),
        severity: "high",
      })
    }

    if (humidity > 80) {
      alerts.push({
        type: "caution",
        title: t("dashboard.highHumidity"),
        message: t("dashboard.highHumidityMessage", { humidity }),
        time: t("common.now"),
        severity: "medium",
      })
    }

    if (temp >= 20 && temp <= 30 && humidity >= 40 && humidity <= 70) {
      alerts.push({
        type: "info",
        title: t("dashboard.favorableWeather"),
        message: t("dashboard.favorableWeatherMessage", { temp, humidity }),
        time: t("common.now"),
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t("dashboard.dashboard")}</h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            {profile?.full_name && (
              <>
                <span>
                  {t("common.welcome")}, {profile.full_name}
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
            {t("common.settings")}
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setShowAddCropModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("dashboard.addCrop")}
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
                  {t("dashboard.activeCrops")}
                </div>
                <Button
                  onClick={() => setShowAddCropModal(true)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t("dashboard.addCrop")}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activeCrops.length === 0 ? (
                <div className="text-center py-8">
                  <Sprout className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">{t("dashboard.noActiveCrops")}</p>
                  <Button onClick={() => setShowAddCropModal(true)} className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {t("dashboard.addFirstCrop")}
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeCrops.map((crop) => (
                    <CropCard key={crop.id} crop={crop} language={language} onDelete={handleDeleteCrop} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("dashboard.quickActions")}</CardTitle>
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
                        {weather.main
                          ? Math.round(weather.main.temp)
                          : weather.temperature
                            ? Math.round(weather.temperature)
                            : "N/A"}
                        °C
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
                        <p className="text-sm font-semibold">{weather.main?.humidity || weather.humidity || "N/A"}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-muted-foreground">{t("weather.wind")}</p>
                        <p className="text-sm font-semibold">{weather.wind?.speed || weather.windSpeed || "N/A"} m/s</p>
                      </div>
                    </div>
                  </div>

                  {weatherAlerts.length > 0 &&
                    weatherAlerts.map((alert) => (
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
                <div className="text-center py-8">
                  <Cloud className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">{t("weather.unavailable")}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                {t("dashboard.upcomingTasks")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">{t("dashboard.noTasksScheduled")}</p>
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

      <AddCropModal
        open={showAddCropModal}
        onOpenChange={(open) => {
          setShowAddCropModal(open)
          if (!open) {
            fetchUserData()
          }
        }}
        fields={fields}
      />
    </div>
  )
}
