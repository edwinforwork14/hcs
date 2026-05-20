"use client"

import { useLanguage } from "@/context/language-context"
import { partnersConfig } from "@/config/partners.config"

export function PartnersSection() {
  const { t } = useLanguage()

  // Duplicate the array to create a seamless infinite loop
  const doublePartners = [...partnersConfig, ...partnersConfig]

  return (
    <section id="partners" className="pt-16 pb-8 bg-[#F8F8F8] overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mb-10 text-center">
        <span className="text-sm lg:text-base font-semibold tracking-widest uppercase bg-gradient-to-r from-[#B80324] via-[#D90429] to-[#FF4D6A] bg-clip-text text-transparent">
          {t("partners.label")}
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A0A0A] font-[family-name:var(--font-sora)]">
          {t("partners.title")}
        </h2>
      </div>

      {/* Infinite Scroll Carousel */}
      <div className="relative w-full overflow-hidden flex items-center py-4">
        {/* Shadow Overlays for depth */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F8F8F8] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F8F8F8] to-transparent z-10 pointer-events-none" />

        {/* Scrolling flex row */}
        <div className="flex w-[200%] animate-infinite-scroll hover:[animation-play-state:paused] transition-all">
          {/* Render the double array */}
          {doublePartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className={`w-[140px] sm:w-[180px] flex-shrink-0 flex items-center justify-center px-3 text-gray-400 transition-all duration-300 group cursor-pointer ${partner.brandColor}`}
            >
              {partner.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
