"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Globe, X, Check } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function LanguageSelector() {
  const { language, setLanguage } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [hasSeenSelector, setHasSeenSelector] = useState(false)

  // Show language selector on first visit
  useEffect(() => {
    const seen = localStorage.getItem("language_selector_seen")
    if (!seen) {
      setIsOpen(true)
      localStorage.setItem("language_selector_seen", "true")
    }
    setHasSeenSelector(!!seen)
  }, [])

  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी" },
    { code: "mr", name: "Marathi", nativeName: "मराठी" },
  ]

  const handleLanguageSelect = (lang: "en" | "hi" | "mr") => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Language Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        size="icon"
        aria-label="Change language"
      >
        <Globe className="h-6 w-6 text-white" />
      </Button>

      {/* Language Selector Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="h-6 w-6" />
                  <h2 className="text-xl font-bold">
                    {language === "en"
                      ? "Choose Your Language"
                      : language === "hi"
                        ? "अपनी भाषा चुनें"
                        : "तुमची भाषा निवडा"}
                  </h2>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-white/90">
                {language === "en"
                  ? "Select your preferred language for the app"
                  : language === "hi"
                    ? "ऐप के लिए अपनी पसंदीदा भाषा चुनें"
                    : "अॅपसाठी तुमची पसंतीची भाषा निवडा"}
              </p>
            </div>

            {/* Language Options */}
            <div className="p-6 space-y-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code as "en" | "hi" | "mr")}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:shadow-md ${
                    language === lang.code
                      ? "border-green-600 bg-green-50 shadow-sm"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        language === lang.code ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {lang.code.toUpperCase()}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{lang.nativeName}</p>
                      <p className="text-sm text-gray-500">{lang.name}</p>
                    </div>
                  </div>
                  {language === lang.code && <Check className="h-6 w-6 text-green-600" />}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <p className="text-xs text-center text-gray-500">
                {language === "en"
                  ? "You can change this anytime from the settings"
                  : language === "hi"
                    ? "आप इसे किसी भी समय सेटिंग्स से बदल सकते हैं"
                    : "तुम्ही सेटिंग्जमधून कधीही बदलू शकता"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
