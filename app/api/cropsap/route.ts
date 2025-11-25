import { NextResponse, type NextRequest } from "next/server"
import { getDb } from "@/lib/mongodb/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const district = searchParams.get("district")
    const crop = searchParams.get("crop")
    const severity = searchParams.get("severity")

    const db = await getDb()
    const filter: any = {}

    if (district) {
      filter.district = { $regex: district, $options: "i" }
    }

    if (crop) {
      filter.crop = { $regex: crop, $options: "i" }
    }

    if (severity) {
      filter.severity = severity
    }

    const data = await db.collection("cropsap_alerts").find(filter).sort({ reported_on: -1 }).limit(100).toArray()

    return NextResponse.json({ success: true, alerts: data })
  } catch (error) {
    console.error("[v0] CROPSAP API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
