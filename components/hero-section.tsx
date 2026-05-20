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
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-globe-new.jpeg')`,
            backgroundPosition: 'center',
          }}
        />
        {/* Full gradient: dark overlay for text legibility since it's centered */}
        <div className="absolute inset-0 bg-[#0A0A0A]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0A_100%)] opacity-40" />
        {/* Top: slight darkening */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-transparent" />
        {/* Bottom: full dark fade so trust indicators sit naturally on dark bg */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent" style={{ top: '50%' }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 pt-24 sm:pt-28 lg:pt-36 pb-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-[1.05] font-[family-name:var(--font-sora)]">
            {t("hero.title1")}<br />
            {t("hero.title2")}<br />
            {t("hero.title3")}
          </h1>
          
          {/* Red accent line */}
          <div className="w-20 h-1 bg-[#D90429] mt-4" />
          
          <p className="mt-4 text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="bg-[#D90429] hover:bg-[#B80324] text-white rounded-lg px-20 sm:px-24 py-4 h-auto text-sm sm:text-base font-medium cursor-pointer transition-all">
              <Link href="#contact">
                {t("nav.contactUs")}
                <ArrowRight className="ml-4 sm:ml-6 h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2} />
              </Link>
            </Button>
            <Button 
              asChild
              variant="outline" 
              className="border border-white/30 text-white hover:bg-white/10 rounded-lg px-20 sm:px-24 py-4 h-auto text-sm sm:text-base font-medium bg-transparent cursor-pointer transition-all"
            >
              <Link href="#solutions">
                {t("hero.exploreSolutions")}
                <ArrowRight className="ml-4 sm:ml-6 h-[18px] w-[18px] sm:h-5 sm:w-5" strokeWidth={2} />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer to push trust indicators toward bottom */}
      <div className="flex-1 min-h-[20px]" />

      {/* Trust Indicators – float over hero's naturally darkened bottom */}
      <div className="relative z-10 w-full pt-4 pb-10 lg:pt-6 lg:pb-14">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-wrap justify-start gap-y-8 gap-x-8 md:gap-x-12 lg:gap-x-16">
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center gap-4 w-[45%] sm:w-auto">
                <div className="flex-shrink-0 flex items-center justify-center">
                  <item.icon className="h-10 w-10 text-[#D90429]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col text-left">
                  <p 
                    className="text-xs sm:text-sm lg:text-base font-semibold text-white leading-tight"
                    dangerouslySetInnerHTML={{ __html: item.title }}
                  />
                  <p className="text-[11px] sm:text-xs text-gray-400 mt-1">{item.subtitle}</p>
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
