import { Monitor, Wifi, Shield, Boxes } from "lucide-react"
import { Solution } from "@/types/content.types"

export const solutionsConfig: Solution[] = [
  {
    id: "electronics",
    icon: Monitor,
    titleKey: "solutions.electronics",
    descKey: "solutions.electronicsDesc",
    image: "/images/electronics.jpg",
    href: "#solutions",
  },
  {
    id: "networking",
    icon: Wifi,
    titleKey: "solutions.networking",
    descKey: "solutions.networkingDesc",
    image: "/images/networking.jpg",
    href: "#solutions",
  },
  {
    id: "security",
    icon: Shield,
    titleKey: "solutions.security",
    descKey: "solutions.securityDesc",
    image: "/images/security.jpg",
    href: "#solutions",
  },
  {
    id: "global-supply",
    icon: Boxes,
    titleKey: "solutions.globalSupply",
    descKey: "solutions.globalSupplyDesc",
    image: "/images/global-supply.png",
    href: "#solutions",
  },
]
