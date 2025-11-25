"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, Globe, LogOut, Check } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage, t } = useI18n()

  const navItems = [
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/field-management", label: t("nav.fieldManagement") },
    { href: "/soil-health", label: t("nav.soilHealth") },
    { href: "/disease-detection", label: t("nav.diseaseDetection") },
    { href: "/encyclopedia", label: t("nav.encyclopedia") },
    { href: "/weather", label: t("nav.weather") },
    { href: "/market-prices", label: t("nav.marketPrices") },
    { href: "/knowledge", label: t("nav.knowledge") },
  ]

  const languages = [
    { code: "en", name: "English", flag: "EN" },
    { code: "hi", name: "हिंदी", flag: "हिं" },
    { code: "mr", name: "मराठी", flag: "मर" },
  ]

  const isActive = (href: string) => pathname === href

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">AgriSmart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "text-green-700 bg-green-50"
                    : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-2">
            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:flex items-center space-x-1 bg-transparent">
                  <Globe className="h-4 w-4" />
                  <span>{languages.find((l) => l.code === language)?.flag || "EN"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as "en" | "hi" | "mr")}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span>{lang.name}</span>
                    {language === lang.code && <Check className="h-4 w-4 text-green-600" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="flex flex-col space-y-2 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        isActive(item.href) ? "text-green-700 bg-green-50" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}

                  <div className="border-t pt-4 mt-4 space-y-2">
                    <p className="px-4 text-sm text-gray-500 font-medium">Language</p>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as "en" | "hi" | "mr")
                          setIsOpen(false)
                        }}
                        className={`w-full px-4 py-2 text-left rounded-lg flex items-center justify-between ${
                          language === lang.code ? "bg-green-50 text-green-700" : "hover:bg-gray-50"
                        }`}
                      >
                        <span>{lang.name}</span>
                        {language === lang.code && <Check className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={handleLogout} variant="destructive" className="w-full">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
