import { NextResponse, type NextRequest } from "next/server"
import { getCurrentUserId } from "@/lib/auth/utils"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

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
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = await request.json()
    console.log("[v0] Creating profile for user:", userId)
    console.log("[v0] Payload:", payload)

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const { data: existingProfile } = await supabase.from("farmers").select("id").eq("user_id", userId).maybeSingle()

    let data, error

    if (existingProfile) {
      const updateResult = await supabase
        .from("farmers")
        .update({
          name: payload.full_name,
          phone: payload.phone,
          location: `${payload.district}, ${payload.state}`,
          farm_size: payload.land_area ? Number(payload.land_area) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .single()

      data = updateResult.data
      error = updateResult.error
    } else {
      const insertResult = await supabase
        .from("farmers")
        .insert({
          user_id: userId,
          name: payload.full_name,
          phone: payload.phone,
          location: `${payload.district}, ${payload.state}`,
          farm_size: payload.land_area ? Number(payload.land_area) : null,
        })
        .select()
        .single()

      data = insertResult.data
      error = insertResult.error
    }

    if (error) {
      console.error("[v0] Profile save error:", error)
      return NextResponse.json({ error: "Failed to save profile" }, { status: 500 })
    }

    console.log("[v0] Profile saved successfully")
    return NextResponse.json({ success: true, profile: data })
  } catch (error) {
    console.error("[v0] Profile POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
