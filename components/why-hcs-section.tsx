"use client"

import { Globe, Truck, Handshake, Lightbulb, Target } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function WhyHCSSection() {
  const { t } = useLanguage()

  const advantages = [
    {
      icon: Globe,
      titleKey: "whyHcs.panAmerican",
      descKey: "whyHcs.panAmericanDesc",
    },
    {
      icon: Truck,
      titleKey: "whyHcs.reliable",
      descKey: "whyHcs.reliableDesc",
    },
    {
      icon: Handshake,
      titleKey: "whyHcs.trusted",
      descKey: "whyHcs.trustedDesc",
    },
    {
      icon: Lightbulb,
      titleKey: "whyHcs.expertise",
      descKey: "whyHcs.expertiseDesc",
    },
    {
      icon: Target,
      titleKey: "whyHcs.businessFocused",
      descKey: "whyHcs.businessFocusedDesc",
    },
  ]

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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8">
          {advantages.map((advantage, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#FF4D6A] via-[#D90429] to-[#800010] flex items-center justify-center mb-4 shadow-lg shadow-[#D90429]/30 border border-white/10 group-hover:scale-110 group-hover:shadow-[#D90429]/50 transition-all duration-300">
                <advantage.icon className="w-7 h-7 text-white filter drop-shadow-sm" strokeWidth={2} />
              </div>
              <h3 className="text-base lg:text-lg font-bold text-[#0A0A0A] mb-2 font-[family-name:var(--font-sora)]">
                {t(advantage.titleKey)}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed font-normal px-1">
                {t(advantage.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
