"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n/context"

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

const districtsByState: Record<string, string[]> = {
  Maharashtra: [
    "Pune",
    "Mumbai",
    "Nagpur",
    "Nashik",
    "Aurangabad",
    "Solapur",
    "Kolhapur",
    "Satara",
    "Sangli",
    "Ahmednagar",
  ],
  Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Junagadh", "Gandhinagar"],
  Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur"],
  Haryana: ["Gurgaon", "Faridabad", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Allahabad", "Bareilly"],
  Default: ["Select State First"],
}

const villagesByDistrict: Record<string, string[]> = {
  Pune: ["Khed", "Maval", "Mulshi", "Bhor", "Baramati", "Indapur", "Daund", "Purandar"],
  Mumbai: ["Andheri", "Borivali", "Bandra", "Kurla", "Malad", "Goregaon", "Vikhroli"],
  Nagpur: ["Kamptee", "Ramtek", "Saoner", "Katol", "Narkhed", "Hingna", "Parseoni"],
  Default: ["Select District First"],
}

export default function ProfileSetupPage() {
  const router = useRouter()
  const { language, t } = useI18n()
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

      console.log("[v0] Profile created successfully:", data)
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("[v0] Profile setup error:", err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  const districts = formData.state
    ? districtsByState[formData.state] || districtsByState["Default"]
    : districtsByState["Default"]
  const villages = formData.district
    ? villagesByDistrict[formData.district] || villagesByDistrict["Default"]
    : villagesByDistrict["Default"]

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, rgb(240, 253, 244), rgb(240, 249, 255))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "42rem",
          padding: "2rem",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
          borderRadius: "0.5rem",
          backgroundColor: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "3rem",
              height: "3rem",
              background: "linear-gradient(to right, rgb(22, 163, 74), rgb(37, 99, 235))",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: "bold", fontSize: "0.875rem" }}>AS</span>
          </div>
        </div>

        <h1
          style={{
            fontSize: "1.875rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          {t("profile.title")}
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "rgb(75, 85, 99)",
            marginBottom: "2rem",
          }}
        >
          {t("profile.subtitle")}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                {t("profile.fullName")}
              </label>
              <input
                type="text"
                name="full_name"
                placeholder={t("profile.fullName")}
                value={formData.full_name}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid rgb(203, 213, 225)",
                  borderRadius: "0.375rem",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                {t("profile.phone")}
              </label>
              <input
                type="tel"
                name="phone"
                placeholder={t("profile.phone")}
                value={formData.phone}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid rgb(203, 213, 225)",
                  borderRadius: "0.375rem",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                {t("profile.state")}
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid rgb(203, 213, 225)",
                  borderRadius: "0.375rem",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                }}
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                {t("profile.district")}
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                disabled={!formData.state}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid rgb(203, 213, 225)",
                  borderRadius: "0.375rem",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  opacity: !formData.state ? 0.5 : 1,
                }}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                {t("profile.village")}
              </label>
              <select
                name="village"
                value={formData.village}
                onChange={handleChange}
                required
                disabled={!formData.district}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid rgb(203, 213, 225)",
                  borderRadius: "0.375rem",
                  fontFamily: "inherit",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  backgroundColor: "white",
                  opacity: !formData.district ? 0.5 : 1,
                }}
              >
                <option value="">Select Village</option>
                {villages.map((village) => (
                  <option key={village} value={village}>
                    {village}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              {t("profile.farmSize")}
            </label>
            <input
              type="number"
              name="land_area"
              placeholder="Enter farm size"
              value={formData.land_area}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid rgb(203, 213, 225)",
                borderRadius: "0.375rem",
                fontFamily: "inherit",
                fontSize: "1rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "rgb(254, 242, 242)",
                color: "rgb(185, 28, 28)",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              backgroundColor: loading ? "rgb(134, 239, 172)" : "rgb(22, 163, 74)",
              color: "white",
              borderRadius: "0.375rem",
              border: "none",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              fontFamily: "inherit",
            }}
          >
            {loading ? t("profile.saving") : t("profile.submit")}
          </button>
        </form>
      </div>
    </div>
  )
}
