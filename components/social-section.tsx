"use client"

import { Instagram, Linkedin, ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function SocialSection() {
  const { t } = useLanguage()

  return (
    <section className="py-10 lg:py-12 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {/* Left - Heading */}
          <div className="flex flex-col justify-center md:col-span-2 lg:col-span-1 mb-4 md:mb-2 lg:mb-0">
            <span className="text-sm lg:text-base font-semibold tracking-widest uppercase bg-gradient-to-r from-[#B80324] via-[#D90429] to-[#FF4D6A] bg-clip-text text-transparent">
              {t("social.label")}
            </span>
            <h2 className="mt-2 lg:mt-3 text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight font-[family-name:var(--font-sora)]">
              {t("social.title1")}<br className="hidden lg:inline" /> {t("social.title2")}
            </h2>
          </div>

          {/* Instagram Card - Glassmorphism */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl px-5 py-4 lg:px-6 lg:py-5 flex items-center gap-3 lg:gap-4 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(217,4,41,0.1)] hover:-translate-y-0.5">
            <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#F77737] flex items-center justify-center shadow-lg shadow-[#E1306C]/20 transition-all">
              <Instagram className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base lg:text-lg font-semibold text-white">Instagram</h3>
              <p className="text-xs lg:text-sm text-gray-300">@hcs_trading</p>
              <p className="text-xs lg:text-sm text-gray-400 mt-0.5 leading-relaxed">{t("social.instagramFollow")}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#D90429] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>

          {/* LinkedIn Card - Glassmorphism */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl px-5 py-4 lg:px-6 lg:py-5 flex items-center gap-3 lg:gap-4 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(217,4,41,0.1)] hover:-translate-y-0.5">
            <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-lg bg-[#0A66C2] flex items-center justify-center shadow-lg shadow-[#0A66C2]/20 transition-all">
              <Linkedin className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base lg:text-lg font-semibold text-white">LinkedIn</h3>
              <p className="text-xs lg:text-sm text-gray-300">HCS Trading</p>
              <p className="text-xs lg:text-sm text-gray-400 mt-0.5 leading-relaxed">{t("social.linkedinConnect")}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-[#D90429] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>
        </div>
      </div>
    </section>
  )
}
