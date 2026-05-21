"use client"

import { ArrowRight } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/context/language-context"
import { solutionsConfig } from "@/config/solutions.config"

export function SolutionsSection() {
  const { t } = useLanguage()
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const toggleCard = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }))
  }

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
          {solutionsConfig.map((solution) => {
            const isExpanded = expandedCards[solution.id] || false
            return (
              <div 
                key={solution.id}
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
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF4D6A] via-[#D90429] to-[#800010] flex items-center justify-center shadow-lg shadow-[#D90429]/30 border border-white/10">
                      <solution.icon className="w-6 h-6 text-white filter drop-shadow-sm" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-gradient-to-b from-white/5 to-transparent flex flex-col flex-grow">
                  <h3 className="text-xl lg:text-2xl font-semibold text-white mb-2 font-[family-name:var(--font-sora)] min-h-[3.5rem]">
                    {t(solution.titleKey)}
                  </h3>
                  <button
                    type="button"
                    onClick={() => toggleCard(solution.id)}
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? t("solutions.showLess") : t("solutions.showMore")}
                    className="w-full flex-grow text-left cursor-pointer transition-colors hover:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D90429]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] rounded-sm"
                  >
                    <p
                      className={`text-lg text-gray-200 leading-relaxed transition-all duration-300 ${
                        isExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {t(solution.descKey)}
                      {!isExpanded && (
                        <span className="ml-0.5 inline text-sm text-gray-400 align-baseline">
                          …
                        </span>
                      )}
                    </p>
                  </button>
                  <a 
                    href={solution.href} 
                    className="flex items-center text-[#D90429] text-base font-medium group-hover:gap-2 transition-all mt-auto pt-4"
                    aria-label={`Learn more about ${t(solution.titleKey)}`}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
