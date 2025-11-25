import { type NextRequest, NextResponse } from "next/server"
import { createSession } from "@/lib/auth/session"
import { getCollection, COLLECTIONS } from "@/lib/mongodb/collections"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Signup request received")

    const body = await request.json()
    console.log("[v0] Request body parsed:", { email: body.email })

    const { email, password } = body

    if (!email || !password) {
      console.log("[v0] Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log("[v0] Connecting to MongoDB...")
    const usersCollection = await getCollection(COLLECTIONS.USERS)
    console.log("[v0] MongoDB connection successful")

    // Check if user exists
    console.log("[v0] Checking if user exists:", email.toLowerCase())
    const existing = await usersCollection.findOne({ email: email.toLowerCase() })

    if (existing) {
      console.log("[v0] User already exists")
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const userId = crypto.randomUUID()
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + (process.env.JWT_SECRET || "fallback-secret"))
      .digest("hex")

    console.log("[v0] Creating user with ID:", userId)

    const isAdmin = email.toLowerCase() === (process.env.ADMIN_EMAIL || "admin@agrismart.com").toLowerCase()

    await usersCollection.insertOne({
      _id: userId,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      is_admin: isAdmin,
      created_at: new Date(),
      updated_at: new Date(),
    })

    console.log("[v0] User created successfully:", userId, "Admin:", isAdmin)

    console.log("[v0] Creating session...")
    await createSession(userId)
    console.log("[v0] Session created successfully")

    return NextResponse.json({ success: true, userId, isAdmin })
  } catch (error) {
    console.error("[v0] Signup error details:", error)
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
