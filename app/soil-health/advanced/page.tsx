import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { getDb } from "@/lib/mongodb/client"
import SoilHealthHistory from "@/components/soil/SoilHealthHistory"
import SoilImprovementPlan from "@/components/soil/SoilImprovementPlan"
import NutrientDeficiencyAlert from "@/components/soil/NutrientDeficiencyAlert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, TrendingUp, AlertTriangle, Leaf } from "lucide-react"
import Navbar from "@/components/Navbar"
import type { MongoSoilAnalysis } from "@/types/mongo"

/* -------------------------------- TYPES -------------------------------- */

interface FarmerProfile {
  id: string
  full_name: string
  location: string
}

interface SoilAnalysis {
  id: string
  nitrogen_level: number
  phosphorus_level: number
  potassium_level: number
  ph_level: number
  organic_matter?: number
  analysis_date: string
  created_at: string
}

/* -------------------------------- PAGE -------------------------------- */

export default async function AdvancedSoilHealthPage() {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  const userId = session.userId
  const db = await getDb()

  /* ------------------------- FETCH FARMER PROFILE ------------------------- */

  const rawProfile = await db.collection("farmers").findOne({ user_id: userId })

  if (!rawProfile) {
    redirect("/profile-setup")
  }

  const profile: FarmerProfile = {
    id: rawProfile._id.toString(),
    full_name: rawProfile.full_name ?? "Farmer",
    location:
      [rawProfile.village, rawProfile.district, rawProfile.state].filter(Boolean).join(", ") || "Unknown location",
  }

  /* -------------------------- FETCH SOIL ANALYSES -------------------------- */

  const rawSoilAnalyses = await db
    .collection("soil_analysis")
    .find<MongoSoilAnalysis>({ user_id: userId })
    .sort({ test_date: -1 })
    .limit(10)
    .toArray()

  const soilAnalyses: SoilAnalysis[] = rawSoilAnalyses.map((doc) => ({
    id: doc._id.toString(),
    nitrogen_level: doc.nitrogen || 0,
    phosphorus_level: doc.phosphorus || 0,
    potassium_level: doc.potassium || 0,
    ph_level: doc.ph_level || 7.0,
    organic_matter: doc.organic_matter,
    analysis_date: doc.test_date.toISOString(),
    created_at: doc.created_at?.toISOString() || doc.test_date.toISOString(),
  }))

  const latestAnalysis = soilAnalyses[0]
  const healthScore = latestAnalysis ? calculateSoilHealthScore(latestAnalysis) : 0
  const healthStatus = getHealthStatus(healthScore)

  /* ---------------------------------- UI ---------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Soil Health Monitoring</h1>
          <p className="text-gray-600">
            Comprehensive soil analysis, historical tracking, and improvement recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle>Soil Health Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{healthScore}/100</div>
              <p className="text-xs text-muted-foreground">{healthStatus}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle>Total Analyses</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{soilAnalyses.length}</div>
              <p className="text-xs text-muted-foreground">Historical records</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle>pH Level</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestAnalysis?.ph_level?.toFixed(1) || "-"}</div>
              <p className="text-xs text-muted-foreground">Current soil pH</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle>Deficiencies</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {latestAnalysis ? countDeficiencies(latestAnalysis) : "-"}
              </div>
              <p className="text-xs text-muted-foreground">Nutrient deficiencies</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="history">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="history">Health History</TabsTrigger>
            <TabsTrigger value="improvement">Improvement Plan</TabsTrigger>
            <TabsTrigger value="alerts">Nutrient Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-6">
            <SoilHealthHistory farmerId={userId} analyses={soilAnalyses} latestAnalysis={latestAnalysis} />
          </TabsContent>

          <TabsContent value="improvement" className="mt-6">
            <SoilImprovementPlan farmerId={userId} latestAnalysis={latestAnalysis} profile={profile} />
          </TabsContent>

          <TabsContent value="alerts" className="mt-6">
            <NutrientDeficiencyAlert farmerId={userId} latestAnalysis={latestAnalysis} analyses={soilAnalyses} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

/* ----------------------------- HELPERS ----------------------------- */

function calculateSoilHealthScore(analysis: SoilAnalysis): number {
  let score = 100

  if (analysis.nitrogen_level < 150) score -= 15
  else if (analysis.nitrogen_level > 400) score -= 10

  if (analysis.phosphorus_level < 15) score -= 20
  else if (analysis.phosphorus_level > 50) score -= 5

  if (analysis.potassium_level < 120) score -= 15
  else if (analysis.potassium_level > 300) score -= 5

  if (analysis.ph_level < 5.5) score -= 25
  else if (analysis.ph_level > 8.5) score -= 20
  else if (analysis.ph_level < 6 || analysis.ph_level > 8) score -= 10

  if (analysis.organic_matter && analysis.organic_matter < 1) score -= 20
  else if (analysis.organic_matter && analysis.organic_matter < 2) score -= 10

  return Math.max(0, Math.round(score))
}

function getHealthStatus(score: number): string {
  if (score >= 85) return "Excellent"
  if (score >= 70) return "Good"
  if (score >= 50) return "Fair"
  return "Poor"
}

function countDeficiencies(analysis: SoilAnalysis): number {
  let count = 0

  if (analysis.nitrogen_level < 150) count++
  if (analysis.phosphorus_level < 15) count++
  if (analysis.potassium_level < 120) count++
  if (analysis.ph_level < 5.5 || analysis.ph_level > 8.5) count++
  if (analysis.organic_matter && analysis.organic_matter < 2) count++

  return count
}
