"use client"

import { useLanguage } from "@/context/language-context"

export function PartnersSection() {
  const { t } = useLanguage()

  // High-fidelity SVG components for each brand logo
  const partners = [
    {
      name: "BenQ",
      hoverColor: "hover:scale-105",
      svg: (
        <svg viewBox="0 0 140 60" className="h-12 w-auto transition-all duration-300">
          <path 
            d="M 12,30 C 12,16 32,8 70,8 C 108,8 128,18 128,32 C 128,46 104,52 65,52 C 30,52 12,44 12,30 Z" 
            className="fill-gray-300 transition-colors duration-300 group-hover:fill-[#562873]" 
          />
          <text x="70" y="38" textAnchor="middle" fill="white" className="text-[22px] font-sans font-black tracking-tighter">BenQ</text>
        </svg>
      )
    },
    {
      name: "D-Link",
      hoverColor: "hover:scale-105",
      svg: (
        <svg viewBox="0 0 140 50" className="h-12 w-auto transition-all duration-300">
          <text 
            x="70" 
            y="36" 
            textAnchor="middle" 
            className="text-[30px] font-sans font-black tracking-tight fill-gray-300 transition-colors duration-300 group-hover:fill-[#0072C6]"
          >
            D-Link
          </text>
        </svg>
      )
    },
    {
      name: "Brinno",
      hoverColor: "hover:scale-105",
      svg: (
        <svg viewBox="0 0 140 50" className="h-12 w-auto transition-all duration-300">
          <text 
            x="10" 
            y="36" 
            className="text-[28px] font-sans font-bold tracking-tight fill-gray-300 transition-colors duration-300 group-hover:fill-black"
          >
            brınno
          </text>
          <path 
            d="M 34,15 C 32,10 35,5 37.5,2 C 40.5,6 38.5,11 36,15 Z" 
            className="fill-gray-300 transition-colors duration-300 group-hover:fill-[#FF8200]" 
          />
        </svg>
      )
    },
    {
      name: "EZVIZ",
      hoverColor: "hover:scale-105",
      svg: (
        <svg viewBox="0 0 145 50" className="h-12 w-auto transition-all duration-300">
          <g transform="translate(25, 25)">
            {/* Blue petal (top-left) */}
            <path d="M-3,-3 C-10,-12 -18,-5 -11,2 C-7,5 -3,1 -3,-3 Z" className="fill-gray-300 transition-colors duration-300 group-hover:fill-[#00A4E4]" />
            {/* Green petal (top-right) */}
            <path d="M-3,-3 C-10,-12 -18,-5 -11,2 C-7,5 -3,1 -3,-3 Z" className="fill-gray-300 transition-colors duration-300 group-hover:fill-[#8EC63F]" transform="rotate(90)" />
            {/* Yellow/Orange petal (bottom-right) */}
            <path d="M-3,-3 C-10,-12 -18,-5 -11,2 C-7,5 -3,1 -3,-3 Z" className="fill-gray-300 transition-colors duration-300 group-hover:fill-[#FFB600]" transform="rotate(180)" />
            {/* Pink petal (bottom-left) */}
            <path d="M-3,-3 C-10,-12 -18,-5 -11,2 C-7,5 -3,1 -3,-3 Z" className="fill-gray-300 transition-colors duration-300 group-hover:fill-[#E6007E]" transform="rotate(270)" />
          </g>
          <text 
            x="52" 
            y="32" 
            className="text-[22px] font-sans font-black tracking-wider fill-gray-300 transition-colors duration-300 group-hover:fill-[#575756]"
          >
            EZVIZ
          </text>
        </svg>
      )
    },
    {
      name: "Gusto",
      hoverColor: "hover:scale-105",
      svg: (
        <svg viewBox="0 0 140 50" className="h-12 w-auto transition-all duration-300">
          <text 
            x="70" 
            y="28" 
            textAnchor="middle" 
            className="text-[26px] font-sans font-black tracking-normal italic fill-gray-300 transition-colors duration-300 group-hover:fill-[#FFD200]"
          >
            GUSTO
          </text>
          <text 
            x="70" 
            y="42" 
            textAnchor="middle" 
            className="text-[8px] font-sans font-bold tracking-wider fill-gray-400 transition-colors duration-300 group-hover:fill-gray-600 uppercase"
          >
            Dare to be different
          </text>
        </svg>
      )
    },
    {
      name: "Hikvision",
      hoverColor: "hover:scale-105",
      svg: (
        <svg viewBox="0 0 160 50" className="h-12 w-auto transition-all duration-300">
          <text x="10" y="32" className="text-[24px] font-sans font-black italic tracking-normal fill-gray-300 transition-colors duration-300 group-hover:fill-[#D90429]">HIK</text>
          <text x="56" y="32" className="text-[24px] font-sans font-bold italic tracking-normal fill-gray-300 transition-colors duration-300 group-hover:fill-[#4A4A4A]">VISION</text>
          <text x="10" y="44" className="text-[6px] font-sans font-semibold tracking-tighter fill-gray-300 transition-colors duration-300 group-hover:fill-gray-500">First Choice for Security Professionals</text>
        </svg>
      )
    },
    {
      name: "Intelbras",
      hoverColor: "hover:scale-105",
      svg: (
        <svg viewBox="0 0 140 50" className="h-12 w-auto transition-all duration-300">
          <text x="70" y="34" textAnchor="middle" className="text-[28px] font-sans font-bold tracking-tight fill-gray-300 transition-colors duration-300 group-hover:fill-[#00A859]">intelbras</text>
        </svg>
      )
    },
    {
      name: "Lanpro",
      hoverColor: "hover:scale-105",
      svg: (
        <svg viewBox="0 0 160 50" className="h-12 w-auto transition-all duration-300">
          <g className="fill-gray-300 transition-colors duration-300 group-hover:fill-[#002F6C]">
            <path d="M 10,16 L 28,16 L 24,22 L 8,22 Z" />
            <path d="M 12,24 L 30,24 L 26,30 L 10,30 Z" />
            <path d="M 14,32 L 32,32 L 28,38 L 12,38 Z" />
          </g>
          <text x="36" y="31" className="text-[24px] font-sans font-black tracking-normal fill-gray-300 transition-colors duration-300 group-hover:fill-[#002F6C]">LANPRO</text>
          <text x="36" y="42" className="text-[7px] font-sans font-bold tracking-widest fill-gray-300 transition-colors duration-300 group-hover:fill-gray-500 uppercase">Connect-and-Forget</text>
        </svg>
      )
    },
    {
      name: "Tenda",
      hoverColor: "hover:scale-105",
      svg: (
        <svg viewBox="0 0 140 50" className="h-12 w-auto transition-all duration-300">
          <text x="70" y="35" textAnchor="middle" className="text-[34px] font-sans font-black tracking-tighter italic fill-gray-300 transition-colors duration-300 group-hover:fill-[#FF5000]">Tenda</text>
        </svg>
      )
    }
  ]

  // Duplicate the array to create a seamless infinite loop
  const doublePartners = [...partners, ...partners]

  return (
    <section id="partners" className="py-16 bg-[#F8F8F8] overflow-hidden relative">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 mb-10 text-center">
        <span className="text-sm lg:text-base font-semibold tracking-widest uppercase bg-gradient-to-r from-[#B80324] via-[#D90429] to-[#FF4D6A] bg-clip-text text-transparent">
          {t("partners.label")}
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold text-[#0A0A0A] font-[family-name:var(--font-sora)]">
          {t("partners.title")}
        </h2>
      </div>

      {/* Infinite Scroll Carousel */}
      <div className="relative w-full overflow-hidden flex items-center py-4">
        {/* Shadow Overlays for depth */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F8F8F8] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F8F8F8] to-transparent z-10 pointer-events-none" />

        {/* Scrolling flex row */}
        <div className="flex w-[200%] animate-infinite-scroll hover:[animation-play-state:paused] transition-all">
          {/* Render the double array */}
          {doublePartners.map((partner, index) => (
            <div
              key={index}
              className={`w-[140px] sm:w-[180px] flex-shrink-0 flex items-center justify-center px-3 text-gray-400 transition-all duration-300 group cursor-pointer ${partner.hoverColor}`}
            >
              {partner.svg}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
