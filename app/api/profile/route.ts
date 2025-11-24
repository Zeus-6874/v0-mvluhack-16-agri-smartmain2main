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
    console.log("[v0] Creating profile for user:", userId)
    console.log("[v0] Payload:", payload)

    const supabase = await createClient()

    const { data: existingProfile } = await supabase.from("farmers").select("id").eq("user_id", userId).maybeSingle()

    let data, error

    if (existingProfile) {
      // Update existing profile
      console.log("[v0] Updating existing profile:", existingProfile.id)
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
      // Insert new profile
      console.log("[v0] Inserting new profile")
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
      console.error("[v0] Error details:", error.message)
      return NextResponse.json({ error: "Failed to save profile", details: error.message }, { status: 500 })
    }

    console.log("[v0] Profile saved successfully:", data)
    return NextResponse.json({ success: true, profile: data })
  } catch (error) {
    console.error("[v0] Profile POST error:", error)
    return NextResponse.json({ error: "Internal server error", details: String(error) }, { status: 500 })
  }
}
