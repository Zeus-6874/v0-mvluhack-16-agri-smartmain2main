"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfileSetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    district: "",
    state: "",
    land_area: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
      router.push("/dashboard")
    } catch (err) {
      console.error("[v0] Profile setup error:", err)
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

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
          Complete Your Profile
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "rgb(75, 85, 99)",
            marginBottom: "2rem",
          }}
        >
          Help us know more about your farming to provide better recommendations
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              placeholder="Your name"
              value={formData.full_name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid rgb(203, 213, 225)",
                borderRadius: "0.375rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid rgb(203, 213, 225)",
                borderRadius: "0.375rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                District
              </label>
              <input
                type="text"
                name="district"
                placeholder="Your district"
                value={formData.district}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid rgb(203, 213, 225)",
                  borderRadius: "0.375rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                State
              </label>
              <input
                type="text"
                name="state"
                placeholder="Your state"
                value={formData.state}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid rgb(203, 213, 225)",
                  borderRadius: "0.375rem",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Land Area (hectares)
            </label>
            <input
              type="number"
              name="land_area"
              placeholder="Land area in hectares"
              value={formData.land_area}
              onChange={handleChange}
              required
              step="0.01"
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid rgb(203, 213, 225)",
                borderRadius: "0.375rem",
                fontFamily: "inherit",
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
            {loading ? "Setting up..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  )
}
