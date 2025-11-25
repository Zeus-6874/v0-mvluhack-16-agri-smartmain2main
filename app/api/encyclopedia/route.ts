import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"

const fallbackCrops = [
  {
    id: "1",
    crop_name: "Rice",
    scientific_name: "Oryza sativa",
    description:
      "Rice is a staple food crop grown in flooded fields. It is the primary food source for more than half of the world's population.",
    planting_season: "June-July (Kharif)",
    harvest_time: "October-November",
    water_requirements: "High - requires 1200-1500mm water",
    soil_type: "Clay loam, well-drained",
    fertilizer_needs: "NPK 120:60:40 kg/ha",
    common_diseases: ["Blast", "Brown Spot", "Bacterial Leaf Blight"],
    prevention_tips: ["Use resistant varieties", "Proper water management", "Seed treatment"],
  },
  {
    id: "2",
    crop_name: "Wheat",
    scientific_name: "Triticum aestivum",
    description:
      "Wheat is a major cereal grain crop used for making flour, bread, and other food products. It is grown in temperate regions.",
    planting_season: "October-November (Rabi)",
    harvest_time: "March-April",
    water_requirements: "Medium - requires 450-650mm water",
    soil_type: "Loamy soil, well-drained",
    fertilizer_needs: "NPK 120:60:40 kg/ha",
    common_diseases: ["Rust", "Powdery Mildew", "Karnal Bunt"],
    prevention_tips: ["Timely sowing", "Use certified seeds", "Crop rotation"],
  },
  {
    id: "3",
    crop_name: "Maize",
    scientific_name: "Zea mays",
    description:
      "Maize or corn is a versatile crop used for food, feed, and industrial purposes. It is one of the most widely grown crops.",
    planting_season: "June-July (Kharif) or February-March (Rabi)",
    harvest_time: "90-120 days after sowing",
    water_requirements: "Medium - requires 500-800mm water",
    soil_type: "Sandy loam to clay loam",
    fertilizer_needs: "NPK 120:60:40 kg/ha",
    common_diseases: ["Maize Stalk Rot", "Leaf Blight", "Downy Mildew"],
    prevention_tips: ["Seed treatment", "Proper spacing", "Balanced fertilization"],
  },
  {
    id: "4",
    crop_name: "Cotton",
    scientific_name: "Gossypium hirsutum",
    description:
      "Cotton is a major fiber crop grown for textile industry. It is also called white gold due to its economic importance.",
    planting_season: "April-May",
    harvest_time: "October-December",
    water_requirements: "Medium - requires 700-1200mm water",
    soil_type: "Black cotton soil, deep alluvial",
    fertilizer_needs: "NPK 100:50:50 kg/ha",
    common_diseases: ["Bollworm", "Whitefly", "Root Rot"],
    prevention_tips: ["IPM practices", "Bt cotton varieties", "Proper irrigation"],
  },
  {
    id: "5",
    crop_name: "Sugarcane",
    scientific_name: "Saccharum officinarum",
    description:
      "Sugarcane is a tall perennial grass grown for sugar production and biofuel. India is the second largest producer.",
    planting_season: "October-November or February-March",
    harvest_time: "12-18 months after planting",
    water_requirements: "High - requires 1500-2500mm water",
    soil_type: "Deep, well-drained loamy soil",
    fertilizer_needs: "NPK 250:100:100 kg/ha",
    common_diseases: ["Red Rot", "Smut", "Grassy Shoot"],
    prevention_tips: ["Disease-free seed cane", "Proper drainage", "Ratoon management"],
  },
  {
    id: "6",
    crop_name: "Tomato",
    scientific_name: "Solanum lycopersicum",
    description:
      "Tomato is a popular vegetable crop rich in vitamins and antioxidants. It is grown throughout the year in various regions.",
    planting_season: "Year-round (protected cultivation)",
    harvest_time: "60-90 days after transplanting",
    water_requirements: "Medium - requires 400-600mm water",
    soil_type: "Sandy loam, pH 6.0-7.0",
    fertilizer_needs: "NPK 120:60:60 kg/ha",
    common_diseases: ["Early Blight", "Late Blight", "Leaf Curl"],
    prevention_tips: ["Stake plants", "Mulching", "Resistant varieties"],
  },
  {
    id: "7",
    crop_name: "Potato",
    scientific_name: "Solanum tuberosum",
    description:
      "Potato is a major vegetable and tuber crop grown worldwide for food. It is the fourth most important food crop.",
    planting_season: "October-November (Rabi)",
    harvest_time: "90-120 days after planting",
    water_requirements: "Medium - requires 500-700mm water",
    soil_type: "Sandy loam, loose and friable",
    fertilizer_needs: "NPK 180:80:100 kg/ha",
    common_diseases: ["Late Blight", "Early Blight", "Black Scurf"],
    prevention_tips: ["Certified seed tubers", "Proper hilling", "Crop rotation"],
  },
  {
    id: "8",
    crop_name: "Onion",
    scientific_name: "Allium cepa",
    description:
      "Onion is a bulb vegetable used worldwide for culinary purposes. It is an essential ingredient in most cuisines.",
    planting_season: "October-November (Rabi) or June-July (Kharif)",
    harvest_time: "120-150 days after transplanting",
    water_requirements: "Medium - requires 350-550mm water",
    soil_type: "Sandy loam to clay loam",
    fertilizer_needs: "NPK 100:50:50 kg/ha",
    common_diseases: ["Purple Blotch", "Downy Mildew", "Thrips"],
    prevention_tips: ["Proper curing", "Storage management", "Fungicide spray"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const crop = searchParams.get("crop")

    let crops = fallbackCrops

    try {
      const db = await getDb()
      let encyclopediaData = await db.collection("crops").find({}).sort({ crop_name: 1 }).toArray()

      if (!encyclopediaData || encyclopediaData.length === 0) {
        encyclopediaData = await db.collection("encyclopedia").find({}).sort({ crop_name: 1 }).toArray()
      }

      if (encyclopediaData && encyclopediaData.length > 0) {
        crops = encyclopediaData.map((c: any, index: number) => ({
          id: c._id?.toString() || String(index),
          ...c,
        }))
      }
    } catch (dbError) {
      console.log("[v0] Database not available, using fallback data")
    }

    // Apply filters
    let filteredCrops = crops
    if (search) {
      filteredCrops = filteredCrops.filter(
        (c: any) =>
          c.crop_name?.toLowerCase().includes(search.toLowerCase()) ||
          c.description?.toLowerCase().includes(search.toLowerCase()),
      )
    }
    if (crop) {
      filteredCrops = filteredCrops.filter((c: any) => c.crop_name === crop)
    }

    return NextResponse.json({
      success: true,
      crops: filteredCrops,
      total: filteredCrops.length,
      filters: { search, crop },
    })
  } catch (error) {
    console.error("[v0] Encyclopedia API Error:", error)
    return NextResponse.json({
      success: true,
      crops: fallbackCrops,
      total: fallbackCrops.length,
    })
  }
}
