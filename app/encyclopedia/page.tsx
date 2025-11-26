"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/Navbar"
import { Search, BookOpen, Sprout, Calendar, Droplets, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n/context"

interface CropInfo {
  id: string
  crop_name: string
  scientific_name: string
  description: string
  planting_season: string
  harvest_time: string
  water_requirements: string
  soil_type: string
  fertilizer_needs: string
  common_diseases: string[]
  prevention_tips: string[]
  image_url?: string
}

export default function Encyclopedia() {
  const { language, t } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")
  const [crops, setCrops] = useState<CropInfo[]>([])
  const [filteredCrops, setFilteredCrops] = useState<CropInfo[]>([])
  const [selectedCrop, setSelectedCrop] = useState<CropInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCrops()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = crops.filter(
        (crop) =>
          crop.crop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crop.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crop.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCrops(filtered)
    } else {
      setFilteredCrops(crops)
    }
  }, [searchTerm, crops])

  const fetchCrops = async () => {
    try {
      const response = await fetch("/api/encyclopedia")
      const data = await response.json()

      if (data.success) {
        setCrops(data.crops)
        setFilteredCrops(data.crops)
      } else {
        throw new Error(data.error || "Failed to fetch crops")
      }
    } catch (error) {
      console.error("Error fetching crops:", error)
      toast({
        title: language === "hi" ? "त्रुटि" : "Error",
        description: language === "hi" ? "फसल की जानकारी लोड नहीं हो सकी" : "Failed to load crop information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is handled by useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border-2 border-gray-200">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t("encyclopedia.title")}</h1>
          <p className="text-sm sm:text-base text-gray-600">{t("encyclopedia.subtitle")}</p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 border-2 border-gray-200 shadow-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t("encyclopedia.searchCrops")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                <Search className="h-4 w-4 mr-2" />
                {t("common.search")}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Crops List */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-gray-200 shadow-md bg-white sticky top-6">
              <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b-2">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  {t("encyclopedia.allCrops")}
                  <Badge variant="secondary">{filteredCrops.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : filteredCrops.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 bg-gray-50">
                    <p>{t("encyclopedia.noCropsFound")}</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto custom-scrollbar">
                    {filteredCrops.map((crop, index) => (
                      <div key={`crop-list-${index}`}>
                        <button
                          onClick={() => setSelectedCrop(crop)}
                          className={`w-full text-left p-4 hover:bg-green-50 transition-colors border-l-4 ${
                            selectedCrop?.id === crop.id ? "bg-green-50 border-l-green-500" : "border-l-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex-shrink-0">
                              <img
                                src={
                                  crop.image_url ||
                                  `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(crop.crop_name + " crop plant") || "/placeholder.svg"}`
                                }
                                alt={crop.crop_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = `/placeholder.svg?height=40&width=40&query=${encodeURIComponent(crop.crop_name + " crop plant")}`
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{crop.crop_name}</div>
                              {crop.scientific_name && (
                                <div className="text-sm text-gray-500 italic">{crop.scientific_name}</div>
                              )}
                            </div>
                          </div>
                        </button>
                        {index < filteredCrops.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Crop Details */}
          <div className="lg:col-span-3">
            {selectedCrop ? (
              <div className="space-y-6">
                {/* Header */}
                <Card className="border-2 border-gray-200 shadow-md bg-white">
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-green-100 flex-shrink-0">
                          <img
                            src={
                              selectedCrop.image_url ||
                              `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(selectedCrop.crop_name + " crop plant field") || "/placeholder.svg"}`
                            }
                            alt={selectedCrop.crop_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-xl sm:text-2xl text-green-800">{selectedCrop.crop_name}</CardTitle>
                          {selectedCrop.scientific_name && (
                            <p className="text-sm text-gray-600 italic mt-1">{selectedCrop.scientific_name}</p>
                          )}
                        </div>
                      </div>
                      <Sprout className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{selectedCrop.description}</p>
                  </CardContent>
                </Card>

                {/* Growing Information */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="border-2 border-blue-200 shadow-md bg-white hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        {t("encyclopedia.growingSeason")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="font-medium text-gray-700 text-sm">{t("encyclopedia.plantingSeason")}</Label>
                        <p className="text-gray-600 mt-1 text-sm">{selectedCrop.planting_season}</p>
                      </div>
                      <div>
                        <Label className="font-medium text-gray-700 text-sm">{t("encyclopedia.harvestTime")}</Label>
                        <p className="text-gray-600 mt-1 text-sm">{selectedCrop.harvest_time}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-blue-200 shadow-md bg-white hover:shadow-xl transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Droplets className="h-5 w-5 text-blue-600" />
                        {t("encyclopedia.soilRequirements")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="font-medium text-gray-700 text-sm">{t("encyclopedia.soilType")}</Label>
                        <p className="text-gray-600 mt-1 text-sm">{selectedCrop.soil_type}</p>
                      </div>
                      <div>
                        <Label className="font-medium text-gray-700 text-sm">{t("encyclopedia.waterNeeds")}</Label>
                        <p className="text-gray-600 mt-1 text-sm">{selectedCrop.water_requirements}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Fertilizer Needs */}
                <Card className="border-2 border-green-200 shadow-md bg-white">
                  <CardHeader>
                    <CardTitle className="text-base sm:text-lg">{t("encyclopedia.fertilizerRequirements")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm sm:text-base text-gray-700">{selectedCrop.fertilizer_needs}</p>
                  </CardContent>
                </Card>

                {/* Diseases and Prevention */}
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                  <Card className="border-2 border-red-200 shadow-md bg-white">
                    <CardHeader>
                      <CardTitle className="text-red-700 text-base sm:text-lg">
                        {t("encyclopedia.commonDiseases")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedCrop.common_diseases?.length > 0 ? (
                          selectedCrop.common_diseases.map((disease, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {disease}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">{t("encyclopedia.noDiseases")}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200 shadow-md bg-white">
                    <CardHeader>
                      <CardTitle className="text-green-700 text-base sm:text-lg">
                        {t("encyclopedia.preventionTips")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {selectedCrop.prevention_tips?.length > 0 ? (
                          selectedCrop.prevention_tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-700 text-xs sm:text-sm">{tip}</span>
                            </li>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">{t("encyclopedia.noTips")}</p>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="border-2 border-dashed border-gray-300 shadow-md bg-gray-50">
                <CardContent className="flex items-center justify-center h-64 sm:h-96">
                  <div className="text-center px-4">
                    <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                      {t("encyclopedia.selectCrop")}
                    </h3>
                    <p className="text-sm text-gray-600">{t("encyclopedia.chooseCrop")}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm font-medium ${className}`}>{children}</div>
}
