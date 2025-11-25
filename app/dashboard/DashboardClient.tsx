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
  Stethoscope,
  BookOpen,
  MapPin,
  Sun,
  Wind,
  Loader2,
} from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

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

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const location = profile?.district || profile?.state || "Delhi"
        const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
        const data = await response.json()
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

  // Sample data for active crops with proper translations
  const activeCrops = [
    {
      id: 1,
      name: language === "hi" ? "गेहूं" : language === "mr" ? "गहू" : "Wheat",
      area: 5.2,
      health: 92,
      daysToHarvest: 45,
      expectedYield: 2800,
      image: "wheat",
    },
    {
      id: 2,
      name: language === "hi" ? "मक्का" : language === "mr" ? "मका" : "Corn",
      area: 3.8,
      health: 88,
      daysToHarvest: 62,
      expectedYield: 3200,
      image: "corn",
    },
    {
      id: 3,
      name: language === "hi" ? "टमाटर" : language === "mr" ? "टोमॅटो" : "Tomato",
      area: 2.1,
      health: 95,
      daysToHarvest: 28,
      expectedYield: 4500,
      image: "tomato",
    },
    {
      id: 4,
      name: language === "hi" ? "प्याज" : language === "mr" ? "कांदा" : "Onion",
      area: 1.4,
      health: 78,
      daysToHarvest: 35,
      expectedYield: 2100,
      image: "onion",
    },
  ]

  // Quick actions configuration
  const quickActions = [
    {
      icon: Droplets,
      label: language === "hi" ? "मिट्टी विश्लेषण" : language === "mr" ? "माती विश्लेषण" : "Soil Analysis",
      color: "bg-blue-500",
      href: "/soil-health",
    },
    {
      icon: Stethoscope,
      label: language === "hi" ? "रोग जांच" : language === "mr" ? "रोग तपासणी" : "Disease Check",
      color: "bg-red-500",
      href: "/disease-detection",
    },
    {
      icon: BarChart3,
      label: language === "hi" ? "बाजार भाव" : language === "mr" ? "बाजार भाव" : "Market Prices",
      color: "bg-green-500",
      href: "/market-prices",
    },
    {
      icon: BookOpen,
      label: language === "hi" ? "फसल जानकारी" : language === "mr" ? "पीक माहिती" : "Crop Info",
      color: "bg-purple-500",
      href: "/encyclopedia",
    },
  ]

  // Upcoming tasks
  const upcomingTasks = [
    {
      id: 1,
      task:
        language === "hi" ? "मक्का में उर्वरक डालें" : language === "mr" ? "मक्यात खत घाला" : "Apply fertilizer to corn field",
      date: "2024-01-15",
      priority: "high",
    },
    {
      id: 2,
      task: language === "hi" ? "गेहूं की सिंचाई करें" : language === "mr" ? "गव्हाला पाणी द्या" : "Irrigate wheat field",
      date: "2024-01-16",
      priority: "medium",
    },
    {
      id: 3,
      task: language === "hi" ? "टमाटर की कटाई करें" : language === "mr" ? "टोमॅटोची कापणी करा" : "Harvest tomatoes",
      date: "2024-01-18",
      priority: "low",
    },
  ]

  // Stats data
  const stats = [
    {
      label: language === "hi" ? "कुल क्षेत्र" : language === "mr" ? "एकूण क्षेत्र" : "Total Area",
      value: profile?.farm_size || 12.5,
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
      value: "3.2",
      unit: "t/ha",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: language === "hi" ? "वर्षा" : language === "mr" ? "पाऊस" : "Rainfall",
      value: weather?.rainfall || "85",
      unit: "mm",
      icon: CloudRain,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
    },
  ]

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
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Sprout className="h-5 w-5 text-green-600" />
                <span>{language === "hi" ? "सक्रिय फसलें" : language === "mr" ? "सक्रिय पिके" : "Active Crops"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {activeCrops.map((crop) => (
                  <div
                    key={crop.id}
                    className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all cursor-pointer bg-white"
                    onClick={() => router.push("/field-management")}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-2xl">
                        {cropIcons[crop.image] || "🌱"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              crop.health >= 90
                                ? "bg-green-100 text-green-700"
                                : crop.health >= 70
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {crop.health >= 90
                              ? language === "hi"
                                ? "उत्तम"
                                : "Excellent"
                              : crop.health >= 70
                                ? language === "hi"
                                  ? "अच्छा"
                                  : "Good"
                                : language === "hi"
                                  ? "ध्यान दें"
                                  : "Attention"}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {crop.area} {language === "hi" ? "एकड़" : "acres"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {crop.daysToHarvest} {language === "hi" ? "दिन बाकी" : "days left"}
                            </span>
                          </div>
                        </div>
                        {/* Health bar */}
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500">{language === "hi" ? "स्वास्थ्य" : "Health"}</span>
                            <span className="font-medium">{crop.health}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                crop.health >= 90 ? "bg-green-500" : crop.health >= 70 ? "bg-yellow-500" : "bg-red-500"
                              }`}
                              style={{ width: `${crop.health}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center space-y-2 hover:bg-gray-50 bg-white border-gray-100"
                    onClick={() => router.push(action.href)}
                  >
                    <div className={`p-2.5 rounded-xl ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm text-center font-medium text-gray-700">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Weather & Tasks */}
        <div className="space-y-4 sm:space-y-6">
          {/* Weather Widget */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-white text-lg">
                <span>{language === "hi" ? "मौसम" : language === "mr" ? "हवामान" : "Weather"}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/10 h-8 px-2"
                  onClick={() => router.push("/weather")}
                >
                  {language === "hi" ? "और देखें" : "View More"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weatherLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-white/70" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">{weather?.temperature || 28}°C</p>
                      <p className="text-white/80 text-sm flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {profile?.district || profile?.state || "Delhi"}
                      </p>
                    </div>
                    <div className="text-5xl">
                      {weather?.condition?.toLowerCase().includes("rain")
                        ? "🌧️"
                        : weather?.condition?.toLowerCase().includes("cloud")
                          ? "☁️"
                          : weather?.condition?.toLowerCase().includes("sun")
                            ? "☀️"
                            : "🌤️"}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20">
                    <div className="text-center">
                      <Droplets className="h-4 w-4 mx-auto mb-1 text-white/80" />
                      <p className="text-sm font-medium">{weather?.humidity || 65}%</p>
                      <p className="text-xs text-white/60">{language === "hi" ? "नमी" : "Humidity"}</p>
                    </div>
                    <div className="text-center">
                      <Wind className="h-4 w-4 mx-auto mb-1 text-white/80" />
                      <p className="text-sm font-medium">{weather?.wind_speed || 12} km/h</p>
                      <p className="text-xs text-white/60">{language === "hi" ? "हवा" : "Wind"}</p>
                    </div>
                    <div className="text-center">
                      <Sun className="h-4 w-4 mx-auto mb-1 text-white/80" />
                      <p className="text-sm font-medium">{weather?.rainfall || 0} mm</p>
                      <p className="text-xs text-white/60">{language === "hi" ? "बारिश" : "Rain"}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Tasks */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calendar className="h-5 w-5 text-orange-500" />
                <span>{language === "hi" ? "आगामी कार्य" : language === "mr" ? "आगामी कार्ये" : "Upcoming Tasks"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => router.push("/field-management")}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{task.task}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{task.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 bg-transparent text-sm"
                onClick={() => router.push("/field-management")}
              >
                {language === "hi" ? "सभी कार्य देखें" : "View All Tasks"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
