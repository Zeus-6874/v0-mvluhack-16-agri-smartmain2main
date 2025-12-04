"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslate } from "@tolgee/react"
import { useToast } from "@/hooks/use-toast"
import type { Field } from "@/types/components"

interface AddCropModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fields?: Field[]
}

export default function AddCropModal({ open, onOpenChange, fields = [] }: AddCropModalProps) {
  const { t } = useTranslate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    field_id: "",
    crop_name: "",
    variety: "",
    planting_date: "",
    expected_harvest_date: "",
    area: "",
    notes: "",
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
      const response = await fetch("/api/crop-cycles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          field_id: formData.field_id,
          crop_name: formData.crop_name,
          variety: formData.variety || null,
          planting_date: formData.planting_date || null,
          expected_harvest_date: formData.expected_harvest_date || null,
          notes: formData.notes || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: t("feedback.success"),
          description: t("feedback.cropAdded"),
          className: "bg-green-50 border-green-200",
        })
        setFormData({
          field_id: "",
          crop_name: "",
          variety: "",
          planting_date: "",
          expected_harvest_date: "",
          area: "",
          notes: "",
        })
        onOpenChange(false)
        setTimeout(() => window.location.reload(), 500)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: t("feedback.error"),
        description: error instanceof Error ? error.message : t("feedback.error"),
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
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("fieldManagement.selectField")} />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field, index) => (
                    <SelectItem key={field._id || index} value={field._id?.toString() || ""}>
                      {field.name}
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
              <Label htmlFor="expected_harvest_date">{t("fieldManagement.expectedHarvest")}</Label>
              <Input
                id="expected_harvest_date"
                type="date"
                value={formData.expected_harvest_date}
                onChange={(e) => setFormData({ ...formData, expected_harvest_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("fieldManagement.notes")}</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder={t("fieldManagement.additionalNotes")}
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
