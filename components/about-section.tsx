"use client"

import { useState } from "react"
import { Building2, Globe, Users, ChevronDown } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function AboutSection() {
  const { t } = useLanguage()
  const [showStats, setShowStats] = useState(false)

  const stats = [
    {
      icon: Building2,
      value: "20+",
      label: t("about.yearsExp"),
    },
    {
      icon: Globe,
      value: "35+",
      label: t("about.countries"),
    },
    {
      icon: Users,
      value: "100+",
      label: t("about.partners"),
    },
  ]

  return (
    <section id="about" className="pt-12 pb-24 lg:pt-16 lg:pb-32 bg-[#FAF9F5]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Global Network Map Image */}
          <div className="relative flex justify-center lg:justify-end lg:pr-8 mb-10 lg:mb-0">
            <div className="relative w-full max-w-[580px]">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0248.JPG-HGQNLuqWBWLZEdjygo9VHMIjNkoXzO.jpeg"
                alt="Global network connections across the Americas"
                className="w-full aspect-square lg:aspect-[10/9] object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="flex flex-col">
            <span className="text-lg lg:text-xl font-semibold tracking-widest uppercase bg-gradient-to-r from-[#B80324] via-[#D90429] to-[#FF4D6A] bg-clip-text text-transparent">
              {t("about.label")}
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#1A1A1A] leading-[1.1] font-[family-name:var(--font-sora)] tracking-tight">
              {t("about.title")}
            </h2>
            <p className="mt-4 text-base lg:text-[16px] text-gray-500 leading-normal font-normal">
              {t("about.description")}
            </p>

            {/* Blockquote styling for mission and commitment */}
            <div className="mt-5 border-l-2 border-[#D90429] pl-5 py-1">
              <p 
                className="text-[14px] lg:text-[15px] text-[#2D2D2D] italic font-medium leading-snug"
                dangerouslySetInnerHTML={{ __html: t("about.mission") }}
              />
              <p 
                className="mt-2 text-[14px] lg:text-[15px] text-[#2D2D2D] italic font-medium leading-snug"
                dangerouslySetInnerHTML={{ __html: t("about.commitment") }}
              />
            </div>

            {/* Toggle Button */}
            <button
              onClick={() => setShowStats(!showStats)}
              className="mt-6 flex items-center gap-2 text-[#D90429] font-semibold text-sm cursor-pointer hover:opacity-80 transition-opacity group"
            >
              {showStats ? "Hide" : "View"} Key Facts
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showStats ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Collapsible Stats Cards */}
        <div 
          className={`grid grid-cols-3 gap-4 lg:gap-6 max-w-2xl mx-auto transition-all duration-500 ease-in-out overflow-hidden ${
            showStats ? 'mt-8 max-h-[300px] opacity-100' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-5 text-center shadow-[0_4px_20px_rgba(217,4,41,0.08)] border border-[#D90429]/10 hover:shadow-[0_8px_30px_rgba(217,4,41,0.15)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-10 h-10 mx-auto rounded-lg bg-gradient-to-br from-[#FF4D6A] via-[#D90429] to-[#800010] flex items-center justify-center mb-3 shadow-md shadow-[#D90429]/20">
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-[#B80324] via-[#D90429] to-[#FF4D6A] bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
