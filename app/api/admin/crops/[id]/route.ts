import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/utils"
import { getDb } from "@/lib/mongodb/client"
import { ObjectId } from "mongodb"

function assertAdmin(userId?: string | null) {
  const adminIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
  if (!userId) throw new Error("UNAUTHORIZED")
  if (adminIds.length > 0 && !adminIds.includes(userId)) throw new Error("FORBIDDEN")
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  try {
    const userId = await getCurrentUserId()
    assertAdmin(userId)

    const payload = await request.json()
    const db = await getDb()

    const result = await db.collection("crops").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          common_name: payload.common_name,
          local_name: payload.local_name,
          scientific_name: payload.scientific_name,
          category_id: payload.category_id,
          climate: payload.climate,
          soil_type: payload.soil_type,
          optimal_ph_range: payload.optimal_ph_range,
          water_requirements: payload.water_requirements,
          fertilizer_requirements: payload.fertilizer_requirements,
          planting_season: payload.planting_season,
          harvest_time: payload.harvest_time,
          average_yield: payload.average_yield,
          diseases: payload.diseases,
          disease_management: payload.disease_management,
          market_demand: payload.market_demand,
          image_url: payload.image_url,
          source: payload.source,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, crop: result })
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    console.error("Admin crop update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  try {
    const userId = await getCurrentUserId()
    assertAdmin(userId)

    const db = await getDb()
    const result = await db.collection("crops").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Crop not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      if (error.message === "FORBIDDEN") return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    console.error("Admin crop delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
