# 🌐 HCS Trading - Landing Page

[![Next.js](https://img.shields.io/badge/Next.js-15%2B-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

A modern, highly polished, premium multi-lingual landing page for **HCS Trading**, built with **Next.js 15+ (App Router)**, **React 19**, and the latest **Tailwind CSS v4**.

HCS Trading is a leading global supply and electronics distribution partner operating across the Americas. This landing page acts as their digital storefront, showcasing their pan-American coverage, industrial expertise, core business solutions, and enabling streamlined lead acquisition.

---

## 🌟 Key Features

- **🌐 Multilingual by Design**: Full internationalization support (English and Spanish) managed dynamically via React Context (`LanguageProvider`).
- **🎨 Premium & Rich Aesthetics**:
  - Implementation of curated color palettes (harmonious HSL colors, vivid red accents representing the brand, dark/light contrast support).
  - Micro-animations, responsive layout adjustments, and smooth hover effects powered by Tailwind CSS v4 and `tw-animate-css`.
- **🛠️ Responsive Navigation & Fluid Layouts**: Fully responsive navigation menu (`Header`) with language toggle options.
- **📊 Interactive Key Facts**: Collapsible statistics section showing HCS's global impact (20+ years of experience, 35+ countries, 100+ global partners).
- **💼 Solutions Overview**: Dynamic showcase of supported industries, including:
  - **Electronics**: Sourcing high-quality electronics from leading brands.
  - **Networking Solutions**: Advanced infrastructure and connectivity.
  - **CCTV & Security Systems**: High-reliability protection systems.
  - **Global Supply Solutions**: Strategic international sourcing and distribution.
- **✉️ Dynamic Lead Generation Form**: A fully integrated contact form powered by **Resend** for professional email dispatching, validated on both the client and server side using **Zod** and **React Hook Form**.

---

## 🚀 Tech Stack & Libraries

- **Framework**: [Next.js 15+ (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/postcss` for lightning-fast compilation) and custom CSS modules.
- **Animations**: [tw-animate-css](https://github.com/) & custom transitions.
- **UI Components**: [Radix UI Primitives](https://www.radix-ui.com/) (Accordion, Dialog, Select, Dropdown Menu, etc.) for high accessibility (WAI-ARIA).
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Email Service**: [Resend](https://resend.com/) API client for transaction emails.
- **Analytics**: [@vercel/analytics](https://vercel.com/analytics) for tracking page views and performance metrics.

---

## 📁 Project Structure

```text
HCS/
├── app/                  # Next.js App Router (pages and API routes)
│   ├── api/
│   │   └── contact/      # API endpoint for processing contact forms
│   │       └── route.ts  # Zod schema validation & Resend email trigger
│   ├── globals.css       # Core Tailwind CSS v4 directives and globals
│   ├── layout.tsx        # Base HTML layout wrapping LanguageProvider
│   └── page.tsx          # Main entry page assembling sections
├── components/           # Reusable UI component blocks
│   ├── ui/               # Lower-level design components (buttons, inputs, etc.)
│   ├── about-section.tsx # About section with key facts toggle
│   ├── contact-section.x # Lead capture contact form
│   ├── solutions-section # Dynamic grid showcasing company verticals
│   ├── hero-section.tsx  # Landing hero section
│   └── header.tsx / footer.tsx # Layout navigation elements
├── context/              # Context providers
│   └── language-context.tsx  # Dynamic i18n translation context (EN/ES)
├── lib/                  # Helper utilities (Tailwind merges, custom clients)
├── public/               # Static assets (images, logos, icons)
├── tsconfig.json         # TypeScript compiler configurations
├── package.json          # Dependency tree and npm scripts
└── vercel.json           # Vercel deployment directives
```

---

## ⚙️ Environment Setup

To run this application locally, you will need to set up your environment variables. Create a `.env.local` file in the root directory:

```bash
# Resend API Key for sending emails
RESEND_API_KEY=re_your_api_key_here

# Recipient Email for contact form submissions
CONTACT_RECIPIENT_EMAIL=your-recipient-email@domain.com

# Supabase (Auth + Database)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Server-only, never commit
```

---

## 🔐 Supabase Auth Configuration (Chat Widget Login/Register/Reset Password)

The customer chat widget includes a full authentication flow (login, register, forgot password, reset password). Configure Supabase as follows:

### 1. Authentication → Sign In / Providers → Email

| Setting | Value |
|---------|-------|
| Enable email provider | ✅ **ON** |
| Secure email change | ❌ **OFF** |
| Secure password change | ❌ **OFF** |
| Require current password when updating | ❌ **OFF** |
| Prevent use of leaked passwords | ❌ **OFF** (Pro only) |
| Minimum password length | `6` |
| Password requirements | `No required characters` |
| Email OTP expiration | `3600` |
| Email OTP length | `8` |

> Click **Save**

### 2. Authentication → URL Configuration

| Field | Value |
|-------|-------|
| Site URL | `http://localhost:3000` (dev) / `https://tu-dominio.com` (prod) |
| Additional Redirect URLs | `http://localhost:3000/auth/reset-password`<br>`http://localhost:3000/**` |

> Click **Save**

### 3. Authentication → Emails (SMTP Settings)

| Setting | Value |
|---------|-------|
| Use custom SMTP | ❌ **OFF** (uses Supabase free SMTP — ~3 emails/hour limit) |

> For production: enable **Use custom SMTP = ON** and configure SendGrid/Resend/Postmark.

### 4. Authentication → Configuration (if visible)

| Setting | Value |
|---------|-------|
| Enable email confirmations | ❌ **OFF** |

---

### Auth Flow Reference

**Files involved:**
- `hooks/use-auth.ts` — `login`, `register`, `forgotPassword`, `resetPassword`, `logout`
- `lib/supabase/client.ts` — Browser client (`createBrowserClient`)
- `lib/supabase/server.ts` — Server client (`@supabase/ssr` with cookies)
- `app/auth/forgot-password/page.tsx` — Request reset email
- `app/auth/reset-password/page.tsx` — Set new password (verifies token via `getUser()`)
- `components/customer-chat/chat-start-form.tsx` — Login/Register tabs in chat widget
- `lib/validations/auth.ts` — Zod schemas

**Test locally:**
```bash
npm run dev
# 1. http://localhost:3000 → Open chat → "¿Olvidaste tu contraseña?"
# 2. Enter email → Submit → Check spam
# 3. Click link → http://localhost:3000/auth/reset-password
# 4. Set new password → Login → ✅
```

### Production Deploy Checklist

- [ ] Site URL = `https://tu-dominio.com`
- [ ] Redirect URLs = `https://tu-dominio.com/auth/reset-password`, `https://tu-dominio.com/**`
- [ ] **Emails → Use custom SMTP = ON** (configure SendGrid/Resend/Postmark)
- [ ] Add env vars to Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Verify domain in SMTP provider
- [ ] Auth → Rate Limits → adjust if needed

---

## 🛠️ Development & Commands

Ensure you have [Node.js](https://nodejs.org/) installed on your machine. You can use `npm` or `pnpm` (which contains lockfiles in the repository).

### 1. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 2. Run the Development Server
```bash
npm run dev
# or
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

### 3. Build for Production
```bash
npm run build
# or
pnpm build
```

### 4. Code Quality & Linter
```bash
npm run lint
# or
pnpm lint
```

---

## 🌐 Deployment on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your project to a GitHub repository.
2. Import the repository into your Vercel Dashboard.
3. Configure the environment variables (`RESEND_API_KEY` and `CONTACT_RECIPIENT_EMAIL`) in the Vercel Project Settings.
4. Click **Deploy**. Vercel will automatically build the site and spin up the Serverless Functions for your API route.

---

## 📄 License

This project is private and intended solely for the operations of **HCS Trading**. All rights reserved.
