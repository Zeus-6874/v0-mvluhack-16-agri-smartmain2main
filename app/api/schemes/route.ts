import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb/client"
import type { Filter } from "mongodb"
import type { MongoScheme } from "@/types/mongo"

const LIBRE_TRANSLATE_URL = "https://libretranslate.com/translate"

// ---------------- TRANSLATE ----------------
async function translate(text: string, target: "hi" | "mr") {
  try {
    const res = await fetch(LIBRE_TRANSLATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: text, source: "en", target, format: "text" }),
    })
    const data = await res.json()
    return data.translatedText || text
  } catch {
    return text
  }
}

// ---------------- API ----------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const state = searchParams.get("state")
    const category = searchParams.get("category")
    const lang = (searchParams.get("lang") as "en" | "hi" | "mr") || "en"

    const db = await getDb()
    const filter: Filter<MongoScheme> = {}

    const schemes = await db.collection<MongoScheme>("schemes").find(filter).sort({ created_at: -1 }).toArray()

    const result = await Promise.all(
      schemes.map(async (s) => {
        let name = s.scheme_name
        let desc = s.description
        let eligibility = s.eligibility || "Not specified"
        let benefits = s.benefits || "Not available"
        let apply = s.how_to_apply || "Visit official website"

        // ---------- TRANSLATE ----------
        if (lang === "hi") {
          name = s.scheme_name_hi || (await translate(name, "hi"))
          desc = s.description_hi || (await translate(desc, "hi"))
          eligibility = s.eligibility_hi || (await translate(eligibility, "hi"))
          benefits = s.benefits_hi || (await translate(benefits, "hi"))
          apply = s.how_to_apply_hi || (await translate(apply, "hi"))
        }

        if (lang === "mr") {
          name = s.scheme_name_mr || (await translate(name, "mr"))
          desc = s.description_mr || (await translate(desc, "mr"))
          eligibility = s.eligibility_mr || (await translate(eligibility, "mr"))
          benefits = s.benefits_mr || (await translate(benefits, "mr"))
          apply = s.how_to_apply_mr || (await translate(apply, "mr"))
        }

        return {
          id: s._id.toString(),
          scheme_name: name,
          description: desc,
          eligibility,
          benefits,
          application_process: apply,
          contact_info: s.contact_info || "N/A",
          state: s.state || "All India",
          category: s.category || "General",
          is_active: true,
          beneficiaries_count: 0,
          budget_allocation: "N/A",
          website_url: s.website_url || "#",
        }
      }),
    )

    // ---------- FILTERING ----------
    let filtered = result

    if (state && state !== "all") {
      filtered = filtered.filter((s) => s.state === state || s.state === "All India")
    }

    if (category && category !== "all") {
      filtered = filtered.filter((s) => s.category === category)
    }

    return NextResponse.json({
      success: true,
      schemes: filtered,
      total: filtered.length,
      filters: { state, category, lang },
    })
  } catch (error) {
    console.error("Schemes API Error:", error)
    return NextResponse.json({ success: false, schemes: [] })
  }
}
