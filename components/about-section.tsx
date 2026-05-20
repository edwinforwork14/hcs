"use client"

import { Building2, Globe, Users } from "lucide-react"
import { useLanguage } from "@/context/language-context"

export function AboutSection() {
  const { t } = useLanguage()

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
    <section id="about" className="py-20 lg:py-28 bg-[#F8F8F8]">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left - Global Network Map Image with hover zoom */}
          <div className="relative group cursor-pointer">
            <div className="aspect-video lg:aspect-[4/3] relative rounded-lg overflow-hidden shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.03]">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_0248.JPG-HGQNLuqWBWLZEdjygo9VHMIjNkoXzO.jpeg"
                alt="Global network connections across the Americas"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Subtle overlay for better integration */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/20 to-transparent transition-opacity duration-500 group-hover:opacity-70" />
            </div>
          </div>

          {/* Right Content */}
          <div>
            <span className="text-lg lg:text-xl font-semibold tracking-widest uppercase bg-gradient-to-r from-[#B80324] via-[#D90429] to-[#FF4D6A] bg-clip-text text-transparent">
              {t("about.label")}
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0A0A0A] leading-tight font-[family-name:var(--font-sora)]">
              {t("about.title")}
            </h2>
            <p className="mt-6 text-lg lg:text-xl text-black leading-relaxed font-normal">
              {t("about.description")}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 lg:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-100 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <stat.icon className="h-8 w-8 mx-auto text-[#D90429] mb-3" />
              <p className="text-3xl lg:text-4xl font-extrabold text-[#D90429]">{stat.value}</p>
              <p className="text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
