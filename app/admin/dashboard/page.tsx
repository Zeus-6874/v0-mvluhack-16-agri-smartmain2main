import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import AdminDashboard from "@/components/admin/AdminDashboard"

export default async function AdminDashboardPage() {
  const { userId } = await auth()

  // Redirect to sign-in if not authenticated
  if (!userId) {
    redirect("/sign-in")
  }

  // Check if user has admin privileges using ADMIN_USER_IDS from env
  const adminUserIds = process.env.ADMIN_USER_IDS?.split(",").map((id) => id.trim()) || []

  if (!adminUserIds.includes(userId)) {
    redirect("/dashboard")
  }

  // Return a mock user object for compatibility with AdminDashboard component
  // In production, fetch from Clerk API if needed
  return <AdminDashboard user={{ userId, email: "admin@agrismart.local" } as any} />
}
