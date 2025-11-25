import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const crop = searchParams.get("crop")
    const state = searchParams.get("state")

    const db = await getDb()
    const marketPricesCollection = db.collection("market_prices")

    // Build MongoDB query
    const query: any = {}

    if (crop) {
      query.crop_name = { $regex: crop, $options: "i" }
    }

    if (state) {
      query.state = { $regex: state, $options: "i" }
    }

    const pricesData = await marketPricesCollection.find(query).sort({ date: -1 }).limit(50).toArray()

    // Group prices by crop for better organization
    const groupedPrices = pricesData?.reduce((acc: any, price: any) => {
      const cropName = price.crop_name
      if (!acc[cropName]) {
        acc[cropName] = []
      }
      acc[cropName].push(price)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      prices: pricesData || [],
      grouped_prices: groupedPrices || {},
      filters: { crop, state },
    })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
