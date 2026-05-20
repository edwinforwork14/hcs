"use client"

import { Monitor, Wifi, Shield, Boxes, ArrowRight } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function SolutionsSection() {
  const { t } = useLanguage()

  const solutions = [
    {
      icon: Monitor,
      titleKey: "solutions.electronics",
      descKey: "solutions.electronicsDesc",
      image: "/images/electronics.jpg",
    },
    {
      icon: Wifi,
      titleKey: "solutions.networking",
      descKey: "solutions.networkingDesc",
      image: "/images/networking.jpg",
    },
    {
      icon: Shield,
      titleKey: "solutions.security",
      descKey: "solutions.securityDesc",
      image: "/images/security.jpg",
    },
    {
      icon: Boxes,
      titleKey: "solutions.globalSupply",
      descKey: "solutions.globalSupplyDesc",
      image: "/images/global-supply.png",
    },
  ]

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-[#0A0A0A]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-lg lg:text-xl font-semibold tracking-widest uppercase bg-gradient-to-r from-[#B80324] via-[#D90429] to-[#FF4D6A] bg-clip-text text-transparent">
            {t("solutions.label")}
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white font-[family-name:var(--font-sora)]">
            {t("solutions.title")}
          </h2>
        </div>

        {/* Solutions Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => (
            <div 
              key={index}
              className="group relative bg-white/5 backdrop-blur-xl rounded-xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_48px_rgba(217,4,41,0.15)] hover:-translate-y-1 flex flex-col h-full"
            >
              {/* Image */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={solution.image}
                  alt={t(solution.titleKey)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Icon Badge */}
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 rounded-lg bg-[#D90429] flex items-center justify-center shadow-lg shadow-[#D90429]/30">
                    <solution.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-gradient-to-b from-white/5 to-transparent flex flex-col flex-grow">
                <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2 font-[family-name:var(--font-sora)]">
                  {t(solution.titleKey)}
                </h3>
                <p className="text-lg text-gray-200 mb-4 leading-relaxed">
                  {t(solution.descKey)}
                </p>
                <button className="flex items-center text-[#D90429] text-base font-medium group-hover:gap-2 transition-all mt-auto pt-4">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
