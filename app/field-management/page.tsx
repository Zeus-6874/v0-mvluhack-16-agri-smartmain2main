import { redirect } from "next/navigation"
import FieldManager from "@/components/field/FieldManager"
import CropCalendar from "@/components/field/CropCalendar"
import ResourceTracker from "@/components/field/ResourceTracker"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Package, BarChart3 } from "lucide-react"
import { getSession } from "@/lib/auth/session"
import { getDb } from "@/lib/mongodb/client"
import Navbar from "@/components/Navbar"

export default async function FieldManagementPage() {
  const session = await getSession()
  if (!session) {
    redirect("/")
  }

  const userId = session.userId
  const db = await getDb()
  const profile = await db.collection("farmers").findOne({ user_id: userId })

  // Fetch field statistics
  const fields = await db.collection("fields").find({ user_id: userId }).toArray()

  const totalArea = fields.reduce((sum: number, field: { area?: number }) => sum + (field.area || 0), 0)

  // Fetch active crop cycles
  const activeCrops = await db
    .collection("crop_cycles")
    .find({
      user_id: userId,
      status: { $in: ["planted", "growing"] },
    })
    .toArray()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-8 pb-6 border-b-2 border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Field Management</h1>
          <p className="text-base sm:text-lg text-gray-600">
            Manage your farm fields, crop cycles, and agricultural resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fields</CardTitle>
              <MapPin className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fields.length}</div>
              <p className="text-xs text-muted-foreground">Registered fields</p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Area</CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalArea.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Hectares under cultivation</p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
              <Calendar className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCrops.length}</div>
              <p className="text-xs text-muted-foreground">Currently growing</p>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
              <Package className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Types of resources tracked</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="fields" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm p-1 rounded-lg">
            <TabsTrigger
              value="fields"
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Fields</span>
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Resources</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fields" className="mt-6">
            <FieldManager farmerId={userId} />
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <CropCalendar farmerId={userId} />
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <ResourceTracker farmerId={userId} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
