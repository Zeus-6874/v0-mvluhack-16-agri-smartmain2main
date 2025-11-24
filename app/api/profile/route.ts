import { NextResponse, type NextRequest } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.from("farmers").select("*").eq("user_id", userId).maybeSingle()

    if (error) {
      console.error("[v0] Profile fetch error:", error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true, profile: data })
  } catch (error) {
    console.error("[v0] Profile GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("farmers")
      .upsert(
        {
          user_id: userId,
          name: payload.full_name,
          phone: payload.phone,
          location: `${payload.district}, ${payload.state}`,
          farm_size: payload.land_area ? Number(payload.land_area) : null,
        },
        { onConflict: "user_id" },
      )
      .select()
      .single()

    if (error) {
      console.error("[v0] Profile upsert error:", error)
      return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true, profile: data })
  } catch (error) {
    console.error("[v0] Profile POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
