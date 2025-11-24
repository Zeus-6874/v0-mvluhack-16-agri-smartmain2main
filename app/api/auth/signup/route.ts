import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createSession } from "@/lib/auth/session"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // Check if user exists
    const { data: existing } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).single()

    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create user
    const userId = crypto.randomUUID()
    const hashedPassword = Buffer.from(password).toString("base64") // Simple hash for demo

    const { error } = await supabase.from("users").insert({
      id: userId,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("[v0] Signup error:", error)
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Create session
    await createSession(userId)

    return NextResponse.json({ success: true, userId })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
