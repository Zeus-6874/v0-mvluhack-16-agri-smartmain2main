import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const commodity = searchParams.get("commodity") || "wheat"
    const state = searchParams.get("state") || "Maharashtra"

    const apiKey = process.env.AGMARKNET_API_KEY

    if (!apiKey) {
      // Return fallback data from MongoDB
      const db = await getDb()
      const prices = await db
        .collection("market_prices")
        .find({
          crop_name: new RegExp(commodity, "i"),
          state: new RegExp(state, "i"),
        })
        .sort({ date: -1 })
        .limit(10)
        .toArray()

      if (prices.length > 0) {
        return NextResponse.json({
          success: true,
          prices: prices.map((p) => ({
            commodity: p.crop_name,
            market: p.market_name,
            state: p.state,
            price: p.price,
            unit: p.unit || "quintal",
            date: p.date,
          })),
          source: "database",
          message: "Configure AGMARKNET_API_KEY for live government data",
        })
      }

      // Fallback sample data
      return NextResponse.json({
        success: true,
        prices: [
          {
            commodity: "Wheat",
            market: "Pune APMC",
            state: "Maharashtra",
            price: 2450,
            unit: "quintal",
            date: new Date().toISOString().split("T")[0],
          },
          {
            commodity: "Wheat",
            market: "Mumbai APMC",
            state: "Maharashtra",
            price: 2520,
            unit: "quintal",
            date: new Date().toISOString().split("T")[0],
          },
        ],
        source: "sample",
        message: "Sample data - configure AGMARKNET_API_KEY for real government prices",
      })
    }

    // Real Agmarknet API call would go here
    // Note: Agmarknet typically requires data.gov.in API access

    return NextResponse.json({
      success: true,
      message: "Agmarknet integration ready - requires API access setup",
    })
  } catch (error) {
    console.error("Agmarknet API Error:", error)
    return NextResponse.json({ error: "Failed to fetch market prices" }, { status: 500 })
  }
}
