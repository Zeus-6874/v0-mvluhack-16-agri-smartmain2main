"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/Navbar"
import { Camera, Upload, Loader2, AlertTriangle, CheckCircle, Brain, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTranslate, useTolgee } from "@tolgee/react"
import Image from "next/image"
import * as tmImage from "@teachablemachine/image"
import { getModelForCrop, isCropSupported } from "@/lib/teachable-machine-models"

interface DiseaseDetectionResult {
  disease_name: string
  confidence: number
  symptoms: string[]
  treatments: string[]
  crop_name: string
  severity?: string
  prevention_tips?: string[]
}

export default function DiseaseDetection() {
  const { t } = useTranslate()
  const tolgee = useTolgee(["language"])
  const language = tolgee.getLanguage()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isLoadingModel, setIsLoadingModel] = useState(false)
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null)
  const [selectedCrop, setSelectedCrop] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [detectionResult, setDetectionResult] = useState<DiseaseDetectionResult | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<DiseaseDetectionResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const crops = [
    { value: "Rice", label: language === "hi" ? "चावल" : language === "mr" ? "तांदूळ" : "Rice" },
    { value: "Wheat", label: language === "hi" ? "गेहूं" : language === "mr" ? "गहू" : "Wheat" },
    { value: "Maize", label: language === "hi" ? "मक्का" : language === "mr" ? "मका" : "Maize" },
    { value: "Cotton", label: language === "hi" ? "कपास" : language === "mr" ? "कापूस" : "Cotton" },
    { value: "Sugarcane", label: language === "hi" ? "गन्ना" : language === "mr" ? "ऊस" : "Sugarcane" },
    { value: "Tomato", label: language === "hi" ? "टमाटर" : language === "mr" ? "टोमॅटो" : "Tomato" },
    { value: "Potato", label: language === "hi" ? "आलू" : language === "mr" ? "बटाटा" : "Potato" },
    { value: "Onion", label: language === "hi" ? "प्याज" : language === "mr" ? "कांदा" : "Onion" },
    { value: "Corn", label: language === "hi" ? "मकई" : language === "mr" ? "मका" : "Corn" },
  ]

  useEffect(() => {
    const loadModel = async () => {
      if (!selectedCrop || !isCropSupported(selectedCrop)) {
        setModel(null)
        return
      }

      setIsLoadingModel(true)
      try {
        const modelUrl = getModelForCrop(selectedCrop)
        if (!modelUrl) {
          console.error("[v0] No model found for crop:", selectedCrop)
          return
        }

        const modelURL = modelUrl + "model.json"
        const metadataURL = modelUrl + "metadata.json"

        console.log("[v0] Loading AI model for", selectedCrop)
        const loadedModel = await tmImage.load(modelURL, metadataURL)
        setModel(loadedModel)
        console.log("[v0] Model loaded successfully")

        toast({
          title: language === "hi" ? "AI मॉडल तैयार" : language === "mr" ? "AI मॉडेल तयार" : "AI Model Ready",
          description:
            language === "hi"
              ? `${selectedCrop} रोग पहचान के लिए तैयार`
              : language === "mr"
                ? `${selectedCrop} रोग ओळख साठी तयार`
                : `Ready to detect ${selectedCrop} diseases`,
        })
      } catch (error) {
        console.error("[v0] Error loading model:", error)
        toast({
          title: language === "hi" ? "मॉडल लोड त्रुटि" : language === "mr" ? "मॉडेल लोड त्रुटी" : "Model Load Error",
          description:
            language === "hi"
              ? "AI मॉडल लोड नहीं हो सका"
              : language === "mr"
                ? "AI मॉडेल लोड होऊ शकले नाही"
                : "Failed to load AI model",
          variant: "destructive",
        })
      } finally {
        setIsLoadingModel(false)
      }
    }

    loadModel()
  }, [selectedCrop, language, toast])

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: language === "hi" ? "त्रुटि" : language === "mr" ? "त्रुटी" : "Error",
          description:
            language === "hi"
              ? "फ़ाइल का आकार 10MB से कम होना चाहिए"
              : language === "mr"
                ? "फाइलचे आकार 10MB निम्न असे असावे"
                : "File size should be less than 10MB",
          variant: "destructive",
        })
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDetectDisease = async () => {
    if (!selectedImage || !selectedCrop) {
      toast({
        title: language === "hi" ? "त्रुटि" : language === "mr" ? "त्रुटी" : "Error",
        description:
          language === "hi"
            ? "कृपया फसल चुनें और छवि अपलोड करें"
            : language === "mr"
              ? "कृपया पीक निवडा आणि प्रतिमा अपलोड करा"
              : "Please select crop and upload image",
        variant: "destructive",
      })
      return
    }

    if (!model && isCropSupported(selectedCrop)) {
      toast({
        title: language === "hi" ? "मॉडल लोड हो रहा है" : language === "mr" ? "मॉडेल लोड होत आहे" : "Loading Model",
        description:
          language === "hi"
            ? "कृपया AI मॉडल लोड होने तक प्रतीक्षा करें"
            : language === "mr"
              ? "कृपया AI मॉडेल लोड होईपर्यंत प्रतीक्षा करा"
              : "Please wait for AI model to load",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    try {
      let predictions = null
      if (model && isCropSupported(selectedCrop)) {
        const img = new window.Image()
        img.src = imagePreview!

        await new Promise((resolve) => {
          img.onload = resolve
        })

        console.log("[v0] Running AI prediction...")
        predictions = await model.predict(img)
        console.log("[v0] Predictions:", predictions)
      }

      const formData = new FormData()
      formData.append("image", selectedImage)
      formData.append("crop_name", selectedCrop)

      if (predictions) {
        formData.append("predictions", JSON.stringify(predictions))
      }

      const response = await fetch("/api/disease", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setDetectionResult(data.detection)
        setAnalysisHistory((prev) => [data.detection, ...prev.slice(0, 4)])
        toast({
          title: language === "hi" ? "विश्लेषण पूर्ण" : language === "mr" ? "विश्लेषण पूर्ण" : "Analysis Complete",
          description:
            language === "hi"
              ? "रोग की पहचान सफलतापूर्वक की गई"
              : language === "mr"
                ? "रोग ओळख यशस्वीरित्या पूर्ण झाली"
                : "Disease detection completed successfully",
        })
      } else {
        throw new Error(data.error || "Detection failed")
      }
    } catch (error) {
      console.error("[v0] Detection error:", error)
      toast({
        title: language === "hi" ? "त्रुटि" : language === "mr" ? "त्रुटी" : "Error",
        description:
          language === "hi"
            ? "रोग की पहचान में त्रुटि हुई"
            : language === "mr"
              ? "रोग ओळखीत त्रुटी झाली"
              : "Error occurred during disease detection",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600 bg-green-100 border-green-200"
    if (confidence >= 0.6) return "text-yellow-600 bg-yellow-100 border-yellow-200"
    return "text-red-600 bg-red-100 border-red-200"
  }

  const getSeverityLevel = (confidence: number) => {
    if (confidence >= 0.8) return language === "hi" ? "गंभीर" : language === "mr" ? "गंभीर" : "Severe"
    if (confidence >= 0.6) return language === "hi" ? "मध्यम" : language === "mr" ? "मध्यम" : "Moderate"
    return language === "hi" ? "हल्का" : language === "mr" ? "हल्का" : "Mild"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === "hi"
                  ? "AI रोग पहचान प्रणाली"
                  : language === "mr"
                    ? "AI रोग ओळख प्रणाली"
                    : "AI Disease Detection System"}
              </h1>
              <p className="text-gray-600">
                {language === "hi"
                  ? "उन्नत AI तकनीक के साथ फसल रोगों की तुरंत पहचान करें"
                  : language === "mr"
                    ? "प्रगत AI तंत्रज्ञानासह पीक रोगांची तात्काळ ओळख करा"
                    : "Instantly identify crop diseases with advanced AI technology"}
              </p>
            </div>
          </div>

          {isLoadingModel && (
            <Alert className="bg-blue-50 border-blue-200 mb-4">
              <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
              <AlertDescription className="text-blue-800">
                {language === "hi"
                  ? "AI मॉडल लोड हो रहा है..."
                  : language === "mr"
                    ? "AI मॉडेल लोड होत आहे..."
                    : "Loading AI model..."}
              </AlertDescription>
            </Alert>
          )}

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  {language === "hi"
                    ? "AI-संचालित विश्लेषण"
                    : language === "mr"
                      ? "AI संचालित विश्लेषण"
                      : "AI-Powered Analysis"}
                </h2>
                <p className="text-blue-100">
                  {language === "hi"
                    ? "95% सटीकता के साथ 50+ रोगों की पहचान"
                    : language === "mr"
                      ? "95% सटीकता साठी 50+ रोगांची पहचान"
                      : "Identify 50+ diseases with 95% accuracy"}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <Zap className="h-8 w-8 mx-auto mb-1" />
                  <div className="text-sm">{language === "hi" ? "तुरंत" : language === "mr" ? "तुरंत" : "Instant"}</div>
                </div>
                <div className="text-center">
                  <Brain className="h-8 w-8 mx-auto mb-1" />
                  <div className="text-sm">{language === "hi" ? "स्मार्ट" : language === "mr" ? "स्मार्ट" : "Smart"}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  {language === "hi" ? "छवि अपलोड करें" : language === "mr" ? "प्रतिमा अपलोड करा" : "Upload Image"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {language === "hi" ? "फसल का चयन करें" : language === "mr" ? "पीक निवडा" : "Select Crop"}
                  </Label>
                  <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                    <SelectTrigger className="h-12">
                      <SelectValue
                        placeholder={language === "hi" ? "फसल चुनें" : language === "mr" ? "पीक निवडा" : "Choose crop"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {crops.map((crop) => (
                        <SelectItem key={crop.value} value={crop.value}>
                          {crop.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="relative w-full max-w-md mx-auto">
                          <Image
                            src={imagePreview || "/placeholder.svg"}
                            alt="Selected crop image"
                            width={400}
                            height={300}
                            className="rounded-lg object-cover w-full h-64 shadow-md"
                          />
                        </div>
                        <p className="text-sm text-gray-600">
                          {language === "hi"
                            ? "छवि बदलने के लिए क्लिक करें"
                            : language === "mr"
                              ? "प्रतिमा बदलण्यासाठी क्लिक करा"
                              : "Click to change image"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="h-16 w-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            {language === "hi"
                              ? "छवि अपलोड करें"
                              : language === "mr"
                                ? "प्रतिमा अपलोड करा"
                                : "Upload Image"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {language === "hi"
                              ? "PNG, JPG या JPEG (अधिकतम 10MB)"
                              : language === "mr"
                                ? "PNG, JPG असा या JPEG (अधिकतम 10MB)"
                                : "PNG, JPG or JPEG (Max 10MB)"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>

                <Button
                  onClick={handleDetectDisease}
                  disabled={isAnalyzing || !selectedImage || !selectedCrop}
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {language === "hi"
                        ? "AI विश्लेषण हो रहा है..."
                        : language === "mr"
                          ? "AI विश्लेषण झाले आहे..."
                          : "AI Analyzing..."}
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      {language === "hi"
                        ? "AI से रोग की पहचान करें"
                        : language === "mr"
                          ? "AI साठी रोग पहचाना"
                          : "Detect Disease with AI"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {detectionResult && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    {language === "hi"
                      ? "AI विश्लेषण परिणाम"
                      : language === "mr"
                        ? "AI विश्लेषण परिणाम"
                        : "AI Analysis Results"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                    <div>
                      <h3 className="text-xl font-bold text-orange-800 mb-1">{detectionResult.disease_name}</h3>
                      <p className="text-sm text-orange-600 mb-2">
                        {language === "hi" ? "फसल:" : language === "mr" ? "पीक:" : "Crop:"} {detectionResult.crop_name}
                      </p>
                      <p className="text-sm text-orange-600">
                        {language === "hi" ? "गंभीरता:" : language === "mr" ? "गंभीरता:" : "Severity:"}{" "}
                        {getSeverityLevel(detectionResult.confidence)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getConfidenceColor(detectionResult.confidence)} border text-lg px-4 py-2`}>
                        {Math.round(detectionResult.confidence * 100)}%
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {language === "hi" ? "विश्वसनीयता" : language === "mr" ? "विश्वसनीयता" : "Confidence"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      {language === "hi" ? "पहचाने गए लक्षण" : language === "mr" ? "पहचानलेले लक्षण" : "Identified Symptoms"}
                    </h4>
                    <div className="grid gap-3">
                      {detectionResult.symptoms.map((symptom, index) => (
                        <Alert key={index} className="border-red-200 bg-red-50">
                          <AlertDescription className="text-red-800 font-medium">{symptom}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      {language === "hi"
                        ? "AI सुझावित उपचार"
                        : language === "mr"
                          ? "AI सुझावित उपचार"
                          : "AI Recommended Treatments"}
                    </h4>
                    <div className="grid gap-3">
                      {detectionResult.treatments.map((treatment, index) => (
                        <Alert key={index} className="border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800 font-medium">{treatment}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "hi" ? "उपयोग निर्देश" : language === "mr" ? "उपयोग निर्देश" : "How to Use"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm font-medium">
                    {language === "hi"
                      ? "अपनी फसल का चयन करें"
                      : language === "mr"
                        ? "तुमच्या पीकाचे निवडा करा"
                        : "Select your crop type"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm font-medium">
                    {language === "hi"
                      ? "प्रभावित पत्ती या पौधे की स्पष्ट छवि अपलोड करें"
                      : language === "mr"
                        ? "प्रभावित पत्ती या पौधाची स्पष्ट प्रतिमा अपलोड करा"
                        : "Upload clear image of affected leaf or plant"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm font-medium">
                    {language === "hi"
                      ? "AI विश्लेषण के लिए प्रतीक्षा करें"
                      : language === "mr"
                        ? "AI विश्लेषणसाठी प्रतीक्षा करा"
                        : "Wait for AI analysis"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p className="text-sm font-medium">
                    {language === "hi"
                      ? "परिणाम और उपचार सुझाव देखें"
                      : language === "mr"
                        ? "परिणाम आणि उपचार सुझाव देखा"
                        : "View results and treatment suggestions"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === "hi"
                    ? "बेहतर परिणाम के लिए सुझाव"
                    : language === "mr"
                      ? "बेहतर परिणामसाठी सुझाव"
                      : "Tips for Better Results"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {language === "hi" ? "अच्छी रोशनी" : language === "mr" ? "अच्छी रोशनी" : "Good Lighting"}
                  </h4>
                  <p className="text-sm text-green-700">
                    {language === "hi"
                      ? "प्राकृतिक रोशनी में फोटो लें"
                      : language === "mr"
                        ? "प्राकृतिक रोशनीत फोटो ला"
                        : "Take photos in natural light"}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    {language === "hi" ? "स्पष्ट छवि" : language === "mr" ? "स्पष्ट प्रतिमा" : "Clear Focus"}
                  </h4>
                  <p className="text-sm text-blue-700">
                    {language === "hi"
                      ? "प्रभावित हिस्से पर फोकस करें"
                      : language === "mr"
                        ? "प्रभावित हिस्सेत फोकस करा"
                        : "Focus on the affected area"}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">
                    {language === "hi" ? "सही कोण" : language === "mr" ? "सही कोण" : "Right Angle"}
                  </h4>
                  <p className="text-sm text-purple-700">
                    {language === "hi"
                      ? "पत्ती के समानांतर फोटो लें"
                      : language === "mr"
                        ? "पत्तीत समानांतर फोटो ला"
                        : "Take photo parallel to the leaf"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {analysisHistory.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {language === "hi" ? "हाल के विश्लेषण" : language === "mr" ? "हालचस विश्लेषण" : "Recent Analyses"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysisHistory.slice(0, 3).map((analysis, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{analysis.disease_name}</p>
                          <p className="text-xs text-gray-600">{analysis.crop_name}</p>
                        </div>
                        <Badge className={`${getConfidenceColor(analysis.confidence)} text-xs`}>
                          {Math.round(analysis.confidence * 100)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
