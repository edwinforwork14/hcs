"use client"

import { useLanguage } from "@/context/language-context"
import { whyHcsConfig } from "@/config/why-hcs.config"

export function WhyHCSSection() {
  const { t } = useLanguage()

  return (
    <section id="why-hcs" className="py-20 lg:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-lg lg:text-xl font-semibold tracking-widest uppercase bg-gradient-to-r from-[#B80324] via-[#D90429] to-[#FF4D6A] bg-clip-text text-transparent">
            {t("whyHcs.label")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0A0A0A] font-[family-name:var(--font-sora)]">
            {t("whyHcs.title")}
          </h2>
        </div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-2 items-start gap-6 md:grid-cols-3 lg:grid-cols-5 lg:gap-8">
          {whyHcsConfig.map((advantage, index) => (
            <div
              key={index}
              className={`group flex flex-col text-center ${
                index === whyHcsConfig.length - 1 ? "col-span-2 md:col-span-1 lg:col-span-1" : ""
              }`}
            >
              <div className="mx-auto mb-3 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#FF4D6A] via-[#D90429] to-[#800010] shadow-lg shadow-[#D90429]/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[#D90429]/50">
                <advantage.icon className="h-9 w-9 text-white drop-shadow-sm filter" strokeWidth={2} />
              </div>
              <div className="mb-1.5 flex min-h-[2.5rem] items-end justify-center px-1 sm:min-h-[2.75rem] lg:min-h-[3rem]">
                <h3 className="font-[family-name:var(--font-sora)] text-base font-bold leading-snug text-[#0A0A0A] lg:text-lg">
                  {t(advantage.titleKey)}
                </h3>
              </div>
              <p className="px-1 text-xs font-normal leading-relaxed text-gray-700 sm:text-sm lg:text-base">
                {t(advantage.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
