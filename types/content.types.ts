import { LucideIcon } from "lucide-react"

export interface Solution {
  id: string
  icon: LucideIcon
  titleKey: string
  descKey: string
  image: string
  href?: string
}

export interface Partner {
  id: string
  name: string
  brandColor: string
  logo: React.ReactNode
}

export interface Advantage {
  icon: LucideIcon
  titleKey: string
  descKey: string
}

export interface Stat {
  icon: LucideIcon
  value: string
  labelKey: string
}
