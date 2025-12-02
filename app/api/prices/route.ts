import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"
import type { Filter, Document } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const crop = searchParams.get("crop")
    const state = searchParams.get("state")

    const db = await getDb()
    const marketPricesCollection = db.collection("market_prices")

    const query: Filter<Document> = {}

    if (crop) {
      query.crop_name = { $regex: crop, $options: "i" }
    }

    if (state) {
      query.state = { $regex: state, $options: "i" }
    }

    const pricesData = await marketPricesCollection.find(query).sort({ date: -1 }).limit(50).toArray()

    const groupedPrices = pricesData?.reduce((acc: Record<string, Document[]>, price: Document) => {
      const cropName = price.crop_name as string
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
