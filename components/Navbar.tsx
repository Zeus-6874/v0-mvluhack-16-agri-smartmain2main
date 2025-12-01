"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogOut, Menu, X } from "lucide-react"
import { useTranslate, useTolgee } from "@tolgee/react"
import styled from "styled-components"

const StyledWrapper = styled.div`
  .nav-container {
    background: linear-gradient(135deg, #ffffff 0%, #f8faf8 100%);
    border-bottom: 1px solid #e5e7eb;
    position: sticky;
    top: 0;
    z-index: 50;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .nav-content {
    max-width: 100%;
    margin: 0 auto;
    padding: 0.5rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    text-decoration: none;
  }

  .logo-icon {
    width: 2rem;
    height: 2rem;
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 0.875rem;
  }

  .logo-text {
    font-size: 1.25rem;
    font-weight: bold;
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-links {
    --round: 10px;
    --p-x: 8px;
    --p-y: 4px;
    --w-label: 140px;
    display: flex;
    align-items: center;
    padding: var(--p-y) var(--p-x);
    position: relative;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: var(--round);
    border: 1px solid #e5e7eb;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    max-width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .nav-links::-webkit-scrollbar {
    display: none;
  }

  .nav-link {
    cursor: pointer;
    outline: none;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    background: transparent;
    padding: 10px 12px;
    width: var(--w-label);
    min-width: var(--w-label);
    text-decoration: none;
    user-select: none;
    transition: color 0.25s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
    border: none;
    white-space: nowrap;
  }

  .nav-link span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .nav-link.active {
    color: #16a34a;
    font-weight: 600;
  }

  .nav-link:hover {
    color: #16a34a;
  }

  .slider {
    position: absolute;
    height: calc(100% - (var(--p-y) * 4));
    width: var(--w-label);
    border-radius: calc(var(--round) - var(--p-y));
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    transform-origin: 0 0 0;
    z-index: 0;
    transition: transform 0.5s cubic-bezier(0.33, 0.83, 0.99, 0.98);
    box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
  }

  .bar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: absolute;
    transform-origin: 0 0 0;
    height: 100%;
    width: var(--w-label);
    z-index: 0;
    transition: transform 0.5s cubic-bezier(0.33, 0.83, 0.99, 0.98);
  }

  .bar::before,
  .bar::after {
    content: "";
    position: absolute;
    height: 3px;
    width: 100%;
    background: #16a34a;
  }

  .bar::before {
    top: 0;
    border-radius: 0 0 9999px 9999px;
  }

  .bar::after {
    bottom: 0;
    border-radius: 9999px 9999px 0 0;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  @media (max-width: 1280px) {
    .nav-links {
      --w-label: 120px;
    }
  }

  @media (max-width: 1024px) {
    .nav-links {
      --w-label: 100px;
    }
  }

  @media (max-width: 768px) {
    .nav-links {
      --w-label: 90px;
      font-size: 0.75rem;
    }
    
    .logo-text {
      display: none;
    }
  }
`

export default function Navbar() {
  const pathname = usePathname()
  const { t } = useTranslate()
  const tolgee = useTolgee(["language"])
  const language = tolgee.getLanguage() || "en"
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/field-management", label: t("nav.fields") },
    { href: "/soil-health", label: t("nav.soil") },
    { href: "/disease-detection", label: t("nav.disease") },
    { href: "/encyclopedia", label: t("nav.encyclopedia") },
    { href: "/weather", label: t("nav.weather") },
    { href: "/market-prices", label: t("nav.market") },
    { href: "/schemes", label: t("nav.schemes") },
    { href: "/knowledge", label: t("nav.knowledge") },
    { href: "/settings", label: t("nav.settings") },
  ]

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                AS
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">AgriSmart</span>
            </Link>

            <div className="hidden md:flex items-center flex-1 mx-6 overflow-x-auto scrollbar-hide">
              <div className="flex items-center space-x-1 min-w-max">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      pathname === item.href
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Select value={language} onValueChange={(val) => tolgee.changeLanguage(val)}>
                <SelectTrigger className="w-[100px] h-9 bg-white border-gray-300 hidden sm:flex">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी</SelectItem>
                  <SelectItem value="mr">मराठी</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("common.logout")}
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />

        {/* Slide-out menu */}
        <div
          className={`fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
                  AS
                </div>
                <span className="text-xl font-bold text-gray-900">AgriSmart</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-6 py-3 text-base font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-green-50 text-green-600 border-l-4 border-green-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Menu Footer */}
            <div className="border-t border-gray-200 p-4 space-y-3">
              <div className="px-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t("settings.language")}</label>
                <Select value={language} onValueChange={(val) => tolgee.changeLanguage(val)}>
                  <SelectTrigger className="w-full bg-white border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी</SelectItem>
                    <SelectItem value="mr">मराठी</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t("common.logout")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}
