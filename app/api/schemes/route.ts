import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get("state")
    const category = searchParams.get("category")

    const db = await getDb()
    const filter: any = { is_active: true }

    if (state && state !== "All India") {
      filter.$or = [{ state: state }, { state: "All India" }]
    }

    if (category) {
      filter.category = category
    }

    const schemesData = await db.collection("schemes").find(filter).sort({ scheme_name: 1 }).toArray()

    return NextResponse.json({
      success: true,
      schemes: schemesData || [],
      total: schemesData?.length || 0,
      filters: { state, category },
    })
  } catch (error) {
    console.error("[v0] Schemes API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
