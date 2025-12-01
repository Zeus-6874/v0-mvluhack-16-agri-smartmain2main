"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/Navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTranslate, useTolgee } from "@tolgee/react"
import { User, Bell, Globe, Save, Loader2, Check } from "lucide-react"
import { maharashtraData, indianStates } from "@/lib/location-data"

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

export default function SettingsPage() {
  const router = useRouter()
  const { t } = useTranslate()
  const tolgee = useTolgee(["language"])
  const language = tolgee.getLanguage() || "en"
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [notifications, setNotifications] = useState({
    weather: true,
    market: true,
    disease: true,
    tasks: true,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile")
      const data = await response.json()
      if (data.success && data.profile) {
        setProfile({
          full_name: data.profile.name || "",
          phone: data.profile.phone || "",
          state: data.profile.state || "",
          district: data.profile.district || "",
          village: data.profile.village || "",
          farm_size: data.profile.farm_size || 0,
          main_crops: data.profile.main_crops || "",
          soil_type: data.profile.soil_type || "",
          irrigation_type: data.profile.irrigation_type || "",
        })
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      const data = await response.json()
      if (data.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error("Failed to save profile:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleProfileChange = (field: keyof Profile, value: string | number) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const districts = profile?.state === "Maharashtra" ? maharashtraData.districts.map((d) => d.name) : indianStates

  const villages = profile?.district
    ? maharashtraData.districts.find((d) => d.name === profile.district)?.villages || []
    : []

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t("settings.title")}</h1>
          <p className="text-gray-600 mt-1">{t("settings.subtitle")}</p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-600" />
                <span>{t("settings.profile")}</span>
              </CardTitle>
              <CardDescription>
                {language === "hi"
                  ? "अपनी व्यक्तिगत जानकारी अपडेट करें"
                  : language === "mr"
                    ? "तुमची वैयक्तिक माहिती अद्यतनित करा"
                    : "Update your personal information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("profile.fullName")}</Label>
                  <Input
                    value={profile?.full_name || ""}
                    onChange={(e) => handleProfileChange("full_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("profile.phone")}</Label>
                  <Input value={profile?.phone || ""} onChange={(e) => handleProfileChange("phone", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>{t("profile.state")}</Label>
                  <Select value={profile?.state || ""} onValueChange={(value) => handleProfileChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("profile.district")}</Label>
                  <Select
                    value={profile?.district || ""}
                    onValueChange={(value) => handleProfileChange("district", value)}
                    disabled={!profile?.state}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("profile.village")}</Label>
                  <Select
                    value={profile?.village || ""}
                    onValueChange={(value) => handleProfileChange("village", value)}
                    disabled={!profile?.district}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Village" />
                    </SelectTrigger>
                    <SelectContent>
                      {villages.map((village) => (
                        <SelectItem key={village} value={village}>
                          {village}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("profile.farmSize")}</Label>
                  <Input
                    type="number"
                    value={profile?.farm_size || ""}
                    onChange={(e) => handleProfileChange("farm_size", Number.parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <span>{t("settings.language")}</span>
              </CardTitle>
              <CardDescription>
                {language === "hi"
                  ? "अपनी पसंदीदा भाषा चुनें"
                  : language === "mr"
                    ? "तुमची पसंतीची भाषा निवडा"
                    : "Choose your preferred language"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={language} onValueChange={(val) => tolgee.changeLanguage(val)}>
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-yellow-600" />
                <span>{t("settings.notifications")}</span>
              </CardTitle>
              <CardDescription>
                {language === "hi"
                  ? "अपनी सूचना प्राथमिकताएं प्रबंधित करें"
                  : language === "mr"
                    ? "तुमची सूचना प्राधान्ये व्यवस्थापित करा"
                    : "Manage your notification preferences"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.weatherAlerts")}</p>
                  <p className="text-sm text-gray-500">
                    {language === "hi"
                      ? "मौसम परिवर्तन की सूचनाएं प्राप्त करें"
                      : language === "mr"
                        ? "हवामान बदलाच्या सूचना मिळवा"
                        : "Get notified about weather changes"}
                  </p>
                </div>
                <Switch
                  checked={notifications.weather}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weather: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.priceAlerts")}</p>
                  <p className="text-sm text-gray-500">
                    {language === "hi"
                      ? "मूल्य परिवर्तन की सूचनाएं"
                      : language === "mr"
                        ? "किंमत बदलाच्या सूचना"
                        : "Price change notifications"}
                  </p>
                </div>
                <Switch
                  checked={notifications.market}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, market: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.diseaseAlerts")}</p>
                  <p className="text-sm text-gray-500">
                    {language === "hi"
                      ? "फसल रोग चेतावनी"
                      : language === "mr"
                        ? "पीक रोग चेतावणी"
                        : "Crop disease warnings"}
                  </p>
                </div>
                <Switch
                  checked={notifications.disease}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, disease: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("settings.taskReminders")}</p>
                  <p className="text-sm text-gray-500">
                    {language === "hi"
                      ? "आगामी कार्यों की याद दिलाएं"
                      : language === "mr"
                        ? "आगामी कार्यांची आठवण"
                        : "Reminders for upcoming tasks"}
                  </p>
                </div>
                <Switch
                  checked={notifications.tasks}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, tasks: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : saved ? (
                <Check className="h-4 w-4 mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saved
                ? language === "hi"
                  ? "सहेजा गया!"
                  : language === "mr"
                    ? "जतन केले!"
                    : "Saved!"
                : language === "hi"
                  ? "सहेजें"
                  : language === "mr"
                    ? "जतन करा"
                    : "Save Changes"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
