"use client"

import { Mail, Phone, ArrowRight, MessageCircle, Loader2, MapPin, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/context/language-context"
import { useContactForm } from "@/hooks/use-contact-form"
import { siteConfig } from "@/config/site.config"

export function ContactSection() {
  const { t, language } = useLanguage()
  const { formData, formStatus, handleInputChange, handleSubmit } = useContactForm()

  return (
    <section id="contact" className="py-16 lg:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left - Contact Info Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 lg:p-10 border border-white/20 shadow-xl flex flex-col">
            <span className="text-base lg:text-lg font-semibold tracking-widest uppercase bg-gradient-to-r from-[#B80324] via-[#D90429] to-[#FF4D6A] bg-clip-text text-transparent">
              {t("contact.label")}
            </span>
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight font-[family-name:var(--font-sora)]">
              {t("contact.title1")}<br />{t("contact.title2")}
            </h2>
            <p className="mt-4 text-lg text-gray-200 leading-relaxed">
              {t("contact.subtitle")}
            </p>

            <div className="mt-auto pt-8 space-y-4">
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-base text-gray-300">{siteConfig.email}</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">{siteConfig.phones.usa.label}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <img 
                      src={siteConfig.phones.usa.flag} 
                      alt={`${siteConfig.phones.usa.label} Flag`} 
                      className="w-5 h-3.5 object-cover rounded-[2px] border border-white/10 shadow-sm"
                    />
                    <span className="text-base text-gray-300">{siteConfig.phones.usa.number}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MessageCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">{siteConfig.phones.venezuela.label}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <img 
                      src={siteConfig.phones.venezuela.flag} 
                      alt={`${siteConfig.phones.venezuela.label} Flag`} 
                      className="w-5 h-3.5 object-cover rounded-[2px] border border-white/10 shadow-sm"
                    />
                    <span className="text-base text-gray-300">{siteConfig.phones.venezuela.number}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">{language === "en" ? "Location" : "Ubicación"}</span>
                  <span className="text-base text-gray-300">{siteConfig.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">{language === "en" ? "Website" : "Sitio Web"}</span>
                  <a href={`https://${siteConfig.website}`} target="_blank" rel="noopener noreferrer" className="text-base text-gray-300 hover:text-white transition-colors">{siteConfig.website}</a>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Contact Form Card */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 lg:p-10 border border-white/20 shadow-xl flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col h-full flex-grow">
              <Input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={t("contact.fullName")}
                required
                disabled={formStatus === "loading"}
                className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 h-12 text-base rounded-lg focus:border-[#D90429]/50 focus:ring-[#D90429]/20 disabled:opacity-50"
              />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder={t("contact.email")}
                required
                disabled={formStatus === "loading"}
                className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 h-12 text-base rounded-lg focus:border-[#D90429]/50 focus:ring-[#D90429]/20 disabled:opacity-50"
              />
              <Input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder={t("contact.company")}
                disabled={formStatus === "loading"}
                className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 h-12 text-base rounded-lg focus:border-[#D90429]/50 focus:ring-[#D90429]/20 disabled:opacity-50"
              />
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder={t("contact.phone")}
                disabled={formStatus === "loading"}
                className="bg-white/10 border-white/10 text-white placeholder:text-gray-500 h-12 text-base rounded-lg focus:border-[#D90429]/50 focus:ring-[#D90429]/20 disabled:opacity-50"
              />
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t("contact.message")}
                required
                disabled={formStatus === "loading"}
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder:text-gray-500 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#D90429]/20 focus:border-[#D90429]/50 disabled:opacity-50 min-h-[120px] flex-grow"
              />

              <Button 
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full bg-gradient-to-r from-[#D90429] to-[#FF4D6A] hover:from-[#B80324] hover:to-[#D90429] hover:scale-[1.02] active:scale-[0.98] text-white rounded-lg px-8 py-3 h-12 text-base font-semibold transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {formStatus === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    {t("contact.send")}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
