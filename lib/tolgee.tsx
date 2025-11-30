"use client"

import { Tolgee, FormatSimple, TolgeeProvider as TolgeeProviderBase } from "@tolgee/react"
import { useRouter } from "next/navigation"
import { type ReactNode, useMemo, useEffect, useState } from "react"

const ServerProxyFetch = () => ({
  getRecord: async ({ language }: { language: string }) => {
    try {
      const response = await fetch(`/api/translations?languages=${language}`)
      if (!response.ok) {
        throw new Error("Failed to fetch translations")
      }
      const data = await response.json()
      return data[language] || {}
    } catch (error) {
      console.error("Failed to load translations:", error)
      return {}
    }
  },
})

export function TolgeeProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [currentLocale, setCurrentLocale] = useState<string>("en")

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en"
    setCurrentLocale(savedLanguage)
  }, [])

  const tolgee = useMemo(() => {
    return Tolgee()
      .use(FormatSimple())
      .use(ServerProxyFetch())
      .init({
        defaultLanguage: currentLocale,
        fallbackLanguage: "en",
        availableLanguages: ["en", "hi", "mr"],
      })
  }, [currentLocale])

  return <TolgeeProviderBase tolgee={tolgee}>{children}</TolgeeProviderBase>
}
