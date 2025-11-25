import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/utils"
import { getDb } from "@/lib/mongodb/client"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fieldId = searchParams.get("field_id")
    const status = searchParams.get("status")

    const db = await getDb()

    const filter: any = {}

    // First verify fields belong to user
    const userFields = await db.collection("fields").find({ farmer_id: userId }).project({ _id: 1 }).toArray()

    const fieldIds = userFields.map((f) => f._id)
    filter.field_id = { $in: fieldIds.map((id) => id.toString()) }

    if (fieldId) {
      filter.field_id = fieldId
    }

    if (status) {
      filter.status = status
    }

    const cropCycles = await db.collection("crop_cycles").find(filter).sort({ created_at: -1 }).toArray()

    return NextResponse.json({
      success: true,
      crop_cycles: cropCycles || [],
      total: cropCycles?.length || 0,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { field_id, crop_name, variety, planting_date, expected_harvest_date, notes } = body

    // Validate required fields
    if (!field_id || !crop_name) {
      return NextResponse.json(
        {
          error: "Field ID and crop name are required",
        },
        { status: 400 },
      )
    }

    const db = await getDb()

    const field = await db.collection("fields").findOne({
      _id: new ObjectId(field_id),
      farmer_id: userId,
    })

    if (!field) {
      return NextResponse.json(
        {
          error: "Field not found or access denied",
        },
        { status: 404 },
      )
    }

    const overlappingCycles = await db
      .collection("crop_cycles")
      .find({
        field_id,
        status: { $in: ["planning", "planted", "growing"] },
      })
      .limit(1)
      .toArray()

    if (overlappingCycles.length > 0) {
      return NextResponse.json(
        {
          error: "Field already has an active crop cycle",
        },
        { status: 400 },
      )
    }

    const result = await db.collection("crop_cycles").insertOne({
      field_id,
      crop_name: crop_name.trim(),
      variety: variety?.trim() || null,
      planting_date: planting_date || null,
      expected_harvest_date: expected_harvest_date || null,
      status: "planning",
      notes: notes?.trim() || null,
      created_at: new Date(),
      updated_at: new Date(),
    })

    const cropCycle = await db.collection("crop_cycles").findOne({ _id: result.insertedId })

    return NextResponse.json({
      success: true,
      crop_cycle: cropCycle,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
