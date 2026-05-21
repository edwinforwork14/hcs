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
    <section className="relative flex flex-col overflow-x-hidden bg-[#0A0A0A] min-h-[auto] sm:min-h-screen 2xl:min-h-0">
      {/* Background Image/Globe */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:bg-[65%_center]"
          style={{
            backgroundImage: `url('/images/hero-globe-new.jpeg')`,
          }}
        />
        {/* Full gradient: dark overlay for text legibility since it's centered */}
        <div className="absolute inset-0 bg-[#0A0A0A]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0A0A0A_100%)] opacity-40" />
        {/* Top: slight darkening */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-transparent" />
        {/* Bottom: full dark fade so trust indicators sit naturally on dark bg */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-transparent"
          style={{ top: "50%" }}
        />
      </div>

      {/* Compact content block: title, CTAs and trust indicators stay grouped */}
      <div className="relative z-10 flex flex-col justify-start">
        <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28 lg:px-12 lg:pb-10 lg:pt-32 2xl:pb-6 2xl:pt-28">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="font-[family-name:var(--font-sora)] text-3xl font-extrabold leading-[1.05] text-white sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
              {t("hero.title1")}
              <br />
              {t("hero.title2")}
              <br />
              {t("hero.title3")}
            </h1>

            {/* Red accent line */}
            <div className="mt-4 h-1 w-20 bg-[#D90429]" />

            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-300 sm:text-lg lg:max-w-lg xl:max-w-xl">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                asChild
                className="h-auto cursor-pointer rounded-lg bg-[#D90429] px-20 py-4 text-sm font-medium text-white transition-all hover:bg-[#B80324] sm:px-24 sm:text-base"
              >
                <Link href="#contact">
                  {t("nav.contactUs")}
                  <ArrowRight
                    className="ml-4 h-[18px] w-[18px] sm:ml-6 sm:h-5 sm:w-5"
                    strokeWidth={2}
                  />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-auto cursor-pointer rounded-lg border border-white/30 bg-transparent px-20 py-4 text-sm font-medium text-white transition-all hover:bg-white/10 sm:px-24 sm:text-base"
              >
                <Link href="#solutions">
                  {t("hero.exploreSolutions")}
                  <ArrowRight
                    className="ml-4 h-[18px] w-[18px] sm:ml-6 sm:h-5 sm:w-5"
                    strokeWidth={2}
                  />
                </Link>
              </Button>
            </div>
          </div>

          {/* Trust indicators – fixed gap below CTAs, not pushed to viewport bottom */}
          <div className="mt-10 sm:mt-12 2xl:mt-12">
            <div className="flex flex-wrap justify-start gap-x-8 gap-y-8 md:gap-x-12 lg:gap-x-16">
              {trustIndicators.map((item, index) => (
                <div key={index} className="flex w-[45%] items-center gap-4 sm:w-auto">
                  <div className="flex flex-shrink-0 items-center justify-center">
                    <item.icon className="h-10 w-10 text-[#D90429]" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col text-left">
                    <p
                      className="text-xs font-semibold leading-tight text-white sm:text-sm lg:text-base"
                      dangerouslySetInnerHTML={{ __html: item.title }}
                    />
                    <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-10 h-16 sm:h-24 lg:h-32"
        style={{
          background:
            "linear-gradient(to bottom, #0A0A0A 0%, #F8F8F8 100%)",
        }}
      />
    </section>
  )
}
