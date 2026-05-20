"use client"

import { ArrowRight, Globe, Users, Package, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
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
      icon: Users,
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
    <section className="relative min-h-screen bg-[#0A0A0A] overflow-hidden flex flex-col">
      {/* Background Image/Globe */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/hero-globe.jpg')`,
            backgroundPosition: 'center right',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 lg:pt-40 pb-12">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-extrabold text-white leading-[1.05] italic font-[family-name:var(--font-sora)]">
            {t("hero.title1")}<br />
            {t("hero.title2")}<br />
            {t("hero.title3")}
          </h1>
          
          {/* Red accent line */}
          <div className="w-20 h-1 bg-[#D90429] mt-8" />
          
          <p className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button className="bg-[#D90429] hover:bg-[#B80324] text-white rounded-md px-8 py-6 text-base font-semibold">
              {t("nav.contactUs")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 rounded-md px-8 py-6 text-base font-semibold bg-transparent"
            >
              {t("hero.exploreSolutions")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Spacer to push trust indicators toward bottom */}
      <div className="flex-1 min-h-[40px]" />

      {/* Trust Indicators - no background, sits on top of hero gradient */}
      <div className="relative z-10 w-full pb-8 lg:pb-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 justify-items-center">
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center gap-4 w-full max-w-[280px]">
                <div className="flex-shrink-0 w-14 h-14 rounded-full border border-[#D90429] flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-[#D90429]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <p className="text-base lg:text-lg font-semibold text-white leading-tight">{item.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Smooth fade-out transition to next section */}
      <div 
        className="relative h-32 lg:h-40 w-full z-10"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.4) 30%, rgba(120,120,120,0.3) 60%, rgba(220,220,220,0.6) 85%, #F8F8F8 100%)'
        }}
      />
    </section>
  )
}
