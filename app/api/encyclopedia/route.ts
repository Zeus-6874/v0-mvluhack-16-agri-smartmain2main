import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const crop = searchParams.get("crop")

    const db = await getDb()
    const filter: any = {}

    if (search) {
      filter.$or = [
        { crop_name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ]
    }

    if (crop) {
      filter.crop_name = crop
    }

    const encyclopediaData = await db.collection("encyclopedia").find(filter).sort({ crop_name: 1 }).toArray()

    return NextResponse.json({
      success: true,
      crops: encyclopediaData || [],
      total: encyclopediaData?.length || 0,
      filters: { search, crop },
    })
  } catch (error) {
    console.error("[v0] Encyclopedia API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
