import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/utils"
import { getDb } from "@/lib/mongodb/client"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()

    const field = await db.collection("fields").findOne({
      _id: new ObjectId(id),
      farmer_id: userId,
    })

    if (!field) {
      return NextResponse.json({ error: "Field not found" }, { status: 404 })
    }

    // Fetch related crop cycles
    const cropCycles = await db.collection("crop_cycles").find({ field_id: id }).toArray()

    return NextResponse.json({ success: true, field: { ...field, crop_cycles: cropCycles } })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { field_name, area_hectares, coordinates, soil_type, irrigation_type } = body

    if (!field_name || !area_hectares) {
      return NextResponse.json({ error: "Field name and area are required" }, { status: 400 })
    }

    if (area_hectares <= 0) {
      return NextResponse.json({ error: "Area must be greater than 0" }, { status: 400 })
    }

    const db = await getDb()

    const result = await db.collection("fields").findOneAndUpdate(
      { _id: new ObjectId(id), farmer_id: userId },
      {
        $set: {
          field_name: field_name.trim(),
          area_hectares: Number.parseFloat(area_hectares),
          coordinates: coordinates || null,
          soil_type: soil_type || null,
          irrigation_type: irrigation_type || null,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Field not found or update failed" }, { status: 404 })
    }

    return NextResponse.json({ success: true, field: result })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()

    // Check for active crop cycles
    const activeCycles = await db
      .collection("crop_cycles")
      .find({ field_id: id, status: { $in: ["planning", "planted", "growing"] } })
      .limit(1)
      .toArray()

    if (activeCycles.length > 0) {
      return NextResponse.json({ error: "Cannot delete field with active crop cycles" }, { status: 400 })
    }

    const result = await db.collection("fields").deleteOne({
      _id: new ObjectId(id),
      farmer_id: userId,
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete field" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Field deleted successfully" })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
