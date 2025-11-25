import { translations, type Language } from "./i18n/translations"

export function t(key: string, language: Language = "en"): string {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k]
    } else {
      // Fallback to English if key not found
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === "object" && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key // Return key if not found in fallback
        }
      }
      break
    }
  }

  return typeof value === "string" ? value : key
}
