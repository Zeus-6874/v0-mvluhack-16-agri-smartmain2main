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
import { useI18n } from "@/lib/i18n/context"
import { User, Bell, Globe, Save, Loader2, Check } from "lucide-react"

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
  const { language, setLanguage, t } = useI18n()
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
        setProfile(data.profile)
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
          <h1 className="text-2xl font-bold text-gray-900">
            {language === "hi" ? "सेटिंग्स" : language === "mr" ? "सेटिंग्ज" : "Settings"}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === "hi"
              ? "अपनी प्रोफ़ाइल और प्राथमिकताएं प्रबंधित करें"
              : language === "mr"
                ? "तुमचे प्रोफाइल आणि प्राधान्ये व्यवस्थापित करा"
                : "Manage your profile and preferences"}
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-600" />
                <span>{language === "hi" ? "प्रोफ़ाइल" : "Profile"}</span>
              </CardTitle>
              <CardDescription>
                {language === "hi" ? "अपनी व्यक्तिगत जानकारी अपडेट करें" : "Update your personal information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{language === "hi" ? "पूरा नाम" : "Full Name"}</Label>
                  <Input
                    value={profile?.full_name || ""}
                    onChange={(e) => handleProfileChange("full_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === "hi" ? "फ़ोन नंबर" : "Phone Number"}</Label>
                  <Input value={profile?.phone || ""} onChange={(e) => handleProfileChange("phone", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{language === "hi" ? "राज्य" : "State"}</Label>
                  <Input value={profile?.state || ""} onChange={(e) => handleProfileChange("state", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{language === "hi" ? "जिला" : "District"}</Label>
                  <Input
                    value={profile?.district || ""}
                    onChange={(e) => handleProfileChange("district", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === "hi" ? "गांव" : "Village"}</Label>
                  <Input
                    value={profile?.village || ""}
                    onChange={(e) => handleProfileChange("village", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === "hi" ? "खेत का आकार (एकड़)" : "Farm Size (acres)"}</Label>
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
                <span>{language === "hi" ? "भाषा" : "Language"}</span>
              </CardTitle>
              <CardDescription>
                {language === "hi" ? "अपनी पसंदीदा भाषा चुनें" : "Choose your preferred language"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "hi" | "mr")}>
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
                <span>{language === "hi" ? "सूचनाएं" : "Notifications"}</span>
              </CardTitle>
              <CardDescription>
                {language === "hi" ? "अपनी सूचना प्राथमिकताएं प्रबंधित करें" : "Manage your notification preferences"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{language === "hi" ? "मौसम अलर्ट" : "Weather Alerts"}</p>
                  <p className="text-sm text-gray-500">
                    {language === "hi" ? "मौसम परिवर्तन की सूचनाएं प्राप्त करें" : "Get notified about weather changes"}
                  </p>
                </div>
                <Switch
                  checked={notifications.weather}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, weather: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{language === "hi" ? "बाजार अपडेट" : "Market Updates"}</p>
                  <p className="text-sm text-gray-500">
                    {language === "hi" ? "मूल्य परिवर्तन की सूचनाएं" : "Price change notifications"}
                  </p>
                </div>
                <Switch
                  checked={notifications.market}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, market: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{language === "hi" ? "रोग अलर्ट" : "Disease Alerts"}</p>
                  <p className="text-sm text-gray-500">
                    {language === "hi" ? "फसल रोग चेतावनी" : "Crop disease warnings"}
                  </p>
                </div>
                <Switch
                  checked={notifications.disease}
                  onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, disease: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{language === "hi" ? "कार्य रिमाइंडर" : "Task Reminders"}</p>
                  <p className="text-sm text-gray-500">
                    {language === "hi" ? "आगामी कार्यों की याद दिलाएं" : "Reminders for upcoming tasks"}
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
              {saved ? (language === "hi" ? "सहेजा गया!" : "Saved!") : language === "hi" ? "सहेजें" : "Save Changes"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
