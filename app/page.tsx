"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
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
        setError("Passwords do not match")
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
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      if (isLogin) {
        // Check if user has profile
        const profileResponse = await fetch("/api/profile")
        const profileData = await profileResponse.json()

        if (profileData.success && profileData.profile) {
          router.push("/dashboard")
        } else {
          router.push("/profile-setup")
        }
      } else {
        // After signup, always go to profile setup
        router.push("/profile-setup")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
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
          maxWidth: "28rem",
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
          AgriSmart
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "rgb(75, 85, 99)",
            marginBottom: "2rem",
          }}
        >
          Empower Your Farming with AI
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              value={formData.email}
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
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
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

          {!isLogin && (
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.5rem" }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
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
          )}

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
            {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", color: "rgb(75, 85, 99)" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
                setFormData({ email: "", password: "", confirmPassword: "" })
              }}
              style={{
                marginLeft: "0.25rem",
                color: "rgb(22, 163, 74)",
                fontWeight: "500",
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
