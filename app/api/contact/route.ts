import { NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  fullName: z.string().min(2, "Name is too short").max(100),
  email: z.string().email("Invalid email address"),
  company: z.string().max(100).optional(),
  phone: z.string().max(30).optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const result = contactSchema.safeParse(body)
    
    if (!result.success) {
      console.error("Validation error:", JSON.stringify(result.error.format(), null, 2))
      const firstError = result.error.errors[0]
      return NextResponse.json(
        { error: firstError?.message || "Invalid form data" },
        { status: 400 }
      )
    }

    const { fullName, email, company, phone, message } = result.data

    // Check if API key is available
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured")
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      )
    }

    // Use environment variable for recipient
    const recipientEmail = process.env.CONTACT_RECIPIENT_EMAIL

    if (!recipientEmail) {
      console.error("CONTACT_RECIPIENT_EMAIL is not configured")
      return NextResponse.json(
        { error: "Recipient not configured" },
        { status: 500 }
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "HCS Contact Form <noreply@contact.hcstrading.org>",
      to: [recipientEmail],
      replyTo: email,
      subject: `New Contact from ${fullName} - HCS trading`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #D90429;">New Contact Form Submission</h2>
          <hr style="border: 1px solid #eee;" />
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "Not provided"}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <hr style="border: 1px solid #eee;" />
          <h3>Message:</h3>
          <p style="background: #f5f5f5; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          <hr style="border: 1px solid #eee;" />
          <p style="color: #666; font-size: 12px;">This email was sent from the HCS trading website contact form.</p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, messageId: data?.id },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
