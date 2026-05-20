"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Language = "en" | "es"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Header
    "nav.home": "Home",
    "nav.aboutUs": "About Us",
    "nav.solutions": "Solutions",
    "nav.whyHcs": "Why HCS",
    "nav.partners": "Partners",
    "nav.contact": "Contact",
    "nav.contactUs": "Contact Us",

    // Hero
    "hero.title1": "Connecting",
    "hero.title2": "Global Brands",
    "hero.title3": "Across the Americas",
    "hero.subtitle": "Strategic representation and distribution solutions in electronics, networking, security systems, and sports products.",
    "hero.exploreSolutions": "Explore Solutions",
    "hero.panAmerican": "Pan-American Coverage",
    "hero.panAmericanSub": "35+ Countries",
    "hero.trustedBy": "Trusted by Global Brands",
    "hero.trustedBySub": "100+ Partners",
    "hero.reliable": "Reliable Distribution Network",
    "hero.reliableSub": "Fast & Efficient",
    "hero.experts": "Industry Experts",
    "hero.expertsSub": "20+ Years",

    // About
    "about.label": "About HCS",
    "about.title": "Your Strategic Partner Across the Americas",
    "about.description": "HCS is a leading representative and distributor of world-class brands in electronics, networking, CCTV & security systems, and sports products. We connect innovative brands with businesses across the Americas through reliable logistics, market expertise, and strong relationships.",
    "about.yearsExp": "Years of Experience",
    "about.countries": "Countries Served",
    "about.partners": "Global Partners",

    // Solutions
    "solutions.label": "Our Solutions",
    "solutions.title": "Industries We Power",
    "solutions.electronics": "Electronics",
    "solutions.electronicsDesc": "High-quality electronics from leading global brands.",
    "solutions.networking": "Networking Solutions",
    "solutions.networkingDesc": "Advanced networking infrastructure and connectivity solutions.",
    "solutions.security": "CCTV & Security Systems",
    "solutions.securityDesc": "Reliable security solutions to protect what matters most.",
    "solutions.sports": "Sports Products",
    "solutions.sportsDesc": "Performance-driven sports products for every challenge.",

    // Why HCS
    "whyHcs.label": "Why Choose HCS",
    "whyHcs.title": "The HCS Advantage",
    "whyHcs.panAmerican": "Pan-American Presence",
    "whyHcs.panAmericanDesc": "Strong presence across the Americas with deep market understanding.",
    "whyHcs.reliable": "Reliable Distribution",
    "whyHcs.reliableDesc": "Efficient logistics and inventory management you can count on.",
    "whyHcs.trusted": "Trusted Partnerships",
    "whyHcs.trustedDesc": "Long-term relationships with world-class brands and clients.",
    "whyHcs.expertise": "Industry Expertise",
    "whyHcs.expertiseDesc": "Deep knowledge in technology and sports industry segments.",
    "whyHcs.businessFocused": "Business-Focused",
    "whyHcs.businessFocusedDesc": "Deep knowledge to drive growth and business success.",

    // Social
    "social.label": "Connect With Us",
    "social.title1": "Let's Connect",
    "social.title2": "and Grow Together",
    "social.instagramFollow": "Follow us for updates and insights",
    "social.linkedinConnect": "Connect with us on LinkedIn",

    // Contact
    "contact.label": "Contact Us",
    "contact.title1": "Let's Build Stronger",
    "contact.title2": "Business Connections",
    "contact.subtitle": "Have a question or want to partner with us? We're ready to help.",
    "contact.fullName": "Full Name",
    "contact.company": "Company",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.message": "Your Message",
    "contact.send": "Send Message",

    // Footer
    "footer.tagline": "Connecting global brands with opportunities across the Americas.",
    "footer.quickLinks": "Quick Links",
    "footer.solutions": "Solutions",
    "footer.contactInfo": "Contact Info",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Use",
  },
  es: {
    // Header
    "nav.home": "Inicio",
    "nav.aboutUs": "Nosotros",
    "nav.solutions": "Soluciones",
    "nav.whyHcs": "Por qué HCS",
    "nav.partners": "Socios",
    "nav.contact": "Contacto",
    "nav.contactUs": "Contáctenos",

    // Hero
    "hero.title1": "Conectando",
    "hero.title2": "Marcas Globales",
    "hero.title3": "En las Américas",
    "hero.subtitle": "Soluciones estratégicas de representación y distribución en electrónica, redes, sistemas de seguridad y productos deportivos.",
    "hero.exploreSolutions": "Explorar Soluciones",
    "hero.panAmerican": "Cobertura Panamericana",
    "hero.panAmericanSub": "35+ Países",
    "hero.trustedBy": "Confianza de Marcas Globales",
    "hero.trustedBySub": "100+ Socios",
    "hero.reliable": "Red de Distribución Confiable",
    "hero.reliableSub": "Rápido y Eficiente",
    "hero.experts": "Expertos en la Industria",
    "hero.expertsSub": "20+ Años",

    // About
    "about.label": "Sobre HCS",
    "about.title": "Su Socio Estratégico en las Américas",
    "about.description": "HCS es un representante y distribuidor líder de marcas de clase mundial en electrónica, redes, sistemas de CCTV y seguridad, y productos deportivos. Conectamos marcas innovadoras con negocios en las Américas a través de logística confiable, experiencia en el mercado y relaciones sólidas.",
    "about.yearsExp": "Años de Experiencia",
    "about.countries": "Países Atendidos",
    "about.partners": "Socios Globales",

    // Solutions
    "solutions.label": "Nuestras Soluciones",
    "solutions.title": "Industrias que Impulsamos",
    "solutions.electronics": "Electrónica",
    "solutions.electronicsDesc": "Electrónica de alta calidad de las principales marcas globales.",
    "solutions.networking": "Soluciones de Redes",
    "solutions.networkingDesc": "Infraestructura de redes avanzada y soluciones de conectividad.",
    "solutions.security": "CCTV y Sistemas de Seguridad",
    "solutions.securityDesc": "Soluciones de seguridad confiables para proteger lo que más importa.",
    "solutions.sports": "Productos Deportivos",
    "solutions.sportsDesc": "Productos deportivos de alto rendimiento para cada desafío.",

    // Why HCS
    "whyHcs.label": "Por Qué Elegir HCS",
    "whyHcs.title": "La Ventaja HCS",
    "whyHcs.panAmerican": "Presencia Panamericana",
    "whyHcs.panAmericanDesc": "Fuerte presencia en las Américas con profundo conocimiento del mercado.",
    "whyHcs.reliable": "Distribución Confiable",
    "whyHcs.reliableDesc": "Logística eficiente y gestión de inventario en la que puede confiar.",
    "whyHcs.trusted": "Alianzas de Confianza",
    "whyHcs.trustedDesc": "Relaciones a largo plazo con marcas y clientes de clase mundial.",
    "whyHcs.expertise": "Experiencia en la Industria",
    "whyHcs.expertiseDesc": "Profundo conocimiento en segmentos de tecnología y deportes.",
    "whyHcs.businessFocused": "Enfocados en el Negocio",
    "whyHcs.businessFocusedDesc": "Conocimiento profundo para impulsar el crecimiento y el éxito empresarial.",

    // Social
    "social.label": "Conéctese Con Nosotros",
    "social.title1": "Conectemos",
    "social.title2": "y Crezcamos Juntos",
    "social.instagramFollow": "Síganos para actualizaciones e información",
    "social.linkedinConnect": "Conéctese con nosotros en LinkedIn",

    // Contact
    "contact.label": "Contáctenos",
    "contact.title1": "Construyamos Conexiones",
    "contact.title2": "Comerciales Más Fuertes",
    "contact.subtitle": "¿Tiene una pregunta o desea asociarse con nosotros? Estamos listos para ayudar.",
    "contact.fullName": "Nombre Completo",
    "contact.company": "Empresa",
    "contact.email": "Correo Electrónico",
    "contact.phone": "Número de Teléfono",
    "contact.message": "Su Mensaje",
    "contact.send": "Enviar Mensaje",

    // Footer
    "footer.tagline": "Conectando marcas globales con oportunidades en las Américas.",
    "footer.quickLinks": "Enlaces Rápidos",
    "footer.solutions": "Soluciones",
    "footer.contactInfo": "Información de Contacto",
    "footer.rights": "Todos los derechos reservados.",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos de Uso",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
