import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"
import type { Filter } from "mongodb"
import type { Document } from "mongodb"

const fallbackPrices = [
  {
    crop: "Rice",
    cropHi: "चावल",
    price: 3200,
    unit: "per quintal",
    trend: "up",
    change: 2.5,
    market: "Delhi Mandi",
    state: "Delhi",
    lastUpdated: new Date().toISOString(),
  },
  {
    crop: "Wheat",
    cropHi: "गेहूं",
    price: 2150,
    unit: "per quintal",
    trend: "up",
    change: 1.8,
    market: "Punjab Mandi",
    state: "Punjab",
    lastUpdated: new Date().toISOString(),
  },
  {
    crop: "Maize",
    cropHi: "मक्का",
    price: 1800,
    unit: "per quintal",
    trend: "down",
    change: -1.2,
    market: "UP Mandi",
    state: "Uttar Pradesh",
    lastUpdated: new Date().toISOString(),
  },
  {
    crop: "Cotton",
    cropHi: "कपास",
    price: 5600,
    unit: "per quintal",
    trend: "up",
    change: 3.2,
    market: "Gujarat Mandi",
    state: "Gujarat",
    lastUpdated: new Date().toISOString(),
  },
  {
    crop: "Sugarcane",
    cropHi: "गन्ना",
    price: 350,
    unit: "per quintal",
    trend: "up",
    change: 0.8,
    market: "Maharashtra Mandi",
    state: "Maharashtra",
    lastUpdated: new Date().toISOString(),
  },
  {
    crop: "Tomato",
    cropHi: "टमाटर",
    price: 4500,
    unit: "per quintal",
    trend: "down",
    change: -5.2,
    market: "Karnataka Mandi",
    state: "Karnataka",
    lastUpdated: new Date().toISOString(),
  },
  {
    crop: "Potato",
    cropHi: "आलू",
    price: 1200,
    unit: "per quintal",
    trend: "up",
    change: 1.5,
    market: "UP Mandi",
    state: "Uttar Pradesh",
    lastUpdated: new Date().toISOString(),
  },
  {
    crop: "Onion",
    cropHi: "प्याज",
    price: 2800,
    unit: "per quintal",
    trend: "down",
    change: -2.8,
    market: "Nashik Mandi",
    state: "Maharashtra",
    lastUpdated: new Date().toISOString(),
  },
  {
    crop: "Soybean",
    cropHi: "सोयाबीन",
    price: 4200,
    unit: "per quintal",
    trend: "up",
    change: 2.1,
    market: "MP Mandi",
    state: "Madhya Pradesh",
    lastUpdated: new Date().toISOString(),
  },
  {
    crop: "Groundnut",
    cropHi: "मूंगफली",
    price: 5100,
    unit: "per quintal",
    trend: "up",
    change: 1.9,
    market: "Gujarat Mandi",
    state: "Gujarat",
    lastUpdated: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const crop = searchParams.get("crop")
    const state = searchParams.get("state")

    let prices = fallbackPrices

    try {
      const db = await getDb()
      const collection = db.collection("market_prices")
      const filter: Filter<Document> = {}

      if (crop) {
        filter.crop = new RegExp(crop, "i")
      }
      if (state) {
        filter.state = new RegExp(state, "i")
      }

      const pricesData = await collection.find(filter).sort({ lastUpdated: -1 }).limit(50).toArray()

      if (pricesData && pricesData.length > 0) {
        prices = pricesData.map((p) => ({
          crop: p.crop || p.commodity,
          cropHi: p.cropHi || p.crop,
          price: p.price || p.modal_price || 0,
          unit: p.unit || "per quintal",
          trend: p.trend || "stable",
          change: p.change || p.change_percent || 0,
          market: p.market || p.market_name || "Local Mandi",
          state: p.state || "India",
          lastUpdated: p.lastUpdated || new Date().toISOString(),
        }))
      }
    } catch (dbError) {
      console.log("[v0] Database not available, using fallback prices")
    }

    let filteredPrices = prices
    if (crop) {
      filteredPrices = filteredPrices.filter((p) => p.crop.toLowerCase().includes(crop.toLowerCase()))
    }
    if (state) {
      filteredPrices = filteredPrices.filter((p) => p.state.toLowerCase().includes(state.toLowerCase()))
    }

    return NextResponse.json({
      success: true,
      prices: filteredPrices,
      total: filteredPrices.length,
      last_updated: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Market Prices API Error:", error)
    return NextResponse.json({
      success: true,
      prices: fallbackPrices,
      total: fallbackPrices.length,
    })
  }
}
