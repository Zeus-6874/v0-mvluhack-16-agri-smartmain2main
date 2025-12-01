import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getDb } from "@/lib/mongodb/client"
import { isUserAdmin } from "@/lib/mongodb/collections"
import DataManager from "@/components/admin/DataManager"

export default async function AdminDataPage() {
  const session = await getSession()
  if (!session) {
    redirect("/admin/login")
  }

  const isAdmin = await isUserAdmin(session.userId)
  if (!isAdmin) {
    redirect("/admin/login")
  }

  const db = await getDb()

  const schemeCategories = await db.collection("scheme_categories").find({}).sort({ name: 1 }).toArray()

  const cropCategories = await db.collection("crop_categories").find({}).sort({ name: 1 }).toArray()

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-semibold">Knowledge Base Admin</h1>
      <p className="text-sm text-muted-foreground">
        Manage schemes, crops, and all knowledge datasets pulled from Maharashtra horticulture board, ICAR, and CROPSAP.
      </p>
      <DataManager schemeCategories={schemeCategories ?? []} cropCategories={cropCategories ?? []} />
    </div>
  )
}
