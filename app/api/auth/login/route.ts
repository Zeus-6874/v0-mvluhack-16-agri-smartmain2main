import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth/session"
import { getCollection, COLLECTIONS } from "@/lib/mongodb/collections"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Login request received")

    const { email, password } = await request.json()

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("[v0] Connecting to MongoDB...")
    const usersCollection = await getCollection(COLLECTIONS.USERS)
    console.log("[v0] MongoDB connection successful")

    // Find user
    console.log("[v0] Finding user:", email.toLowerCase())
    const user = await usersCollection.findOne({ email: email.toLowerCase() })

    if (!user) {
      console.log("[v0] User not found")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + (process.env.JWT_SECRET || "fallback-secret"))
      .digest("hex")

    if (user.password_hash !== hashedPassword) {
      console.log("[v0] Invalid password")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] User logged in successfully:", user._id)

    // Create session
    console.log("[v0] Creating session...")
    await createSession(user._id)
    console.log("[v0] Session created successfully")

    return NextResponse.json({ success: true, userId: user._id })
  } catch (error) {
    console.error("[v0] Login error details:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
