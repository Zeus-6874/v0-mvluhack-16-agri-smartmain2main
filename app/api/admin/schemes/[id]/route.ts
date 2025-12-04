import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUserId } from "@/lib/auth/utils"
import { getDb } from "@/lib/mongodb/client"
import { ObjectId } from "mongodb"

function assertAdmin(userId?: string | null) {
  const adminIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []
  if (!userId) {
    throw new Error("UNAUTHORIZED")
  }
  if (adminIds.length > 0 && !adminIds.includes(userId)) {
    throw new Error("FORBIDDEN")
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  try {
    const userId = await getCurrentUserId()
    assertAdmin(userId)

    const payload = await request.json()
    const db = await getDb()

    const result = await db.collection("schemes").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          name: payload.name,
          name_local: payload.name_local,
          category_id: payload.category_id,
          state: payload.state,
          department: payload.department,
          description: payload.description,
          eligibility: payload.eligibility,
          benefits: payload.benefits,
          subsidy_details: payload.subsidy_details,
          application_process: payload.application_process,
          official_url: payload.official_url,
          contact_info: payload.contact_info,
          is_active: payload.is_active ?? true,
          updated_at: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    // result.value is the updated document
    if (!result.value) {
      return NextResponse.json({ error: "Failed to update scheme" }, { status: 500 })
    }

    return NextResponse.json({ success: true, scheme: result.value })
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }
    console.error("[v0] Admin scheme update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params

  try {
    const userId = await getCurrentUserId()
    assertAdmin(userId)

    const db = await getDb()
    const result = await db.collection("schemes").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Failed to delete scheme" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      if (error.message === "FORBIDDEN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    }
    console.error("[v0] Admin scheme delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
