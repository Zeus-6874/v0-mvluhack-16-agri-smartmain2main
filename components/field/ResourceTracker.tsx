"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Plus, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslate, useTolgee } from "@tolgee/react"

/* ✅ New Models */
interface Field {
  _id: string
  name: string
}

interface CropCycle {
  _id: string
  crop_name: string
}

/* Your existing models kept */
interface Resource {
  id: string
  name: string
  category: "seeds" | "fertilizers" | "pesticides" | "tools" | "other"
  current_quantity: number
  unit: string
  min_quantity: number
  max_quantity: number
  cost_per_unit: number
  supplier?: string
  last_restocked?: string
  notes?: string
}

interface ResourceUsage {
  id: string
  resource_id: string
  quantity_used: number
  field_id?: string
  crop_cycle_id?: string
  usage_date: string
  purpose: string
  cost: number
}

/* ✅ FIXED PROPS */
interface ResourceTrackerProps {
  farmerId: string
}

export default function ResourceTracker({ farmerId }: ResourceTrackerProps) {
  const { t } = useTranslate()
  const tolgee = useTolgee(["language"])
  const language = tolgee.getLanguage()
  const { toast } = useToast()

  const [fields, setFields] = useState<Field[]>([])
  const [cropCycles, setCropCycles] = useState<CropCycle[]>([])
  const [selectedField, setSelectedField] = useState("")
  const [selectedCropCycle, setSelectedCropCycle] = useState("")

  const [resources, setResources] = useState<Resource[]>([])
  const [usage, setUsage] = useState<ResourceUsage[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false)
  const [isUsageDialogOpen, setIsUsageDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = {
    seeds: { label: language === "hi" ? "बीज" : "Seeds", icon: "🌱", color: "green" },
    fertilizers: { label: language === "hi" ? "उर्वरक" : "Fertilizers", icon: "🧪", color: "blue" },
    pesticides: { label: language === "hi" ? "कीटनाशक" : "Pesticides", icon: "⚠️", color: "red" },
    tools: { label: language === "hi" ? "उपकरण" : "Tools", icon: "🔧", color: "gray" },
    other: { label: language === "hi" ? "अन्य" : "Other", icon: "📦", color: "purple" },
  }

  const units = ["kg", "liters", "bags", "bottles", "packs", "units", "tons"]

  const [resourceForm, setResourceForm] = useState({
    name: "",
    category: "seeds" as keyof typeof categories,
    current_quantity: "",
    unit: "kg",
    min_quantity: "",
    max_quantity: "",
    cost_per_unit: "",
    supplier: "",
    notes: "",
  })

  const [usageForm, setUsageForm] = useState({
    resource_id: "",
    quantity_used: "",
    purpose: "",
  })

  /* ✅ Load Fields */
  useEffect(() => {
    fetch(`/api/fields?farmerId=${farmerId}`)
      .then(res => res.json())
      .then(data => setFields(data))
  }, [farmerId])

  /* ✅ Load crop cycles when field changes */
  useEffect(() => {
    if (!selectedField) return
    fetch(`/api/crop-cycles?fieldId=${selectedField}`)
      .then(res => res.json())
      .then(data => setCropCycles(data))
  }, [selectedField])

  /* ✅ Load resources & usage when crop changes */
  useEffect(() => {
    if (!selectedCropCycle) return
    fetch(`/api/resources?cropCycleId=${selectedCropCycle}`)
      .then(res => res.json())
      .then(data => setResources(data))

    fetch(`/api/resource-usage?cropCycleId=${selectedCropCycle}`)
      .then(res => res.json())
      .then(data => {
        setUsage(data)
        setIsLoading(false)
      })
  }, [selectedCropCycle])

  /* ✅ STATUS */
  const getResourceStatus = (resource: Resource) => {
    const percentage = (resource.current_quantity / resource.max_quantity) * 100
    if (resource.current_quantity <= resource.min_quantity) return { color: "red", text: "Low" }
    if (percentage > 80) return { color: "green", text: "Good" }
    return { color: "blue", text: "Normal" }
  }

  /* ✅ FILTER */
  const filteredResources =
    selectedCategory === "all" ? resources : resources.filter(r => r.category === selectedCategory)

  /* ✅ TOTAL VALUE */
  const getTotalValue = () => {
    return resources.reduce((sum, r) => sum + r.current_quantity * r.cost_per_unit, 0)
  }

  /* ✅ ADD RESOURCE */
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...resourceForm, crop_cycle_id: selectedCropCycle }),
    })

    const data = await res.json()
    setResources(prev => [...prev, data])
    setIsAddResourceDialogOpen(false)
  }

  /* ✅ ADD USAGE */
  const handleUsageSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/resource-usage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...usageForm,
        crop_cycle_id: selectedCropCycle,
        field_id: selectedField,
      }),
    })

    const data = await res.json()
    setUsage(prev => [data, ...prev])
    setIsUsageDialogOpen(false)
  }

  if (isLoading)
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-b-2 border-green-600 rounded-full"></div>
      </div>
    )

  return (
    <div className="space-y-6">

      {/* ✅ SELECTORS */}
      <Card>
        <CardContent className="grid sm:grid-cols-2 gap-4 p-4">
          <Select onValueChange={setSelectedField}>
            <SelectTrigger>
              <SelectValue placeholder="Select Field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map(f => <SelectItem key={f._id} value={f._id}>{f.name}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select disabled={!selectedField} onValueChange={setSelectedCropCycle}>
            <SelectTrigger>
              <SelectValue placeholder="Select Crop" />
            </SelectTrigger>
            <SelectContent>
              {cropCycles.map(c => <SelectItem key={c._id} value={c._id}>{c.crop_name}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* ✅ SUMMARY */}
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent>Total: {resources.length}</CardContent></Card>
        <Card><CardContent>Value: ₹{getTotalValue()}</CardContent></Card>
        <Card><CardContent>Low: {resources.filter(r => r.current_quantity <= r.min_quantity).length}</CardContent></Card>
        <Card><CardContent>Usage: {usage.length}</CardContent></Card>
      </div>

    </div>
  )
}
