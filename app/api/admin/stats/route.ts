import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { getCollection, COLLECTIONS, isUserAdmin } from "@/lib/mongodb/collections"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isAdmin = await isUserAdmin(session.userId)
    if (!isAdmin) {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const [farmers, crops, diseaseReports, soilAnalyses, marketPrices, schemes] = await Promise.all([
      (await getCollection(COLLECTIONS.FARMERS)).countDocuments(),
      (await getCollection(COLLECTIONS.ENCYCLOPEDIA)).countDocuments(),
      (await getCollection(COLLECTIONS.DISEASE_REPORTS)).countDocuments(),
      (await getCollection(COLLECTIONS.SOIL_ANALYSIS)).countDocuments(),
      (await getCollection(COLLECTIONS.MARKET_PRICES)).countDocuments(),
      (await getCollection(COLLECTIONS.SCHEMES)).countDocuments(),
    ])

    return NextResponse.json({
      success: true,
      stats: {
        totalFarmers: farmers,
        totalCrops: crops,
        diseaseReports,
        soilAnalyses,
        marketPrices,
        schemes,
      },
    })
  } catch (error) {
    console.error("[v0] Admin stats error:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
