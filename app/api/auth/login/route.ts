import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth/session"
import { getDatabase } from "@/lib/mongodb/client"
import type { MongoUser } from "@/types/mongo"

// Simple hash function (KEEP as-is if already in production)
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
    let body: { email?: string; password?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("[v0] Attempting login for:", email)

    // Connect to MongoDB
    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Find user with TYPE SAFETY
    const user = await usersCollection.findOne<MongoUser>({
      email: email.toLowerCase(),
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const hashedPassword = hashPassword(password)

    if (user.password_hash !== hashedPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Login success for:", user._id.toString())

    // Create session ✅ ObjectId → string
    await createSession(user._id.toString())

    // Return response ✅ ObjectId → string
    return NextResponse.json({
      success: true,
      userId: user._id.toString(),
      isAdmin: user.is_admin || false,
    })

  } catch (error) {
    console.error("[v0] LOGIN ERROR:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
