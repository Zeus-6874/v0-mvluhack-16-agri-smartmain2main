import { NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/utils"
import { getDb } from "@/lib/mongodb/client"

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()
    const user = await db.collection("users").findOne({ user_id: userId })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isAdmin = user.email === "admin@agrismart.com" || user.is_admin === true

    return NextResponse.json({
      success: true,
      isAdmin,
      user: {
        email: user.email,
        is_admin: isAdmin,
      },
    })
  } catch (error) {
    console.error("[v0] Admin verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
