import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"
import { getSession } from "@/lib/auth/session"
import { getDb } from "@/lib/mongodb/client"
import Navbar from "@/components/Navbar"

// ✅ Define Profile type here (must match DashboardClient)
interface Profile {
  full_name: string
  phone: string
  state: string
  district: string
  village: string
  farm_size: number
  main_crops: string
  soil_type: string
  irrigation_type: string
}

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const db = await getDb()

  // ✅ Fetch raw profile from MongoDB
  const rawProfile = await db.collection("farmers").findOne({
    user_id: session.userId,
  })

  if (!rawProfile) {
    redirect("/profile-setup")
  }

  // ✅ Convert MongoDB Document → Typed Profile
  const profile: Profile = {
    full_name: rawProfile.full_name || "",
    phone: rawProfile.phone || "",
    state: rawProfile.state || "",
    district: rawProfile.district || "",
    village: rawProfile.village || "",
    farm_size: Number(rawProfile.farm_size || 0),
    main_crops: rawProfile.main_crops || "",
    soil_type: rawProfile.soil_type || "",
    irrigation_type: rawProfile.irrigation_type || "",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        {/* ✅ Now types match perfectly */}
        <DashboardClient profile={profile} />
      </main>
    </div>
  )
}
