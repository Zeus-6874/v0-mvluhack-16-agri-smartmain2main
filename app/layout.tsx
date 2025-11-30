import type React from "react"
import type { Metadata } from "next"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Suspense } from "react"
import { TolgeeProvider } from "@/lib/tolgee"
import "./globals.css"

export const metadata: Metadata = {
  title: "AgriSmart - Comprehensive Crop & Soil Management System",
  description:
    "AI-powered agricultural platform for smart crop selection, soil health management, disease detection, weather intelligence, and market connections.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">
        <Suspense fallback={null}>
          <TolgeeProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </TolgeeProvider>
        </Suspense>
      </body>
    </html>
  )
}
