import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/utils"
import { getDb } from "@/lib/mongodb/client"
import type { MongoField } from "@/types/mongo"

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDb()

    const fields = await db
      .collection("fields")
      .find<MongoField>({ user_id: userId })
      .sort({ created_at: -1 })
      .toArray()

    return NextResponse.json({
      success: true,
      fields: fields || [],
      total: fields?.length || 0,
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
    const { field_name, area_hectares, coordinates, soil_type, irrigation_type } = body

    // Validate required fields
    if (!field_name || !area_hectares) {
      return NextResponse.json(
        {
          error: "Field name and area are required",
        },
        { status: 400 },
      )
    }

    if (area_hectares <= 0) {
      return NextResponse.json(
        {
          error: "Area must be greater than 0",
        },
        { status: 400 },
      )
    }

    const db = await getDb()

    const result = await db.collection("fields").insertOne({
      user_id: userId,
      name: field_name.trim(),
      area: Number.parseFloat(area_hectares),
      location: coordinates || "",
      soil_type: soil_type || "Unknown",
      irrigation_type: irrigation_type || "Rainfed",
      created_at: new Date(),
      updated_at: new Date(),
    })

    const field = await db.collection("fields").findOne<MongoField>({ _id: result.insertedId })

    return NextResponse.json({
      success: true,
      field,
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
