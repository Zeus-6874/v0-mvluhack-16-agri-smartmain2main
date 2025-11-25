import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, TrendingUp, MapPin } from "lucide-react"

interface Crop {
  id: number
  name: string
  area: number
  health: number
  daysToHarvest: number
  expectedYield: number
  image: string
}

interface CropCardProps {
  crop: Crop
  language: string
}

const cropEmojis: Record<string, string> = {
  Wheat: "🌾",
  गेहूं: "🌾",
  Corn: "🌽",
  मक्का: "🌽",
  Tomato: "🍅",
  टमाटर: "🍅",
  Onion: "🧅",
  प्याज: "🧅",
  Rice: "🍚",
  चावल: "🍚",
  Potato: "🥔",
  आलू: "🥔",
  Cotton: "🧶",
  कपास: "🧶",
  Sugarcane: "🎋",
  गन्ना: "🎋",
}

export default function CropCard({ crop, language }: CropCardProps) {
  const getHealthColor = (health: number) => {
    if (health >= 90) return "bg-green-500"
    if (health >= 75) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getHealthStatus = (health: number) => {
    if (health >= 90) return language === "hi" ? "उत्कृष्ट" : "Excellent"
    if (health >= 75) return language === "hi" ? "अच्छा" : "Good"
    return language === "hi" ? "चिंताजनक" : "Concerning"
  }

  const getHealthBadgeColor = (health: number) => {
    if (health >= 90) return "bg-green-100 text-green-800"
    if (health >= 75) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  // Get emoji for crop or default
  const cropEmoji = cropEmojis[crop.name] || "🌱"

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          {/* Crop Emoji Icon */}
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center text-3xl">
            {cropEmoji}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{crop.name}</h3>
              <Badge className={getHealthBadgeColor(crop.health)}>{getHealthStatus(crop.health)}</Badge>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1.5 text-gray-400" />
                <span>
                  {crop.area} {language === "hi" ? "एकड़" : "acres"}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-1.5 text-gray-400" />
                <span>
                  {crop.daysToHarvest} {language === "hi" ? "दिन बचे" : "days left"}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <TrendingUp className="h-4 w-4 mr-1.5 text-gray-400" />
                <span>
                  {crop.expectedYield} {language === "hi" ? "किलो अपेक्षित" : "kg expected"}
                </span>
              </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">{language === "hi" ? "स्वास्थ्य" : "Health"}</span>
                <span className="font-medium">{crop.health}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getHealthColor(crop.health)}`}
                  style={{ width: `${crop.health}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
