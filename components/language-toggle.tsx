"use client"

import { useLanguage } from "@/context/language-context"
import { Globe } from "lucide-react"
import { cn } from "@/lib/utils"

interface LanguageToggleProps {
  /** 'hero' = light-on-transparent (navbar / red chat header), 'panel' = light background (admin UI) */
  variant?: "hero" | "panel"
}

export function LanguageToggle({ variant = "hero" }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en")
  }

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm font-medium cursor-pointer",
        variant === "hero"
          ? "border border-white/20 bg-transparent text-white hover:bg-white/10"
          : "border bg-background text-foreground hover:bg-muted",
      )}
      aria-label={language === "en" ? "Switch to Spanish" : "Cambiar a Inglés"}
    >
      <Globe className="h-4 w-4" />
      <span>{language === "en" ? "Español" : "English"}</span>
    </button>
  )
}
