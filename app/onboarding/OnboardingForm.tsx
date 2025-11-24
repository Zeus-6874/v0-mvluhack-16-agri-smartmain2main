"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

const states = [
  "All India",
  "Maharashtra",
  "Punjab",
  "Gujarat",
  "Karnataka",
  "Andhra Pradesh",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Madhya Pradesh",
  "Rajasthan",
]
const landUnits = ["acre", "hectare", "bigha"]
const irrigationTypes = ["Canal", "Drip", "Sprinkler", "Rainfed", "Tube well", "Other"]

interface OnboardingFormProps {
  defaultName?: string
  defaultEmail?: string
}

export default function OnboardingForm({ defaultName = "", defaultEmail = "" }: OnboardingFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    full_name: defaultName,
    email: defaultEmail,
    phone: "",
    state: "Maharashtra",
    district: "",
    land_area: "",
    land_unit: "acre",
    primary_crop: "",
    experience_years: "",
    preferred_language: "en",
    irrigation: "",
    notes: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!form.full_name.trim()) {
      toast.error("Full name is required")
      return
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required")
      return
    }
    if (!form.district.trim()) {
      toast.error("District is required")
      return
    }
    if (!form.land_area) {
      toast.error("Land area is required")
      return
    }
    if (!form.irrigation) {
      toast.error("Irrigation type is required")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to save profile")
      }
      toast.success("Profile saved successfully!")
      router.push("/dashboard")
    } catch (error: any) {
      console.error("[v0] Profile save error:", error)
      toast.error(error.message ?? "Failed to save profile")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Complete Your Farm Profile</CardTitle>
          <CardDescription className="text-green-50">
            Help us personalize your AgriSmart experience with your farm details
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    required
                    placeholder="Your full name"
                    value={form.full_name}
                    onChange={(e) => setForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={form.email}
                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                    className="border-gray-300"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+91 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience (Years)</Label>
                  <Input
                    id="experience"
                    placeholder="Number of years"
                    type="number"
                    min="0"
                    value={form.experience_years}
                    onChange={(e) => setForm((prev) => ({ ...prev, experience_years: e.target.value }))}
                    className="border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Farm Location */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-800">Farm Location</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Select value={form.state} onValueChange={(value) => setForm((prev) => ({ ...prev, state: value }))}>
                    <SelectTrigger id="state" className="border-gray-300">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    placeholder="District name"
                    value={form.district}
                    onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))}
                    className="border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Farm Details */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-800">Farm Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_crop">Primary Crop</Label>
                  <Input
                    id="primary_crop"
                    placeholder="e.g., Wheat, Rice, Cotton"
                    value={form.primary_crop}
                    onChange={(e) => setForm((prev) => ({ ...prev, primary_crop: e.target.value }))}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="land_area">Land Area *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="land_area"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      min="0"
                      value={form.land_area}
                      onChange={(e) => setForm((prev) => ({ ...prev, land_area: e.target.value }))}
                      className="border-gray-300 flex-1"
                    />
                    <Select
                      value={form.land_unit}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, land_unit: value }))}
                    >
                      <SelectTrigger className="w-[100px] border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {landUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="irrigation">Primary Irrigation Type *</Label>
                <Select
                  value={form.irrigation}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, irrigation: value }))}
                >
                  <SelectTrigger id="irrigation" className="border-gray-300">
                    <SelectValue placeholder="Select irrigation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {irrigationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-800">Preferences</h3>
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <Select
                  value={form.preferred_language}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, preferred_language: value }))}
                >
                  <SelectTrigger id="language" className="border-gray-300">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Anything else we should know about your farm?"
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="border-gray-300 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition-all h-auto"
            >
              {submitting ? "Saving your profile..." : "Complete Profile & Go to Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
