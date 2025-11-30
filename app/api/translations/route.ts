import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const languages = searchParams.get("languages") || "en,hi,mr"

  const apiUrl = process.env.TOLGEE_API_URL
  const apiKey = process.env.TOLGEE_API_KEY

  if (!apiUrl || !apiKey) {
    return NextResponse.json({ error: "Tolgee configuration missing" }, { status: 500 })
  }

  try {
    // Fetch translations from Tolgee API
    const response = await fetch(`${apiUrl}/v2/projects/translations?languages=${languages}`, {
      headers: {
        "X-API-Key": apiKey,
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error("Failed to fetch translations")
    }

    const data = await response.json()

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("Translation fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch translations" }, { status: 500 })
  }
}
