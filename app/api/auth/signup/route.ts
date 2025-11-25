import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth/session"
import { getCollection, COLLECTIONS } from "@/lib/mongodb/collections"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const usersCollection = await getCollection(COLLECTIONS.USERS)

    // Check if user exists
    const existing = await usersCollection.findOne({ email: email.toLowerCase() })

    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create user
    const userId = crypto.randomUUID()
    const hashedPassword = Buffer.from(password).toString("base64") // Simple hash for demo

    await usersCollection.insertOne({
      _id: userId,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      created_at: new Date(),
      updated_at: new Date(),
    })

    console.log("[v0] User created successfully:", userId)

    // Create session
    await createSession(userId)

    return NextResponse.json({ success: true, userId })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
