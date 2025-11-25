"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styled from "styled-components"
import { Button } from "@/components/ui/button"
import { Globe, LogOut } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

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
  const { language, setLanguage, t } = useI18n()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const navItems = [
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/field-management", label: t("nav.fieldManagement") },
    { href: "/soil-health", label: t("nav.soilHealth") },
    { href: "/disease-detection", label: t("nav.diseaseDetection") },
    { href: "/encyclopedia", label: t("nav.encyclopedia") },
    { href: "/weather", label: t("nav.weather") },
    { href: "/market-prices", label: t("nav.marketPrices") },
    { href: "/schemes", label: t("nav.schemes") },
    { href: "/knowledge", label: t("nav.knowledge") },
  ]

  const activeIndex = navItems.findIndex((item) => pathname === item.href)
  const sliderPosition = hoveredIndex !== null ? hoveredIndex : activeIndex !== -1 ? activeIndex : 0

  const languages = [
    { code: "en", name: "EN" },
    { code: "hi", name: "हिं" },
    { code: "mr", name: "मर" },
  ]

  const currentLangIndex = languages.findIndex((l) => l.code === language)

  const toggleLanguage = () => {
    const nextIndex = (currentLangIndex + 1) % languages.length
    setLanguage(languages[nextIndex].code as "en" | "hi" | "mr")
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    window.location.href = "/"
  }

  return (
    <StyledWrapper>
      <nav className="nav-container">
        <div className="nav-content">
          <Link href="/dashboard" className="logo">
            <div className="logo-icon">AS</div>
            <span className="logo-text">AgriSmart</span>
          </Link>

          <div className="nav-links">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-link ${pathname === item.href ? "active" : ""}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span>{item.label}</span>
              </Link>
            ))}
            <div
              className="slider"
              style={{
                transform: `translateX(${sliderPosition * 100}%)`,
              }}
            />
            <div
              className="bar"
              style={{
                transform: `translateX(${sliderPosition * 100}%)`,
              }}
            />
          </div>

          <div className="actions">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-1 h-9 bg-transparent"
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">{languages[currentLangIndex].name}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 h-9"
            >
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </Button>
          </div>
        </div>
      </nav>
    </StyledWrapper>
  )
}
