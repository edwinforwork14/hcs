"use client"

import { ArrowRight, Globe, Handshake, Package, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/context/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  const trustIndicators = [
    {
      icon: Globe,
      title: t("hero.panAmerican"),
      subtitle: t("hero.panAmericanSub"),
    },
    {
      icon: Handshake,
      title: t("hero.trustedBy"),
      subtitle: t("hero.trustedBySub"),
    },
    {
      icon: Package,
      title: t("hero.reliable"),
      subtitle: t("hero.reliableSub"),
    },
    {
      icon: UserCheck,
      title: t("hero.experts"),
      subtitle: t("hero.expertsSub"),
    },
  ]

  return (
    <section className="relative bg-[#0A0A0A] overflow-x-hidden flex flex-col" style={{ minHeight: '100svh' }}>
      {/* Background Image/Globe */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-globe.jpg')`,
            backgroundPosition: 'center right',
          }}
        />
        {/* Left gradient: dark overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/80 to-[#0A0A0A]/20" />
        {/* Top: slight darkening */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-transparent to-transparent" />
        {/* Bottom: full dark fade so trust indicators sit naturally on dark bg */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent" style={{ top: '50%' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 pt-20 sm:pt-24 lg:pt-28 pb-4">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-[4.5rem] font-extrabold text-white leading-[1.05] font-[family-name:var(--font-sora)]">
            {t("hero.title1")}<br />
            {t("hero.title2")}<br />
            {t("hero.title3")}
          </h1>
          
          {/* Red accent line */}
          <div className="w-20 h-1 bg-[#D90429] mt-4" />
          
          <p className="mt-3 text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild className="bg-[#D90429] hover:bg-[#B80324] text-white rounded-md px-6 py-4 text-sm sm:text-base font-semibold cursor-pointer">
              <Link href="#contact">
                {t("nav.contactUs")}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border-white/40 text-white hover:bg-white/10 rounded-md px-6 py-4 text-sm sm:text-base font-semibold bg-transparent cursor-pointer"
            >
              <Link href="#solutions">
                {t("hero.exploreSolutions")}
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer to push trust indicators toward bottom */}
      <div className="flex-1 min-h-[20px]" />

      {/* Trust Indicators – float over hero's naturally darkened bottom */}
      <div className="relative z-10 w-full py-6 lg:py-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-6 lg:gap-x-8 justify-items-start">
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center gap-3 w-full max-w-[280px]">
                <div className="flex-shrink-0 w-11 h-11 rounded-full border border-[#D90429] flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-[#D90429]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs sm:text-sm lg:text-base font-semibold text-white leading-tight">{item.title}</p>
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smooth transition strip: fully opaque dark → white */}
      <div 
        className="relative z-10 w-full h-20 lg:h-24"
        style={{
          background: 'linear-gradient(to bottom, #0A0A0A 0%, rgba(10,10,10,0.9) 25%, rgba(30,30,30,0.5) 55%, rgba(220,220,220,0.5) 80%, #F8F8F8 100%)'
        }}
      />
    </section>
  )
}
