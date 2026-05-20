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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-5 gap-6 lg:gap-8">
          {advantages.map((advantage, index) => {
            // Precise column layout to center items beautifully when they don't fill a full row
            let columnClass = "col-span-1 md:col-span-2 lg:col-span-1"
            if (index === 3) {
              // 4th item starts at column 2 on tablet to center the bottom row of 2 items
              columnClass = "col-span-1 md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto"
            } else if (index === 4) {
              // 5th item spans 2 columns on mobile to center itself in the last row
              columnClass = "col-span-2 md:col-span-2 lg:col-span-1"
            }

            return (
              <div 
                key={index}
                className={`text-center ${columnClass}`}
              >
                <div className="w-16 h-16 mx-auto rounded-lg bg-[#FEE2E2] flex items-center justify-center mb-4">
                  <advantage.icon className="w-8 h-8 text-[#D90429]" />
                </div>
                <h3 className="text-xl lg:text-2xl font-semibold text-[#0A0A0A] mb-2">
                  {t(advantage.titleKey)}
                </h3>
                <p className="text-lg lg:text-xl text-black leading-relaxed font-normal">
                  {t(advantage.descKey)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
