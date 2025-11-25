import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { getCollection, COLLECTIONS, isUserAdmin } from "@/lib/mongodb/collections"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || !(await isUserAdmin(session.userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const farmersCollection = await getCollection(COLLECTIONS.FARMERS)
    const farmers = await farmersCollection.find({}).sort({ created_at: -1 }).limit(50).toArray()

    return NextResponse.json({ success: true, farmers })
  } catch (error) {
    console.error("[v0] Fetch farmers error:", error)
    return NextResponse.json({ error: "Failed to fetch farmers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !(await isUserAdmin(session.userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const farmersCollection = await getCollection(COLLECTIONS.FARMERS)

    const result = await farmersCollection.insertOne({
      ...data,
      farm_size: data.farm_size ? Number.parseFloat(data.farm_size) : null,
      created_at: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("[v0] Add farmer error:", error)
    return NextResponse.json({ error: "Failed to add farmer" }, { status: 500 })
  }
}
