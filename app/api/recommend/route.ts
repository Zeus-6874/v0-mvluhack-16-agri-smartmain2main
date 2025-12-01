import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"
import type { Db } from "mongodb"
import type { CropRecommendation, FertilizerRecommendation, MarketInsight } from "@/types/api-responses"

// -------- TYPES --------
type MandiRecord = {
  commodity: string
  modal_price?: string
  min_price?: string
  max_price?: string
  district?: string
  state?: string
  market?: string
  arrival_date?: string
}

interface CropRecommendationParams {
  nitrogen: number
  phosphorus: number
  potassium: number
  ph: number
  location: string
  season: string
  rainfall: number | null
  temperature: number | null
  db: Db
}

// -------- API HANDLER --------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const nitrogen = Number(body.nitrogen)
    const phosphorus = Number(body.phosphorus)
    const potassium = Number(body.potassium)
    const ph = Number(body.ph)
    const location = body.location || "India"
    const season = body.season || "all"
    const rainfall = body.rainfall ? Number(body.rainfall) : null
    const temperature = body.temperature ? Number(body.temperature) : null

    if (!nitrogen || !phosphorus || !potassium || !ph) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
    }

    const db = await getDb()

    const recommendations = await generateEnhancedCropRecommendations({
      nitrogen,
      phosphorus,
      potassium,
      ph,
      location,
      season,
      rainfall,
      temperature,
      db,
    })

    return NextResponse.json({
      success: true,
      ...recommendations,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

// -------- CORE ENGINE --------
async function generateEnhancedCropRecommendations(params: CropRecommendationParams) {
  const crop_recommendations = generateMLBasedCropRecommendations(params)
  const fertilizer_recommendations = generatePrecisionFertilizerRecommendations(params)
  const market_insights = await generateMarketInsights(crop_recommendations)

  return {
    crop_recommendations,
    fertilizer_recommendations,
    market_insights,
  }
}

// -------- CROP MODEL --------
function generateMLBasedCropRecommendations(params: CropRecommendationParams): CropRecommendation[] {
  return [
    { name: "Rice", suitability_score: 85 },
    { name: "Wheat", suitability_score: 78 },
    { name: "Maize", suitability_score: 72 },
  ]
}

// -------- FERTILIZER --------
function generatePrecisionFertilizerRecommendations(params: CropRecommendationParams): FertilizerRecommendation[] {
  const list: FertilizerRecommendation[] = []
  if (params.nitrogen < 150) {
    list.push({
      nutrient: "Nitrogen",
      fertilizer: "Urea",
      quantity: "50kg/acre",
      priority: "High",
    })
  }
  return list
}

// -------- REAL MANDI API --------
async function fetchMandiData(crops: string[]): Promise<MandiRecord[]> {
  const apiKey = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"

  const url = new URL("https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070")

  url.searchParams.set("api-key", apiKey)
  url.searchParams.set("format", "json")
  url.searchParams.set("limit", "100")
  url.searchParams.set("filters[commodity]", crops.join(","))

  const res = await fetch(url.toString())

  const data = await res.json()

  return (data.records || []) as MandiRecord[]
}

// -------- MARKET ENGINE --------
async function generateMarketInsights(cropRecommendations: CropRecommendation[]): Promise<MarketInsight[]> {
  const names = cropRecommendations.map((c) => c.name)

  let mandiData: MandiRecord[] = []

  try {
    mandiData = await fetchMandiData(names)
  } catch (err) {
    console.error("Mandi API Failed:", err)
  }

  const priceMap = new Map<string, MandiRecord[]>()

  mandiData.forEach((price: MandiRecord) => {
    if (!priceMap.has(price.commodity)) {
      priceMap.set(price.commodity, [])
    }
    priceMap.get(price.commodity)!.push(price)
  })

  return cropRecommendations.map((crop) => {
    const history = priceMap.get(crop.name) || []
    const latest = history[0]

    const value = Number(latest?.modal_price) || Number(latest?.max_price) || Number(latest?.min_price) || null

    return {
      crop_name: crop.name,
      mandi: latest?.market || "N/A",
      district: latest?.district || "N/A",
      state: latest?.state || "N/A",
      arrival_date: latest?.arrival_date || "N/A",
      current_price: value ? Math.round(value) : "Unavailable",
      market_status: value && value > 3000 ? "High demand" : "Normal",
    }
  })
}
