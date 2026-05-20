"use client"

import { useLanguage } from "@/context/language-context"
import { Globe } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en")
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/20 bg-transparent hover:bg-white/10 transition-colors text-sm font-medium text-white cursor-pointer"
      aria-label={language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase">{language === "en" ? "ES" : "EN"}</span>
    </button>
  )
}
