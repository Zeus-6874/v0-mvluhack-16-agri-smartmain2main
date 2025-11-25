import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth/session"
import { getDatabase } from "@/lib/mongodb/client"

function hashPassword(password: string): string {
  const secret = process.env.JWT_SECRET || "fallback-secret"
  let hash = 0
  const str = password + secret
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36)
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === LOGIN START ===")

    // Parse request body
    let body
    try {
      body = await request.json()
      console.log("[v0] Body parsed successfully")
    } catch (err) {
      console.error("[v0] Failed to parse body:", err)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { email, password } = body

    if (!email || !password) {
      console.log("[v0] Missing credentials")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("[v0] Attempting login for:", email)

    // Connect to MongoDB
    let db
    try {
      console.log("[v0] Connecting to MongoDB...")
      db = await getDatabase()
      console.log("[v0] MongoDB connected")
    } catch (err) {
      console.error("[v0] MongoDB connection failed:", err)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      )
    }

    const usersCollection = db.collection("users")

    // Find user
    let user
    try {
      console.log("[v0] Searching for user...")
      user = await usersCollection.findOne({ email: email.toLowerCase() })
      console.log("[v0] User query complete:", user ? "found" : "not found")
    } catch (err) {
      console.error("[v0] Error finding user:", err)
      return NextResponse.json({ error: "Database query failed" }, { status: 500 })
    }

    if (!user) {
      console.log("[v0] User not found")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const hashedPassword = hashPassword(password)
    console.log("[v0] Password hash generated")

    if (user.password_hash !== hashedPassword) {
      console.log("[v0] Password mismatch")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Password verified, user ID:", user._id)

    // Create session
    try {
      console.log("[v0] Creating session...")
      await createSession(user._id)
      console.log("[v0] Session created successfully")
    } catch (err) {
      console.error("[v0] Error creating session:", err)
      return NextResponse.json(
        {
          error: "Failed to create session",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      )
    }

    console.log("[v0] === LOGIN SUCCESS ===")
    return NextResponse.json({
      success: true,
      userId: user._id,
      isAdmin: user.is_admin || false,
    })
  } catch (error) {
    console.error("[v0] === LOGIN FATAL ERROR ===")
    console.error("[v0] Error:", error)
    console.error("[v0] Stack:", error instanceof Error ? error.stack : "No stack")

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
        type: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 },
    )
  }
}
