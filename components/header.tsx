"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/context/language-context"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const navLinks = [
    { label: t("nav.home"), href: "#" },
    { label: t("nav.aboutUs"), href: "#about" },
    { label: t("nav.solutions"), href: "#solutions" },
    { label: t("nav.whyHcs"), href: "#why-hcs" },
    { label: t("nav.partners"), href: "#partners" },
    { label: t("nav.contact"), href: "#contact" },
  ]

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-[#0A0A0A]">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="flex h-20 items-start pt-5">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold tracking-tight text-white font-[family-name:var(--font-sora)] leading-none">
                HC<span className="bg-gradient-to-b from-white from-50% to-[#D90429] to-50% bg-clip-text text-transparent inline-block">S</span>
              </span>
              <span className="text-[8.5px] tracking-[0.18em] text-gray-400 uppercase font-semibold mt-1 whitespace-nowrap">TRADING</span>
            </div>
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex gap-8 pt-1">
            {navLinks.map((link, index) => {
              const isActive = index === 0 // Home is active by default
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm transition-colors relative pb-1 ${
                    isActive 
                      ? "text-white font-medium after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-[2px] after:bg-[#D90429]" 
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex gap-4 flex-1 justify-end pt-1">
            <Button asChild className="bg-[#D90429] hover:bg-[#B80324] text-white rounded-md px-5 py-2 text-sm font-semibold cursor-pointer">
              <Link href="#contact">
                {t("nav.contactUs")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden gap-3 pt-1">
            <button
              className="text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A0A0A]/95 backdrop-blur-md rounded-lg mt-2 p-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="bg-[#D90429] hover:bg-[#B80324] text-white rounded-md w-full mt-2 font-semibold cursor-pointer">
                <Link href="#contact" onClick={() => setMobileMenuOpen(false)}>
                  {t("nav.contactUs")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
