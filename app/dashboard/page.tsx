import { redirect } from "next/navigation"
import DashboardClient from "./DashboardClient"
import { createClient } from "@/lib/supabase/server"
import { getSession } from "@/lib/auth/session"

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const supabase = await createClient()
  const { data: profile } = await supabase.from("farmers").select("*").eq("user_id", session.userId).maybeSingle()

  return <DashboardClient profile={profile} />
}
