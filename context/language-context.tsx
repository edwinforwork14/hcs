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
    "hero.subtitle": "HCS Trading LLC specializes in electronics and global supply solutions, representing and distributing international brands across the Americas through reliable partnerships, strategic logistics, and industry expertise.",
    "hero.exploreSolutions": "Explore Solutions",
    "hero.panAmerican": "Pan-American<br/>Coverage",
    "hero.panAmericanSub": "35+ Countries",
    "hero.trustedBy": "Trusted by<br/>Global Brands",
    "hero.trustedBySub": "100+ Partners",
    "hero.reliable": "Reliable Distribution<br/>Network",
    "hero.reliableSub": "Fast & Efficient",
    "hero.experts": "Industry<br/>Experts",
    "hero.expertsSub": "20+ Years",

    // About
    "about.label": "ABOUT HCS",
    "about.title": "Your Strategic Supply Partner Across the Americas",
    "about.description": "Providing reliable electronics distribution and global supply solutions across the Americas. We connect international brands with expanding markets through strategic partnerships.",
    "about.mission": "<strong>Our Mission:</strong> To strengthen global business relationships through trust, efficiency, and dependable service.",
    "about.commitment": "<strong>Our Commitment:</strong> Delivering long-term value and innovative supply solutions that drive business growth.",
    "about.badgeTitle": "Empowering Global Trade",
    "about.badgeSubtitle": "HCS Trading LLC",
    "about.yearsExp": "Years of Industry Experience",
    "about.countries": "Pan-American Business Coverage",
    "about.partners": "Global Strategic Partnerships",

    // Partners
    "partners.label": "Our Partners",
    "partners.title": "Trusted by Industry Leaders",

    // Solutions
    "solutions.label": "Our Solutions",
    "solutions.title": "Industries We Support",
    "solutions.electronics": "Electronics",
    "solutions.electronicsDesc": "High-quality electronics from leading global brands.",
    "solutions.networking": "Networking Solutions",
    "solutions.networkingDesc": "Advanced networking infrastructure and connectivity solutions.",
    "solutions.security": "CCTV & Security Systems",
    "solutions.securityDesc": "Reliable security solutions to protect what matters most.",
    "solutions.globalSupply": "Global Supply Solutions",
    "solutions.globalSupplyDesc": "Strategic sourcing and distribution solutions that support business growth and operational efficiency across international markets.",

    // Why HCS
    "whyHcs.label": "Why Choose HCS",
    "whyHcs.title": "The HCS Advantage",
    "whyHcs.panAmerican": "International Reach",
    "whyHcs.panAmericanDesc": "Strong business presence and operational capabilities throughout the Americas.",
    "whyHcs.reliable": "Reliable Distribution",
    "whyHcs.reliableDesc": "Efficient logistics and dependable supply chain solutions tailored to business needs.",
    "whyHcs.trusted": "Trusted Partnerships",
    "whyHcs.trustedDesc": "Long-term relationships built on professionalism, reliability, and business growth.",
    "whyHcs.expertise": "Industry Experience",
    "whyHcs.expertiseDesc": "Deep understanding of electronics, networking, and international supply operations.",
    "whyHcs.businessFocused": "Business-Focused Solutions",
    "whyHcs.businessFocusedDesc": "Strategic solutions designed to create efficiency, scalability, and long-term value.",

    // Social
    "social.label": "Connect With Us",
    "social.title1": "Let's Build Stronger",
    "social.title2": "Business Connections",
    "social.instagramFollow": "Follow us for company updates and industry insights.",
    "social.linkedinConnect": "Connect with our professional network and business community.",

    // Contact
    "contact.label": "Contact Us",
    "contact.title1": "Let’s Connect Your Business",
    "contact.title2": "to Global Opportunities",
    "contact.subtitle": "Whether you are looking for reliable supply solutions, strategic partnerships, or business opportunities across the Americas, our team is ready to assist you.",
    "contact.fullName": "Full Name",
    "contact.company": "Company",
    "contact.email": "Email Address",
    "contact.phone": "Phone Number",
    "contact.message": "Your Message",
    "contact.send": "Send Message",
    "contact.toastSuccess": "Message sent! We will get back to you soon.",
    "contact.toastError": "Failed to send message. Please try again.",

    // Footer
    "footer.tagline": "Connecting global brands with opportunities across the Americas.",
    "footer.quickLinks": "Quick Links",
    "footer.solutions": "Solutions",
    "footer.contactInfo": "Contact Info",
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms & Conditions",
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
    "hero.subtitle": "HCS Trading LLC se especializa en electrónica y soluciones de suministro global, representando y distribuyendo marcas internacionales en las Américas a través de alianzas confiables, logística estratégica y experiencia en la industria.",
    "hero.exploreSolutions": "Explorar Soluciones",
    "hero.panAmerican": "Cobertura<br/>Panamericana",
    "hero.panAmericanSub": "35+ Países",
    "hero.trustedBy": "Confianza de<br/>Marcas Globales",
    "hero.trustedBySub": "100+ Socios",
    "hero.reliable": "Red de Distribución<br/>Confiable",
    "hero.reliableSub": "Rápido y Eficiente",
    "hero.experts": "Expertos en<br/>la Industria",
    "hero.expertsSub": "20+ Años",

    // About
    "about.label": "SOBRE HCS",
    "about.title": "Su Socio de Suministro Estratégico en las Américas",
    "about.description": "Proveemos soluciones confiables de distribución de electrónica y suministro global en toda América, conectando marcas internacionales con mercados en expansión.",
    "about.mission": "<strong>Nuestra Misión:</strong> Fortalecer las relaciones comerciales globales a través de la confianza, eficiencia y un servicio confiable.",
    "about.commitment": "<strong>Nuestro Compromiso:</strong> Entregar valor a largo plazo y soluciones innovadoras de suministro que impulsen el crecimiento comercial.",
    "about.badgeTitle": "Potenciando el Comercio Global",
    "about.badgeSubtitle": "HCS Trading LLC",
    "about.yearsExp": "Años de Experiencia en la Industria",
    "about.countries": "Cobertura Comercial Panamericana",
    "about.partners": "Alianzas Estratégicas Globales",

    // Partners
    "partners.label": "Nuestros Socios",
    "partners.title": "Confianza de Líderes de la Industria",

    // Solutions
    "solutions.label": "Nuestras Soluciones",
    "solutions.title": "Industrias que Soportamos",
    "solutions.electronics": "Electrónica",
    "solutions.electronicsDesc": "Electrónica de alta calidad de las principales marcas globales.",
    "solutions.networking": "Soluciones de Redes",
    "solutions.networkingDesc": "Infraestructura de redes avanzada y soluciones de conectividad.",
    "solutions.security": "CCTV y Sistemas de Seguridad",
    "solutions.securityDesc": "Soluciones de seguridad confiables para proteger lo que más importa.",
    "solutions.globalSupply": "Soluciones de Suministro Global",
    "solutions.globalSupplyDesc": "Soluciones estratégicas de abastecimiento y distribución que respaldan el crecimiento comercial y la eficiencia operativa en los mercados internacionales.",

    // Why HCS
    "whyHcs.label": "Por Qué Elegir HCS",
    "whyHcs.title": "La Ventaja HCS",
    "whyHcs.panAmerican": "Alcance Internacional",
    "whyHcs.panAmericanDesc": "Sólida presencia comercial y capacidades operativas en toda América.",
    "whyHcs.reliable": "Distribución Confiable",
    "whyHcs.reliableDesc": "Logística eficiente y soluciones de cadena de suministro confiables adaptadas a las necesidades comerciales.",
    "whyHcs.trusted": "Alianzas de Confianza",
    "whyHcs.trustedDesc": "Relaciones a largo plazo basadas en el profesionalismo, la confiabilidad y el crecimiento comercial.",
    "whyHcs.expertise": "Experiencia en la Industria",
    "whyHcs.expertiseDesc": "Profundo entendimiento de la electrónica, las redes y las operaciones de suministro internacional.",
    "whyHcs.businessFocused": "Soluciones Enfocadas en el Negocio",
    "whyHcs.businessFocusedDesc": "Soluciones estratégicas diseñadas para generar eficiencia, escalabilidad y valor a largo plazo.",

    // Social
    "social.label": "Conéctese Con Nosotros",
    "social.title1": "Construyamos Conexiones",
    "social.title2": "Comerciales Más Fuertes",
    "social.instagramFollow": "Síganos para actualizaciones de la empresa e información de la industria.",
    "social.linkedinConnect": "Conéctese con nuestra red profesional y comunidad empresarial.",

    // Contact
    "contact.label": "Contáctenos",
    "contact.title1": "Conectemos su Negocio",
    "contact.title2": "con Oportunidades Globales",
    "contact.subtitle": "Ya sea que busque soluciones de suministro confiables, alianzas estratégicas u oportunidades comerciales en las Américas, nuestro equipo está listo para ayudarle.",
    "contact.fullName": "Nombre Completo",
    "contact.company": "Empresa",
    "contact.email": "Correo Electrónico",
    "contact.phone": "Número de Teléfono",
    "contact.message": "Su Mensaje",
    "contact.send": "Enviar Mensaje",
    "contact.toastSuccess": "¡Mensaje enviado! Nos pondremos en contacto pronto.",
    "contact.toastError": "Error al enviar el mensaje. Por favor intente de nuevo.",

    // Footer
    "footer.tagline": "Conectando marcas globales con oportunidades en las Américas.",
    "footer.quickLinks": "Enlaces Rápidos",
    "footer.solutions": "Soluciones",
    "footer.contactInfo": "Información de Contacto",
    "footer.rights": "Todos los derechos reservados.",
    "footer.privacy": "Política de Privacidad",
    "footer.terms": "Términos y Condiciones",
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
