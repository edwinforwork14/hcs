"use client"

import { useState } from "react"
import { Mail, Phone, ArrowRight, MessageCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/context/language-context"

type FormStatus = "idle" | "loading" | "success" | "error"

export function ContactSection() {
  const { t } = useLanguage()
  const [formStatus, setFormStatus] = useState<FormStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    message: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message")
      }

      setFormStatus("success")
      setFormData({ fullName: "", email: "", company: "", message: "" })
      
      // Reset to idle after 5 seconds
      setTimeout(() => setFormStatus("idle"), 5000)
    } catch (error) {
      setFormStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong")
      
      // Reset to idle after 5 seconds
      setTimeout(() => setFormStatus("idle"), 5000)
    }
  }

  return (
    <section id="contact" className="py-16 lg:py-20 bg-[#F8F8F8] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Left - Contact Info Card */}
          <div className="bg-[#0A0A0A] rounded-2xl p-8 lg:p-10 border border-white/10 shadow-xl flex flex-col">
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
                <span className="text-base text-gray-300">info@hcstradingllc.org</span>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">USA</span>
                  <span className="text-base text-gray-300">+1 832 650 6647</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <MessageCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">WhatsApp</span>
                  <span className="text-base text-gray-300">+58 412 300 0970</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Contact Form Card */}
          <div className="bg-[#0A0A0A] rounded-2xl p-8 lg:p-10 border border-white/10 shadow-xl flex flex-col">
            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
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
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder={t("contact.message")}
                required
                disabled={formStatus === "loading"}
                rows={4}
                className="w-full flex-1 min-h-[100px] px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white placeholder:text-gray-500 text-base resize-none focus:outline-none focus:ring-2 focus:ring-[#D90429]/20 focus:border-[#D90429]/50 disabled:opacity-50"
              />
              
              {/* Status Messages */}
              {formStatus === "success" && (
                <div className="flex items-center gap-2 text-green-400 bg-green-400/10 px-4 py-3 rounded-lg">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Message sent successfully! We will get back to you soon.</span>
                </div>
              )}
              
              {formStatus === "error" && (
                <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-4 py-3 rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{errorMessage || "Failed to send message. Please try again."}</span>
                </div>
              )}

              <Button 
                type="submit"
                disabled={formStatus === "loading"}
                className="w-full bg-gradient-to-r from-[#D90429] to-[#FF4D6A] hover:from-[#B80324] hover:to-[#D90429] text-white rounded-lg px-8 py-3 h-12 text-base font-semibold transition-all duration-300 mt-auto disabled:opacity-70 disabled:cursor-not-allowed"
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
