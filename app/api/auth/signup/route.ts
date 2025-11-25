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

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === SIGNUP START ===")

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

    // Validate input
    if (!email || !password) {
      console.log("[v0] Missing credentials")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      console.log("[v0] Password too short")
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    console.log("[v0] Credentials validated for:", email)

    // Connect to MongoDB
    let db
    try {
      console.log("[v0] Attempting MongoDB connection...")
      db = await getDatabase()
      console.log("[v0] MongoDB connected successfully")
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

    // Check if user exists
    try {
      console.log("[v0] Checking existing user...")
      const existing = await usersCollection.findOne({ email: email.toLowerCase() })

      if (existing) {
        console.log("[v0] User already exists")
        return NextResponse.json({ error: "User already exists" }, { status: 400 })
      }
      console.log("[v0] No existing user found, proceeding...")
    } catch (err) {
      console.error("[v0] Error checking existing user:", err)
      return NextResponse.json({ error: "Database query failed" }, { status: 500 })
    }

    // Create new user
    const userId = generateId()
    const hashedPassword = hashPassword(password)
    const isAdmin = email.toLowerCase() === (process.env.ADMIN_EMAIL || "admin@agrismart.com").toLowerCase()

    console.log("[v0] Creating user:", { userId, email: email.toLowerCase(), isAdmin })

    try {
      await usersCollection.insertOne({
        _id: userId,
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        is_admin: isAdmin,
        created_at: new Date(),
        updated_at: new Date(),
      })
      console.log("[v0] User inserted successfully")
    } catch (err) {
      console.error("[v0] Error inserting user:", err)
      return NextResponse.json(
        {
          error: "Failed to create user",
          details: err instanceof Error ? err.message : String(err),
        },
        { status: 500 },
      )
    }

    // Create session
    try {
      console.log("[v0] Creating session...")
      await createSession(userId)
      console.log("[v0] Session created successfully")
    } catch (err) {
      console.error("[v0] Error creating session:", err)
      // User is created but session failed - they can still login
      return NextResponse.json(
        {
          success: true,
          userId,
          isAdmin,
          warning: "User created but session failed. Please login.",
        },
        { status: 201 },
      )
    }

    console.log("[v0] === SIGNUP SUCCESS ===")
    return NextResponse.json({ success: true, userId, isAdmin }, { status: 201 })
  } catch (error) {
    console.error("[v0] === SIGNUP FATAL ERROR ===")
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
