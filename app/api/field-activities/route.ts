import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/utils"
import { getDb } from "@/lib/mongodb/client"
import { ObjectId, type Filter, type Document } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const cropCycleId = searchParams.get("crop_cycle_id")
    const activityType = searchParams.get("activity_type")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const db = await getDb()

    const filter: Filter<Document> = {}
    if (cropCycleId) {
      filter.crop_cycle_id = cropCycleId
    }
    if (activityType) {
      filter.activity_type = activityType
    }

    const activities = await db
      .collection("field_activities")
      .find(filter)
      .sort({ activity_date: -1 })
      .limit(limit)
      .toArray()

    return NextResponse.json({ success: true, activities, total: activities.length })
  } catch (error) {
    console.error("[v0] API Error:", error)
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
    const { crop_cycle_id, activity_type, activity_date, materials_used, cost, notes } = body

    if (!crop_cycle_id || !activity_type) {
      return NextResponse.json({ error: "Crop cycle ID and activity type are required" }, { status: 400 })
    }

    const db = await getDb()

    const cropCycle = await db.collection("crop_cycles").findOne({ _id: new ObjectId(crop_cycle_id) })
    if (!cropCycle) {
      return NextResponse.json({ error: "Crop cycle not found" }, { status: 404 })
    }

    const field = await db.collection("fields").findOne({
      _id: new ObjectId(cropCycle.field_id),
      user_id: userId,
    })

    if (!field) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const activity = {
      user_id: userId,
      field_id: cropCycle.field_id,
      crop_cycle_id: new ObjectId(crop_cycle_id),
      activity_type: activity_type.trim(),
      date: activity_date ? new Date(activity_date) : new Date(),
      cost: cost ? Number.parseFloat(cost) : 0,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await db.collection("field_activities").insertOne(activity)

    return NextResponse.json({ success: true, activity: { ...activity, _id: result.insertedId } })
  } catch (error) {
    console.error("[v0] API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
