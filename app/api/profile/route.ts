import { NextResponse, type NextRequest } from "next/server"
import { getCurrentUserId } from "@/lib/auth/utils"
import { getCollection, COLLECTIONS } from "@/lib/mongodb/collections"

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const farmersCollection = await getCollection(COLLECTIONS.FARMERS)
    const profile = await farmersCollection.findOne({ user_id: userId })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error("[v0] Profile GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await request.json()
    console.log("[v0] Creating/updating profile for user:", userId)

    const farmersCollection = await getCollection(COLLECTIONS.FARMERS)
    const existingProfile = await farmersCollection.findOne({ user_id: userId })

    const profileData = {
      user_id: userId,
      name: payload.full_name,
      phone: payload.phone,
      state: payload.state,
      district: payload.district,
      village: payload.village || "",
      location: `${payload.village || payload.district}, ${payload.district}, ${payload.state}`,
      farm_size: payload.land_area ? Number(payload.land_area) : payload.farm_size ? Number(payload.farm_size) : null,
      updated_at: new Date(),
    }

    let result
    if (existingProfile) {
      result = await farmersCollection.findOneAndUpdate(
        { user_id: userId },
        { $set: profileData },
        { returnDocument: "after" },
      )
    } else {
      result = await farmersCollection.insertOne({
        ...profileData,
        created_at: new Date(),
      })
      result = await farmersCollection.findOne({ user_id: userId })
    }

    console.log("[v0] Profile saved successfully")
    return NextResponse.json({ success: true, profile: result })
  } catch (error) {
    console.error("[v0] Profile POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
