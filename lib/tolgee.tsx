"use client"

import { Tolgee, FormatSimple, TolgeeProvider as TolgeeProviderBase } from "@tolgee/react"
import { type ReactNode, useMemo, useEffect, useState } from "react"

export function TolgeeProvider({ children }: { children: ReactNode }) {
  const [currentLocale, setCurrentLocale] = useState<string>("en")
  const [translations, setTranslations] = useState<Record<string, any>>({})

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en"
    setCurrentLocale(savedLanguage)
  }, [])

  useEffect(() => {
    async function fetchTranslations() {
      try {
        const response = await fetch("/api/translations?languages=en,hi,mr")
        if (response.ok) {
          const data = await response.json()
          setTranslations(data)
        } else {
          console.error("[v0] Failed to fetch translations from server")
        }
      } catch (error) {
        console.error("[v0] Error fetching translations:", error)
      }
    }

    fetchTranslations()
  }, [])

  const tolgee = useMemo(() => {
    return Tolgee()
      .use(FormatSimple())
      .init({
        staticData: translations,
        defaultLanguage: currentLocale,
        fallbackLanguage: "en",
        availableLanguages: ["en", "hi", "mr"],
      })
  }, [currentLocale, translations])

  return <TolgeeProviderBase tolgee={tolgee}>{children}</TolgeeProviderBase>
}
