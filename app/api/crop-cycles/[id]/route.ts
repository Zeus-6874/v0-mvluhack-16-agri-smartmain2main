import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/utils"
import { getDb } from "@/lib/mongodb/client"
import { ObjectId } from "mongodb"

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      crop_name,
      variety,
      planting_date,
      expected_harvest_date,
      actual_harvest_date,
      status,
      notes,
    } = body

    const db = await getDb()

    const cropCycle = await db.collection("crop_cycles").findOne({
      _id: new ObjectId(id),
    })

    if (!cropCycle) {
      return NextResponse.json({ error: "Crop cycle not found" }, { status: 404 })
    }

    const field = await db.collection("fields").findOne({
      _id: new ObjectId(cropCycle.field_id),
      user_id: userId,
    })

    if (!field) {
      // 403 is “Forbidden” (user is logged in but not allowed)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const result = await db.collection("crop_cycles").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          crop_name: crop_name?.trim(),
          variety: variety?.trim() || null,
          planting_date: planting_date ? new Date(planting_date) : null,
          expected_harvest_date: expected_harvest_date ? new Date(expected_harvest_date) : null,
          actual_harvest_date: actual_harvest_date ? new Date(actual_harvest_date) : null,
          status,
          notes: notes?.trim() || null,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    // Safety check: if somehow nothing was updated
    if (!result.value) {
      return NextResponse.json({ error: "Crop cycle not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, crop_cycle: result.value })
  } catch (error) {
    console.error("[v0] API Error:", error)
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
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()

    const cropCycle = await db.collection("crop_cycles").findOne({
      _id: new ObjectId(id),
    })

    if (!cropCycle) {
      return NextResponse.json({ error: "Crop cycle not found" }, { status: 404 })
    }

    const field = await db.collection("fields").findOne({
      _id: new ObjectId(cropCycle.field_id),
      user_id: userId,
    })

    if (!field) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await db.collection("crop_cycles").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true, message: "Crop cycle deleted successfully" })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
