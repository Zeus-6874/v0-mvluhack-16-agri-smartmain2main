import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth/session"
import { getDatabase } from "@/lib/mongodb/client"
import type { MongoUser } from "@/types/mongo"

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
    console.log("[v0] === SIGNUP START ===")

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

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const existing = await usersCollection.findOne<MongoUser>({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = hashPassword(password)
    const isAdmin = email.toLowerCase() === (process.env.ADMIN_EMAIL || "admin@agrismart.com").toLowerCase()

    // ✅ Insert user (MongoDB auto creates _id)
    const result = await usersCollection.insertOne({
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      is_admin: isAdmin,
      created_at: new Date(),
      updated_at: new Date(),
    })

    // ✅ Convert ObjectId -> string
    const userId = result.insertedId.toString()

    // ✅ Create session
    await createSession(userId)

    return NextResponse.json({ success: true, userId, isAdmin }, { status: 201 })
  } catch (error) {
    console.error("[v0] SIGNUP ERROR:", error)

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
