import { useState } from "react"
import { toast } from "sonner"
import { useLanguage } from "@/context/language-context"
import { apiPost } from "@/lib/api"
import { ContactFormPayload } from "@/types/api.types"

type FormStatus = "idle" | "loading"

export function useContactForm() {
  const { t } = useLanguage()
  const [formStatus, setFormStatus] = useState<FormStatus>("idle")
  const [formData, setFormData] = useState<ContactFormPayload>({
    fullName: "",
    email: "",
    company: "",
    phone: "",
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

    try {
      await apiPost("/api/contact", formData)

      setFormStatus("idle")
      setFormData({ fullName: "", email: "", company: "", phone: "", message: "" })
      
      toast.success(t("contact.toastSuccess") || "Message sent! We will get back to you soon.")
    } catch (error) {
      setFormStatus("idle")
      toast.error(
        t("contact.toastError") || 
        (error instanceof Error ? error.message : "Failed to send message. Please try again.")
      )
    }
  }

  return {
    formData,
    formStatus,
    handleInputChange,
    handleSubmit,
  }
}
