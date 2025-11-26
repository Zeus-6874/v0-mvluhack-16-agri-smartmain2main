import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"
import { getSession } from "@/lib/auth/session"
import { getDb } from "@/lib/mongodb/client"
import Navbar from "@/components/Navbar"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const db = await getDb()
  const profile = await db.collection("farmers").findOne({ user_id: session.userId })

  if (!profile) {
    redirect("/profile-setup")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto">
        <DashboardClient profile={profile} />
      </main>
    </div>
  )
}
