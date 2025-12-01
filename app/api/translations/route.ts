import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const languages = searchParams.get("languages") || "en,hi,mr"

    const apiKey = process.env.TOLGEE_API_KEY
    const apiUrl = process.env.TOLGEE_API_URL

    if (!apiKey || !apiUrl) {
      return NextResponse.json({ error: "Tolgee not configured" }, { status: 500 })
    }

    // Fetch translations from Tolgee API server-side
    const response = await fetch(`${apiUrl}/v2/projects/export?languages=${languages}&format=JSON`, {
      headers: {
        "X-API-Key": apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Tolgee API error: ${response.status}`)
    }

    const translations = await response.json()

    return NextResponse.json(translations, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching translations:", error)
    return NextResponse.json({ error: "Failed to fetch translations" }, { status: 500 })
  }
}
