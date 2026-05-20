"use client"

import Link from "next/link"
import { Linkedin, Instagram, Mail, Phone, MessageCircle } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { siteConfig } from "@/config/site.config"

export function Footer() {
  const { t } = useLanguage()

  const quickLinks = [
    { labelKey: "nav.home", href: "#" },
    { labelKey: "nav.aboutUs", href: "#about" },
    { labelKey: "nav.solutions", href: "#solutions" },
    { labelKey: "nav.whyHcs", href: "#why-hcs" },
    { labelKey: "nav.partners", href: "#partners" },
    { labelKey: "nav.contact", href: "#contact" },
  ]

  const solutions = [
    { labelKey: "solutions.electronics", href: "#solutions" },
    { labelKey: "solutions.networking", href: "#solutions" },
    { labelKey: "solutions.security", href: "#solutions" },
    { labelKey: "solutions.globalSupply", href: "#solutions" },
  ]

  return (
    <footer className="bg-[#0A0A0A] pt-12 pb-6">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white font-[family-name:var(--font-sora)]">
                HC<span className="bg-gradient-to-b from-white from-50% to-[#D90429] to-50% bg-clip-text text-transparent inline-block">S</span>
              </span>
              <span className="text-[10px] tracking-widest text-gray-500 uppercase font-semibold">Trading</span>
            </Link>
            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a 
                href={siteConfig.social.linkedin.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D90429] transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a 
                href={siteConfig.social.instagram.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="group w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#D90429] transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.labelKey}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">{t("footer.solutions")}</h4>
            <ul className="space-y-2">
              {solutions.map((link) => (
                <li key={link.labelKey}>
                  <Link 
                    href={link.href} 
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">{t("footer.contactInfo")}</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="w-4 h-4 text-[#D90429] shrink-0" />
                <span>{siteConfig.email}</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4 text-[#D90429] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">{siteConfig.phones.usa.label}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <img 
                      src={siteConfig.phones.usa.flag} 
                      alt={`${siteConfig.phones.usa.label} Flag`} 
                      className="w-4 h-3 object-cover rounded-[1px] border border-white/10"
                    />
                    <span>{siteConfig.phones.usa.number}</span>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <MessageCircle className="w-4 h-4 text-[#D90429] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">{siteConfig.phones.venezuela.label}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <img 
                      src={siteConfig.phones.venezuela.flag} 
                      alt={`${siteConfig.phones.venezuela.label} Flag`} 
                      className="w-4 h-3 object-cover rounded-[1px] border border-white/10"
                    />
                    <span>{siteConfig.phones.venezuela.number}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs text-gray-400">
            © {siteConfig.copyrightYear} <span className="text-[#D90429] font-medium">{siteConfig.shortName}</span>. {t("footer.rights")}
          </p>
          
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <span>Powered with</span>
            <span className="text-purple-500 animate-pulse">💜</span>
            <span>by</span>
            <a 
              href="https://www.untitledtechcompany.io/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-purple-400 font-medium transition-all duration-200 hover:underline decoration-purple-500/40 underline-offset-4"
            >
              Untitled Tech Company
            </a>
          </p>

          <div className="flex items-center gap-6">
            <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-200">
              {t("footer.privacy")}
            </Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-white transition-colors duration-200">
              {t("footer.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
