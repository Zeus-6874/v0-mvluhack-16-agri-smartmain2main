import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { isUserAdmin } from "@/lib/mongodb/collections"
import AdminDashboard from "@/components/admin/AdminDashboard"

export default async function AdminDashboardPage() {
  const session = await getSession()

  // Redirect to home if not authenticated
  if (!session) {
    redirect("/")
  }

  // Check if user has admin privileges
  const isAdmin = await isUserAdmin(session.userId)

  if (!isAdmin) {
    redirect("/dashboard")
  }

  // Return admin dashboard with user info
  return <AdminDashboard user={{ userId: session.userId, email: "admin@agrismart.com" } as any} />
}
