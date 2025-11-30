"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslate, useTolgee } from "@tolgee/react"
import { maharashtraData, indianStates } from "@/lib/location-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const ProfileSetupPage = () => {
  const router = useRouter()
  const { t } = useTranslate()
  const tolgee = useTolgee(["language"])
  const language = tolgee.getLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    state: "",
    district: "",
    village: "",
    land_area: "",
  })

  const districts = formData.state === "Maharashtra" ? maharashtraData.districts.map((d) => d.name) : []

  const villages = formData.district
    ? maharashtraData.districts.find((d) => d.name === formData.district)?.villages || []
    : []

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    if (name === "state") {
      setFormData({ ...formData, state: value, district: "", village: "" })
    } else if (name === "district") {
      setFormData({ ...formData, district: value, village: "" })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to save profile")
        setLoading(false)
        return
      }

      window.location.href = "/dashboard"
    } catch (err) {
      console.error("Profile setup error:", err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8">
        <div className="flex justify-end mb-4">
          <Select value={language} onValueChange={(val) => tolgee.changeLanguage(val)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="mr">मराठी</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AS</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">{t("profile.title")}</h1>
        <p className="text-center text-gray-600 mb-8">{t("profile.subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("profile.fullName")}</label>
              <input
                type="text"
                name="full_name"
                placeholder={t("profile.fullName")}
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("profile.phone")}</label>
              <input
                type="tel"
                name="phone"
                placeholder={t("profile.phone")}
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("profile.state")}</label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white"
              >
                <option value="">{t("profile.selectState")}</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("profile.district")}</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.state || formData.state !== "Maharashtra"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">{t("profile.selectDistrict")}</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("profile.village")}</label>
              <select
                name="village"
                value={formData.village}
                onChange={handleChange}
                required
                disabled={!formData.district}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">{t("profile.selectVillage")}</option>
                {villages.map((village) => (
                  <option key={village} value={village}>
                    {village}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("profile.farmSize")}</label>
            <input
              type="number"
              name="land_area"
              placeholder={t("profile.enterFarmSize")}
              value={formData.land_area}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>

          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {loading ? t("profile.saving") : t("profile.submit")}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileSetupPage
