"use client"

import { useState } from "react"
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
} from "lucide-react"
import { useI18n } from "@/lib/i18n/context"
import CropCard from "@/components/CropCard"
import WeatherWidget from "@/components/WeatherWidget"

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

export default function DashboardClient({ profile }: DashboardClientProps) {
  const router = useRouter()
  const { language, t } = useI18n()
  const [loading, setLoading] = useState(false)

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
      label: language === "hi" ? "बाजार जानकारी" : language === "mr" ? "बाजार माहिती" : "Market Info",
      color: "bg-green-500",
      href: "/market-prices",
    },
    {
      icon: BookOpen,
      label: language === "hi" ? "विशेषज्ञ सलाह" : language === "mr" ? "तज्ञ सल्ला" : "Expert Advice",
      color: "bg-purple-500",
      href: "/knowledge",
    },
  ]

  // Upcoming tasks
  const upcomingTasks = [
    {
      id: 1,
      task: language === "hi" ? "मक्का में उर्वरक डालें" : "Apply fertilizer to corn field",
      date: "2024-01-15",
      priority: "high",
    },
    {
      id: 2,
      task: language === "hi" ? "गेहूं की सिंचाई करें" : "Irrigate wheat field",
      date: "2024-01-16",
      priority: "medium",
    },
    {
      id: 3,
      task: language === "hi" ? "टमाटर की कटाई करें" : "Harvest tomatoes",
      date: "2024-01-18",
      priority: "low",
    },
  ]

  // Stats data
  const stats = [
    {
      label: t("dashboard.totalArea"),
      value: profile?.farm_size || 0,
      unit: t("dashboard.hectares"),
      icon: Sprout,
      color: "text-green-600",
    },
    {
      label: t("dashboard.activeCrops"),
      value: activeCrops.length,
      unit: t("dashboard.crops"),
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      label: t("dashboard.avgYield"),
      value: "0",
      unit: "t/ha",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      label: t("dashboard.avgRainfall"),
      value: "0",
      unit: "mm",
      icon: CloudRain,
      color: "text-cyan-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t("dashboard.title")}</h1>
          <p className="text-gray-600 mt-1">
            {profile?.full_name ? `${t("dashboard.subtitle")} – ${profile.full_name}` : t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            className="bg-white text-gray-900 hover:bg-gray-50"
            onClick={() => router.push("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            {t("dashboard.settings")}
          </Button>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={() => router.push("/field-management")}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("dashboard.addCrop")}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold mt-1">
                    {stat.value} <span className="text-sm font-normal text-gray-500">{stat.unit}</span>
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-80`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Crops */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Crops */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sprout className="h-5 w-5 text-green-600" />
                <span>{language === "hi" ? "सक्रिय फसलें" : language === "mr" ? "सक्रिय पिके" : "Active Crops"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCrops.map((crop) => (
                  <CropCard key={crop.id} crop={crop} language={language} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center space-y-2 hover:bg-gray-50 bg-transparent"
                    onClick={() => router.push(action.href)}
                  >
                    <div className={`p-2 rounded-full ${action.color}`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm text-center">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Weather & Tasks */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <WeatherWidget language={language} />

          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <span>{t("dashboard.upcomingTasks")}</span>
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
                      className={`w-2 h-2 rounded-full mt-2 ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.task}</p>
                      <p className="text-xs text-gray-500">{task.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
