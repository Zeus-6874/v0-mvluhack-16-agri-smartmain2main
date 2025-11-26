"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Edit, Trash2, Sprout } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n/context"

interface Field {
  id: string
  field_name: string
  area_hectares: number
  coordinates?: any
  soil_type?: string
  irrigation_type?: string
  created_at: string
  updated_at: string
  crop_cycles?: Array<{
    id: string
    crop_name: string
    variety?: string
    status: string
    planting_date?: string
  }>
}

interface FieldFormData {
  field_name: string
  area_hectares: string
  soil_type: string
  irrigation_type: string
}

interface FieldManagerProps {
  farmerId: string
  onFieldSelect?: (field: Field) => void
}

export default function FieldManager({ farmerId, onFieldSelect }: FieldManagerProps) {
  const { language, t } = useI18n()
  const { toast } = useToast()
  const [fields, setFields] = useState<Field[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingField, setEditingField] = useState<Field | null>(null)
  const [formData, setFormData] = useState<FieldFormData>({
    field_name: "",
    area_hectares: "",
    soil_type: "",
    irrigation_type: "",
  })

  const soilTypes = ["Clay", "Sandy", "Loamy", "Silt", "Peaty", "Chalky", "Black", "Red", "Alluvial"]

  const irrigationTypes = ["Drip", "Sprinkler", "Flood", "Center Pivot", "Manual", "Rain-fed"]

  const cropStatusColors = {
    planning: "bg-yellow-100 text-yellow-800",
    planted: "bg-green-100 text-green-800",
    growing: "bg-blue-100 text-blue-800",
    harvested: "bg-gray-100 text-gray-800",
  }

  useEffect(() => {
    fetchFields()
  }, [])

  const fetchFields = async () => {
    try {
      const response = await fetch("/api/fields")
      const data = await response.json()

      if (data.success) {
        setFields(data.fields)
      } else {
        toast({
          title: language === "hi" ? "त्रुटि" : "Error",
          description: data.error || "Failed to fetch fields",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching fields:", error)
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "फ़ील्ड लोड करने में त्रुटि" : "Failed to load fields",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.field_name || !formData.area_hectares) {
      toast({
        title: language === "hi" ? "वैलिडेशन त्रुटि" : "Validation Error",
        description: language === "hi" ? "फ़ील्ड का नाम और क्षेत्रफल आवश्यक है" : "Field name and area are required",
        variant: "destructive",
      })
      return
    }

    try {
      const url = editingField ? `/api/fields/${editingField.id}` : "/api/fields"
      const method = editingField ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: editingField
            ? language === "hi"
              ? "फ़ील्ड अपडेट किया गया"
              : "Field updated"
            : language === "hi"
              ? "फ़ील्ड बनाया गया"
              : "Field created",
          description: editingField
            ? language === "hi"
              ? "फ़ील्ड सफलतापूर्वक अपडेट किया गया"
              : "Field updated successfully"
            : language === "hi"
              ? "फ़ील्ड सफलतापूर्वक बनाया गया"
              : "Field created successfully",
        })

        setIsCreateDialogOpen(false)
        setEditingField(null)
        resetForm()
        fetchFields()
      } else {
        toast({
          title: language === "hi" ? "त्रुटि" : "Error",
          description: data.error || "Failed to save field",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving field:", error)
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "फ़ील्ड सहेजने में त्रुटि" : "Failed to save field",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (field: Field) => {
    setEditingField(field)
    setFormData({
      field_name: field.field_name,
      area_hectares: field.area_hectares.toString(),
      soil_type: field.soil_type || "",
      irrigation_type: field.irrigation_type || "",
    })
    setIsCreateDialogOpen(true)
  }

  const handleDelete = async (field: Field) => {
    const confirmMessage = `${t("common.deleteConfirmMessage")} "${field.field_name}"?\n${t("common.deleteConfirmQuestion")}`

    if (!confirm(confirmMessage)) {
      return
    }

    try {
      const response = await fetch(`/api/fields/${field.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: t("common.success"),
          description: t("fieldManagement.fieldDeleted"),
          variant: "default",
          className: "bg-green-50 border-green-200 text-green-900",
        })
        await fetchFields()
      } else {
        toast({
          title: t("common.error"),
          description: data.error || t("common.operationFailed"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting field:", error)
      toast({
        title: t("common.error"),
        description: t("common.operationFailed"),
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      field_name: "",
      area_hectares: "",
      soil_type: "",
      irrigation_type: "",
    })
    setEditingField(null)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsCreateDialogOpen(true)
  }

  const closeDialog = () => {
    setIsCreateDialogOpen(false)
    resetForm()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">{language === "hi" ? "फ़ील्ड प्रबंधन" : "Field Management"}</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-green-600 hover:bg-green-700">
              <Plus className="mr-2 h-4 w-4" />
              {language === "hi" ? "नया फ़ील्ड" : "Add Field"}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingField
                  ? language === "hi"
                    ? "फ़ील्ड संपादित करें"
                    : "Edit Field"
                  : language === "hi"
                    ? "नया फ़ील्ड बनाएं"
                    : "Create New Field"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="field_name">{language === "hi" ? "फ़ील्ड का नाम" : "Field Name"}</Label>
                <Input
                  id="field_name"
                  value={formData.field_name}
                  onChange={(e) => setFormData({ ...formData, field_name: e.target.value })}
                  placeholder={language === "hi" ? "फ़ील्ड का नाम दर्ज करें" : "Enter field name"}
                  required
                />
              </div>

              <div>
                <Label htmlFor="area_hectares">{language === "hi" ? "क्षेत्रफल (हेक्टेयर)" : "Area (hectares)"}</Label>
                <Input
                  id="area_hectares"
                  type="number"
                  step="0.01"
                  value={formData.area_hectares}
                  onChange={(e) => setFormData({ ...formData, area_hectares: e.target.value })}
                  placeholder={language === "hi" ? "क्षेत्रफल दर्ज करें" : "Enter area in hectares"}
                  required
                />
              </div>

              <div>
                <Label htmlFor="soil_type">{language === "hi" ? "मिट्टी का प्रकार" : "Soil Type"}</Label>
                <Select
                  value={formData.soil_type}
                  onValueChange={(value) => setFormData({ ...formData, soil_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "hi" ? "मिट्टी का प्रकार चुनें" : "Select soil type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="irrigation_type">{language === "hi" ? "सिंचाई का प्रकार" : "Irrigation Type"}</Label>
                <Select
                  value={formData.irrigation_type}
                  onValueChange={(value) => setFormData({ ...formData, irrigation_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={language === "hi" ? "सिंचाई का प्रकार चुनें" : "Select irrigation type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {irrigationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={closeDialog}>
                  {language === "hi" ? "रद्द करें" : "Cancel"}
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingField ? (language === "hi" ? "अपडेट करें" : "Update") : language === "hi" ? "बनाएं" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {fields.length === 0 ? (
        <Card className="shadow-sm border-2 border-dashed border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <MapPin className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{t("fieldManagement.noFieldsFound")}</h3>
            <p className="text-gray-600 text-center mb-6 max-w-sm">{t("fieldManagement.addFirstField")}</p>
            <Button onClick={openCreateDialog} size="lg" className="bg-green-600 hover:bg-green-700 shadow-md">
              <Plus className="mr-2 h-5 w-5" />
              {t("fieldManagement.addField")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields.map((field, index) => (
            <Card
              key={`field-${index}`}
              className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-200 hover:border-green-300 bg-white"
              onClick={() => onFieldSelect?.(field)}
            >
              <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-blue-50 border-b">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-gray-900">{field.field_name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {t("fieldManagement.field")} #{index + 1}
                    </p>
                  </div>
                  <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(field)}
                      className="hover:bg-white/80 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(field)}
                      className="hover:bg-white/80 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-center text-base text-gray-700 bg-gradient-to-r from-gray-50 to-green-50 p-3 rounded-lg border border-gray-200">
                  <MapPin className="h-5 w-5 mr-3 text-green-600" />
                  <span className="font-semibold">
                    {field.area_hectares} {t("dashboard.hectares")}
                  </span>
                </div>

                {field.soil_type && (
                  <div className="flex items-center text-sm text-gray-600 bg-amber-50 p-2 rounded border border-amber-100">
                    <Sprout className="h-4 w-4 mr-2 text-amber-600" />
                    {field.soil_type} soil
                  </div>
                )}

                {field.crop_cycles && field.crop_cycles.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="text-sm font-semibold text-gray-700">{t("dashboard.activeCrops")}:</div>
                    <div className="flex flex-wrap gap-2">
                      {field.crop_cycles.slice(0, 3).map((cycle, idx) => (
                        <Badge
                          key={`crop-${idx}`}
                          className={cropStatusColors[cycle.status as keyof typeof cropStatusColors]}
                        >
                          {cycle.crop_name}
                        </Badge>
                      ))}
                      {field.crop_cycles.length > 3 && (
                        <Badge variant="secondary" className="bg-gray-200">
                          +{field.crop_cycles.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
