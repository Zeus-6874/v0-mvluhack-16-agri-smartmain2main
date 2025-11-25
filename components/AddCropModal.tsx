"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useI18n } from "@/lib/i18n/context"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface AddCropModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fields?: any[]
}

export default function AddCropModal({ open, onOpenChange, fields = [] }: AddCropModalProps) {
  const { language, t } = useI18n()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    field_id: "",
    crop_name: "",
    variety: "",
    planting_date: "",
    expected_harvest: "",
    area: "",
  })

  const cropOptions = [
    "wheat",
    "rice",
    "maize",
    "corn",
    "cotton",
    "sugarcane",
    "potato",
    "tomato",
    "onion",
    "soybean",
    "chickpea",
    "mustard",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Submitting crop data:", formData)

      const response = await fetch("/api/crop-cycles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          area: Number.parseFloat(formData.area),
          status: "planted",
        }),
      })

      const data = await response.json()
      console.log("[v0] Crop creation response:", data)

      if (data.success) {
        toast({
          title: t("common.success"),
          description: t("dashboard.cropAdded"),
        })
        setFormData({
          field_id: "",
          crop_name: "",
          variety: "",
          planting_date: "",
          expected_harvest: "",
          area: "",
        })
        onOpenChange(false)
        window.location.reload()
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("[v0] Crop creation error:", error)
      toast({
        title: t("common.error"),
        description: t("common.errorOccurred"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t("dashboard.addNewCrop")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="field">{t("fieldManagement.field")}</Label>
              <Select
                value={formData.field_id}
                onValueChange={(value) => setFormData({ ...formData, field_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("fieldManagement.selectField")} />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.field_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="crop">{t("fieldManagement.cropName")}</Label>
            <Select
              value={formData.crop_name}
              onValueChange={(value) => setFormData({ ...formData, crop_name: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder={t("fieldManagement.selectCrop")} />
              </SelectTrigger>
              <SelectContent>
                {cropOptions.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {t(`crops.${crop}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variety">{t("fieldManagement.variety")}</Label>
            <Input
              id="variety"
              value={formData.variety}
              onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
              placeholder={t("fieldManagement.enterVariety")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="planting_date">{t("fieldManagement.plantingDate")}</Label>
              <Input
                id="planting_date"
                type="date"
                value={formData.planting_date}
                onChange={(e) => setFormData({ ...formData, planting_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expected_harvest">{t("fieldManagement.expectedHarvest")}</Label>
              <Input
                id="expected_harvest"
                type="date"
                value={formData.expected_harvest}
                onChange={(e) => setFormData({ ...formData, expected_harvest: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="area">{t("fieldManagement.area")} (hectares)</Label>
            <Input
              id="area"
              type="number"
              step="0.1"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              placeholder="0.0"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
