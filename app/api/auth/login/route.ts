import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth/session"
import { getCollection, COLLECTIONS } from "@/lib/mongodb/collections"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const usersCollection = await getCollection(COLLECTIONS.USERS)

    // Find user
    const user = await usersCollection.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const hashedPassword = Buffer.from(password).toString("base64")
    if (user.password_hash !== hashedPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] User logged in successfully:", user._id)

    // Create session
    await createSession(user._id)

    return NextResponse.json({ success: true, userId: user._id })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
