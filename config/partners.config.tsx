import React from "react"
import { Partner } from "@/types/content.types"

export const partnersConfig: Partner[] = [
  {
    id: "benq",
    name: "BenQ",
    brandColor: "hover:scale-105",
    logo: (
      <svg viewBox="0 0 140 60" className="h-12 w-auto transition-all duration-300" role="img" aria-label="BenQ">
        <path 
          d="M 12,30 C 12,16 32,8 70,8 C 108,8 128,18 128,32 C 128,46 104,52 65,52 C 30,52 12,44 12,30 Z" 
          className="fill-gray-300 transition-colors duration-300 group-hover:fill-[#562873]" 
        />
        <text x="70" y="38" textAnchor="middle" fill="white" className="text-[22px] font-sans font-black tracking-tighter">BenQ</text>
      </svg>
    )
  },
  {
    id: "d-link",
    name: "D-Link",
    brandColor: "hover:scale-105",
    logo: (
      <svg viewBox="0 0 140 50" className="h-12 w-auto transition-all duration-300" role="img" aria-label="D-Link">
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
    id: "brinno",
    name: "Brinno",
    brandColor: "hover:scale-105",
    logo: (
      <svg viewBox="0 0 140 50" className="h-12 w-auto transition-all duration-300" role="img" aria-label="Brinno">
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
    id: "ezviz",
    name: "EZVIZ",
    brandColor: "hover:scale-105",
    logo: (
      <svg viewBox="0 0 145 50" className="h-12 w-auto transition-all duration-300" role="img" aria-label="EZVIZ">
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
    id: "gusto",
    name: "Gusto",
    brandColor: "hover:scale-105",
    logo: (
      <svg viewBox="0 0 140 50" className="h-12 w-auto transition-all duration-300" role="img" aria-label="Gusto">
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
    id: "hikvision",
    name: "Hikvision",
    brandColor: "hover:scale-105",
    logo: (
      <svg viewBox="0 0 160 50" className="h-12 w-auto transition-all duration-300" role="img" aria-label="Hikvision">
        <text x="10" y="32" className="text-[24px] font-sans font-black italic tracking-normal fill-gray-300 transition-colors duration-300 group-hover:fill-[#D90429]">HIK</text>
        <text x="56" y="32" className="text-[24px] font-sans font-bold italic tracking-normal fill-gray-300 transition-colors duration-300 group-hover:fill-[#4A4A4A]">VISION</text>
        <text x="10" y="44" className="text-[6px] font-sans font-semibold tracking-tighter fill-gray-300 transition-colors duration-300 group-hover:fill-gray-500">First Choice for Security Professionals</text>
      </svg>
    )
  },
  {
    id: "intelbras",
    name: "Intelbras",
    brandColor: "hover:scale-105",
    logo: (
      <svg viewBox="0 0 140 50" className="h-12 w-auto transition-all duration-300" role="img" aria-label="Intelbras">
        <text x="70" y="34" textAnchor="middle" className="text-[28px] font-sans font-bold tracking-tight fill-gray-300 transition-colors duration-300 group-hover:fill-[#00A859]">intelbras</text>
      </svg>
    )
  },
  {
    id: "lanpro",
    name: "Lanpro",
    brandColor: "hover:scale-105",
    logo: (
      <svg viewBox="0 0 160 50" className="h-12 w-auto transition-all duration-300" role="img" aria-label="Lanpro">
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
    id: "tenda",
    name: "Tenda",
    brandColor: "hover:scale-105",
    logo: (
      <svg viewBox="0 0 140 50" className="h-12 w-auto transition-all duration-300" role="img" aria-label="Tenda">
        <text x="70" y="35" textAnchor="middle" className="text-[34px] font-sans font-black tracking-tighter italic fill-gray-300 transition-colors duration-300 group-hover:fill-[#FF5000]">Tenda</text>
      </svg>
    )
  }
]
