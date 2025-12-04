"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import { TrendingUp, TrendingDown, IndianRupee, BarChart3, RefreshCw, Loader2 } from "lucide-react"
import { useTranslate, useTolgee } from "@tolgee/react"

interface MarketPrice {
  crop: string
  cropHi: string
  cropMr: string
  price: number
  unit: string
  trend: "up" | "down" | "stable"
  change: number
  market: string
  marketHi: string
  marketMr: string
  lastUpdated: string
}

export default function MarketPrices() {
  const { t } = useTranslate()
  const tolgee = useTolgee(["language"])
  const language = tolgee.getLanguage() || "en"
  const [prices, setPrices] = useState<MarketPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fallbackPrices: MarketPrice[] = [
    {
      crop: "Rice",
      cropHi: "चावल",
      cropMr: "तांदूळ",
      price: 3200,
      unit: "per quintal",
      trend: "up",
      change: 2.5,
      market: "Delhi Mandi",
      marketHi: "दिल्ली मंडी",
      marketMr: "दिल्ली मंडी",
      lastUpdated: new Date().toISOString(),
    },
    {
      crop: "Wheat",
      cropHi: "गेहूं",
      cropMr: "गहू",
      price: 2150,
      unit: "per quintal",
      trend: "up",
      change: 1.8,
      market: "Punjab Mandi",
      marketHi: "पंजाब मंडी",
      marketMr: "पंजाब मंडी",
      lastUpdated: new Date().toISOString(),
    },
    {
      crop: "Maize",
      cropHi: "मक्का",
      cropMr: "मका",
      price: 1800,
      unit: "per quintal",
      trend: "down",
      change: -1.2,
      market: "UP Mandi",
      marketHi: "यूपी मंडी",
      marketMr: "यूपी मंडी",
      lastUpdated: new Date().toISOString(),
    },
    {
      crop: "Cotton",
      cropHi: "कपास",
      cropMr: "कापूस",
      price: 5600,
      unit: "per quintal",
      trend: "up",
      change: 3.2,
      market: "Gujarat Mandi",
      marketHi: "गुजरात मंडी",
      marketMr: "गुजरात मंडी",
      lastUpdated: new Date().toISOString(),
    },
    {
      crop: "Sugarcane",
      cropHi: "गन्ना",
      cropMr: "ऊस",
      price: 350,
      unit: "per quintal",
      trend: "up",
      change: 0.8,
      market: "Maharashtra Mandi",
      marketHi: "महाराष्ट्र मंडी",
      marketMr: "महाराष्ट्र मंडी",
      lastUpdated: new Date().toISOString(),
    },
    {
      crop: "Tomato",
      cropHi: "टमाटर",
      cropMr: "टोमॅटो",
      price: 4500,
      unit: "per quintal",
      trend: "down",
      change: -5.2,
      market: "Karnataka Mandi",
      marketHi: "कर्नाटक मंडी",
      marketMr: "कर्नाटक मंडी",
      lastUpdated: new Date().toISOString(),
    },
    {
      crop: "Potato",
      cropHi: "आलू",
      cropMr: "बटाटा",
      price: 1200,
      unit: "per quintal",
      trend: "up",
      change: 1.5,
      market: "UP Mandi",
      marketHi: "यूपी मंडी",
      marketMr: "यूपी मंडी",
      lastUpdated: new Date().toISOString(),
    },
    {
      crop: "Onion",
      cropHi: "प्याज",
      cropMr: "कांदा",
      price: 2800,
      unit: "per quintal",
      trend: "down",
      change: -2.8,
      market: "Nashik Mandi",
      marketHi: "नासिक मंडी",
      marketMr: "नाशिक मंडी",
      lastUpdated: new Date().toISOString(),
    },
    {
      crop: "Soybean",
      cropHi: "सोयाबीन",
      cropMr: "सोयाबीन",
      price: 4200,
      unit: "per quintal",
      trend: "up",
      change: 2.1,
      market: "MP Mandi",
      marketHi: "एमपी मंडी",
      marketMr: "एमपी मंडी",
      lastUpdated: new Date().toISOString(),
    },
    {
      crop: "Groundnut",
      cropHi: "मूंगफली",
      cropMr: "भुईमूग",
      price: 5100,
      unit: "per quintal",
      trend: "up",
      change: 1.9,
      market: "Gujarat Mandi",
      marketHi: "गुजरात मंडी",
      marketMr: "गुजरात मंडी",
      lastUpdated: new Date().toISOString(),
    },
  ]

  const fetchMarketPrices = async () => {
    try {
      const response = await fetch("/api/market-prices")
      const data = await response.json()

      if (data.success && data.prices && data.prices.length > 0) {
        setPrices(
          data.prices.map(
            (p: {
              crop: string
              cropHi: string
              cropMr?: string
              marketMr?: string
              marketHi: string
              market: string
              price: number
              unit: string
              trend: "up" | "down" | "stable"
              change: number
              lastUpdated: string
            }) => ({
              ...p,
              cropMr: p.cropMr || p.cropHi || p.crop,
              marketMr: p.marketMr || p.marketHi || p.market,
            }),
          ),
        )
      } else {
        setPrices(fallbackPrices)
      }
    } catch (error) {
      console.error("Error fetching market prices:", error)
      setPrices(fallbackPrices)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchMarketPrices()
  }

  useEffect(() => {
    fetchMarketPrices()
    const interval = setInterval(fetchMarketPrices, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getCropName = (item: MarketPrice) => {
    if (language === "hi") return item.cropHi
    if (language === "mr") return item.cropMr
    return item.crop
  }

  const getMarketName = (item: MarketPrice) => {
    if (language === "hi") return item.marketHi
    if (language === "mr") return item.marketMr
    return item.market
  }

  const getTrendText = (trend: string) => {
    if (trend === "up") return t("marketPrices.rising")
    if (trend === "down") return t("marketPrices.falling")
    return t("marketPrices.stable")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{t("marketPrices.title")}</h1>
            <p className="text-gray-600">{t("marketPrices.subtitle")}</p>
          </div>
          <Button onClick={handleRefresh} disabled={refreshing} variant="outline">
            {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            {t("common.refresh")}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              {t("marketPrices.todaysPrices")}
              <Badge variant="secondary" className="ml-auto bg-green-100 text-green-700">
                {t("marketPrices.live")}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                <span className="ml-2">{t("common.loading")}</span>
              </div>
            ) : (
              <div className="grid gap-4">
                {prices.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-3"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{getCropName(item)}</h3>
                      <p className="text-sm text-gray-500">{t("marketPrices.unit")}</p>
                      <p className="text-xs text-gray-400">{getMarketName(item)}</p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <div className="flex items-center gap-2 mb-1">
                        <IndianRupee className="h-4 w-4" />
                        <span className="text-xl font-bold">₹{item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 sm:justify-end">
                        {item.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : item.trend === "down" ? (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        ) : null}
                        <Badge
                          variant={
                            item.trend === "up" ? "default" : item.trend === "down" ? "destructive" : "secondary"
                          }
                          className="text-xs"
                        >
                          {item.change > 0 ? "+" : ""}
                          {item.change}%
                        </Badge>
                        <span className="text-xs text-gray-500 ml-1">{getTrendText(item.trend)}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {t("marketPrices.lastUpdated")}: {new Date(item.lastUpdated).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-green-800">{t("marketPrices.risingPrices")}</p>
                  <p className="text-2xl font-bold text-green-700">
                    {prices.filter((p) => p.trend === "up").length} {t("dashboard.crops")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">{t("marketPrices.fallingPrices")}</p>
                  <p className="text-2xl font-bold text-red-700">
                    {prices.filter((p) => p.trend === "down").length} {t("dashboard.crops")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">{t("marketPrices.averageGrowth")}</p>
                  <p className="text-2xl font-bold text-blue-700">
                    {prices.length > 0 ? (prices.reduce((acc, p) => acc + p.change, 0) / prices.length).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
