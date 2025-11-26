"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HomePage() {
  const router = useRouter()
  const { language, setLanguage, t } = useI18n()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError(t("auth.passwordMismatch"))
        setLoading(false)
        return
      }

      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || t("auth.error"))
        setLoading(false)
        return
      }

      if (isLogin) {
        const profileResponse = await fetch("/api/profile")
        const profileData = await profileResponse.json()

        if (profileData.success && profileData.profile) {
          router.push("/dashboard")
        } else {
          router.push("/profile-setup")
        }
      } else {
        router.push("/profile-setup")
      }
    } catch (err) {
      setError(t("auth.error"))
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <div className="flex justify-end mb-4">
          <Select value={language} onValueChange={setLanguage}>
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

        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AS</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2">{t("auth.title")}</h1>
        <p className="text-center text-gray-600 mb-8">{t("auth.subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t("auth.email")}</label>
            <input
              type="email"
              name="email"
              placeholder={t("auth.emailPlaceholder")}
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t("auth.password")}</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium mb-2">{t("auth.confirmPassword")}</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t("common.loading") : isLogin ? t("auth.signIn") : t("auth.signUp")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
                setFormData({ email: "", password: "", confirmPassword: "" })
              }}
              className="ml-1 text-green-600 font-medium underline hover:text-green-700"
            >
              {isLogin ? t("auth.signUp") : t("auth.signIn")}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
