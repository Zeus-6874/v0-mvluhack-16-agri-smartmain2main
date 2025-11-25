import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const polygonId = searchParams.get("polygonId")
    const lat = searchParams.get("lat")
    const lon = searchParams.get("lon")

    const apiKey = process.env.AGROMONITORING_API_KEY

    if (!apiKey) {
      // Return sample data if API key not configured
      return NextResponse.json({
        success: true,
        ndvi: 0.75,
        soilMoisture: 0.42,
        temperature: 28.5,
        message: "Sample data - configure AGROMONITORING_API_KEY for real data",
        interpretation: {
          en: "Crop health is good. Vegetation index indicates healthy growth.",
          hi: "फसल स्वास्थ्य अच्छा है। वनस्पति सूचकांक स्वस्थ विकास इंगित करता है।",
          mr: "पीक आरोग्य चांगले आहे. वनस्पती निर्देशांक निरोगी वाढ दर्शवितो.",
        },
      })
    }

    if (!lat || !lon) {
      return NextResponse.json({ error: "Latitude and longitude required" }, { status: 400 })
    }

    // Agromonitoring API call (requires polygon creation first)
    const response = await fetch(
      `https://api.agromonitoring.com/agro/1.0/ndvi/history?lat=${lat}&lon=${lon}&start=${Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60}&end=${Math.floor(Date.now() / 1000)}&appid=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error("Agromonitoring API request failed")
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      data,
      ndvi: data[0]?.data?.mean || 0.75,
      interpretation: {
        en: "Satellite-based crop health analysis",
        hi: "उपग्रह-आधारित फसल स्वास्थ्य विश्लेषण",
        mr: "उपग्रह-आधारित पीक आरोग्य विश्लेषण",
      },
    })
  } catch (error) {
    console.error("NDVI API Error:", error)
    return NextResponse.json({ error: "Failed to fetch satellite data" }, { status: 500 })
  }
}
