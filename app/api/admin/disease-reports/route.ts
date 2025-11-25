import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { getCollection, COLLECTIONS, isUserAdmin } from "@/lib/mongodb/collections"

export async function GET() {
  try {
    const session = await getSession()
    if (!session || !(await isUserAdmin(session.userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reportsCollection = await getCollection(COLLECTIONS.DISEASE_REPORTS)
    const reports = await reportsCollection.find({}).sort({ reported_date: -1 }).limit(50).toArray()

    return NextResponse.json({ success: true, reports })
  } catch (error) {
    console.error("[v0] Fetch disease reports error:", error)
    return NextResponse.json({ error: "Failed to fetch disease reports" }, { status: 500 })
  }
}
