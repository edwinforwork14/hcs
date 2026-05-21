"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { useLanguage } from "@/context/language-context"
import { partnersConfig } from "@/config/partners.config"
import { ChevronLeft, ChevronRight } from "lucide-react"

const AUTOPLAY_MS = 3500

export function PartnersSection() {
  const { t } = useLanguage()
  const isPausedRef = useRef(false)
  const [isPaused, setIsPaused] = useState(false)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    duration: 30,
    dragFree: false,
  })

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const interval = window.setInterval(() => {
      if (!isPausedRef.current) {
        emblaApi.scrollNext()
      }
    }, AUTOPLAY_MS)

    return () => window.clearInterval(interval)
  }, [emblaApi])

  const handlePause = () => {
    isPausedRef.current = true
    setIsPaused(true)
  }

  const handleResume = () => {
    isPausedRef.current = false
    setIsPaused(false)
  }

  return (
    <section id="partners" className="relative bg-[#F8F8F8] pb-8 pt-8 sm:pt-12 lg:pt-16">
      <div className="mx-auto mb-10 max-w-7xl px-6 text-center sm:px-8 lg:px-12">
        <span className="text-sm font-semibold uppercase tracking-widest bg-gradient-to-r from-[#B80324] via-[#D90429] to-[#FF4D6A] bg-clip-text text-transparent lg:text-base">
          {t("partners.label")}
        </span>
        <h2 className="mt-2 font-[family-name:var(--font-sora)] text-2xl font-semibold text-[#0A0A0A] sm:text-3xl lg:text-4xl">
          {t("partners.title")}
        </h2>
      </div>

      <div
        className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12"
        onMouseEnter={handlePause}
        onMouseLeave={handleResume}
        onFocus={handlePause}
        onBlur={handleResume}
      >
        <button
          type="button"
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 z-20 -translate-y-1/2 text-gray-400 hover:text-[#D90429] transition-colors duration-300"
          aria-label="Scroll partners left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          type="button"
          onClick={scrollNext}
          className="absolute right-0 top-1/2 z-20 -translate-y-1/2 text-gray-400 hover:text-[#D90429] transition-colors duration-300"
          aria-label="Scroll partners right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="relative">
          {/* Gradient overlays — siblings of emblaRef, NOT inside it */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F8F8F8] to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F8F8F8] to-transparent"
            aria-hidden="true"
          />
          <div className="overflow-hidden px-12 sm:px-14" ref={emblaRef}>
            <div className="flex touch-pan-x gap-8 py-4">
              {partnersConfig.map((partner) => (
                <div
                  key={partner.id}
                  className={`flex min-w-0 flex-[0_0_9.5rem] items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300 sm:flex-[0_0_10.5rem] ${partner.brandColor}`}
                >
                  {partner.logo}
                </div>
              ))}
            </div>
          </div>
        </div>



        <p className="sr-only">
          {isPaused
            ? "Carousel paused. Use arrows to browse partners."
            : "Carousel auto-advances. Hover to pause."}
        </p>
      </div>
    </section>
  )
}
