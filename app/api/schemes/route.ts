import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"

const fallbackSchemes = [
  {
    id: "1",
    scheme_name: "PM-KISAN",
    description: "Direct income support of Rs. 6000 per year to farmer families in three equal installments",
    eligibility: "All landholding farmer families with cultivable land",
    benefits: "Rs. 6000 per year in 3 installments of Rs. 2000 each",
    application_process: "Register on pmkisan.gov.in with Aadhaar and land details",
    contact_info: "Helpline: 155261, 011-24300606",
    state: "All India",
    category: "Income Support",
    is_active: true,
    beneficiaries_count: 110000000,
    budget_allocation: "Rs. 75,000 Crore",
    website_url: "https://pmkisan.gov.in",
  },
  {
    id: "2",
    scheme_name: "PM Fasal Bima Yojana",
    description: "Crop insurance scheme to protect farmers against crop loss due to natural calamities",
    eligibility: "All farmers growing notified crops in notified areas",
    benefits: "Insurance coverage for crop damage due to natural calamities, pests, and diseases",
    application_process: "Apply through bank, CSC center, or insurance company portal",
    contact_info: "Helpline: 1800-180-1551",
    state: "All India",
    category: "Insurance",
    is_active: true,
    beneficiaries_count: 55000000,
    budget_allocation: "Rs. 15,500 Crore",
    website_url: "https://pmfby.gov.in",
  },
  {
    id: "3",
    scheme_name: "Kisan Credit Card",
    description: "Credit facility for farmers at subsidized interest rates for agricultural needs",
    eligibility: "All farmers, sharecroppers, tenant farmers, and self-help groups",
    benefits: "Up to Rs. 3 lakh at 4% interest rate with prompt repayment incentive",
    application_process: "Apply at any bank branch with land documents and identity proof",
    contact_info: "Contact nearest bank branch",
    state: "All India",
    category: "Credit",
    is_active: true,
    beneficiaries_count: 70000000,
    budget_allocation: "Rs. 2,00,000 Crore (Credit limit)",
    website_url: "https://www.nabard.org",
  },
  {
    id: "4",
    scheme_name: "Soil Health Card Scheme",
    description: "Free soil testing and fertilizer recommendations for farmers",
    eligibility: "All farmers with agricultural land",
    benefits: "Free soil health card with nutrient status and fertilizer recommendations",
    application_process: "Contact local agriculture office or register online",
    contact_info: "Contact District Agriculture Officer",
    state: "All India",
    category: "Soil Health",
    is_active: true,
    beneficiaries_count: 230000000,
    budget_allocation: "Rs. 568 Crore",
    website_url: "https://soilhealth.dac.gov.in",
  },
  {
    id: "5",
    scheme_name: "PM Krishi Sinchai Yojana",
    description: "Scheme to expand irrigation coverage and improve water use efficiency",
    eligibility: "All farmers with agricultural land",
    benefits: "Subsidy up to 55% on micro-irrigation systems like drip and sprinkler",
    application_process: "Apply through state agriculture department or online portal",
    contact_info: "Contact State Agriculture Department",
    state: "All India",
    category: "Irrigation",
    is_active: true,
    beneficiaries_count: 22000000,
    budget_allocation: "Rs. 50,000 Crore",
    website_url: "https://pmksy.gov.in",
  },
  {
    id: "6",
    scheme_name: "PM Kisan Maan Dhan Yojana",
    description: "Pension scheme for small and marginal farmers aged 18-40 years",
    eligibility: "Small and marginal farmers aged 18-40 with less than 2 hectares land",
    benefits: "Rs. 3000 monthly pension after age 60",
    application_process: "Register at CSC center with Aadhaar and bank details",
    contact_info: "Helpline: 1800-267-6888",
    state: "All India",
    category: "Pension",
    is_active: true,
    beneficiaries_count: 2300000,
    budget_allocation: "Rs. 900 Crore",
    website_url: "https://pmkmy.gov.in",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const state = searchParams.get("state")
    const category = searchParams.get("category")

    let schemes = fallbackSchemes

    try {
      const db = await getDb()
      const filter: any = {}

      // Only add is_active filter if checking database
      const schemesData = await db.collection("schemes").find(filter).sort({ scheme_name: 1 }).toArray()

      if (schemesData && schemesData.length > 0) {
        schemes = schemesData.map((s: any, index: number) => ({
          id: s._id?.toString() || String(index),
          ...s,
        }))
      }
    } catch (dbError) {
      console.log("[v0] Database not available, using fallback data")
    }

    // Apply filters
    let filteredSchemes = schemes
    if (state && state !== "all" && state !== "All India") {
      filteredSchemes = filteredSchemes.filter((s: any) => s.state === state || s.state === "All India")
    }
    if (category && category !== "all") {
      filteredSchemes = filteredSchemes.filter((s: any) => s.category === category)
    }

    return NextResponse.json({
      success: true,
      schemes: filteredSchemes,
      total: filteredSchemes.length,
      filters: { state, category },
    })
  } catch (error) {
    console.error("[v0] Schemes API Error:", error)
    return NextResponse.json({
      success: true,
      schemes: fallbackSchemes,
      total: fallbackSchemes.length,
    })
  }
}
