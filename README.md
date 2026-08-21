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
- **💬 Customer Service Chat Widget**: Full live-chat system with Supabase Realtime, customer auth, admin dashboard, and file attachments.

---

## 💬 Customer Service Chat — Guía Completa

El sistema de servicio al cliente es un **componente modular y reutilizable** que funciona con Supabase (Auth + Database + Realtime + Storage). Incluye widget del cliente, dashboard de admin, y API routes.

### Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   LADO DEL CLIENTE                   │
│                                                      │
│  app/layout.tsx                                      │
│    └─ <LanguageProvider>   (idioma EN/ES)            │
│    └─ <ClientChatWidget>    (dynamic, ssr: false)     │
│         └─ ChatWidget                                 │
│              ├─ ChatButton   (botón flotante)         │
│              └─ ChatWindow                            │
│                   ├─ ChatHeader                       │
│                   ├─ CustomerAuthForm (login/signup)  │
│                   ├─ MessageList   (realtime)         │
│                   └─ MessageInput  (texto + adjuntos) │
└─────────────────────────────────────────────────────┘
          │                              │
          ▼                              ▼
   ┌──────────────┐              ┌───────────────┐
   │  hooks/       │              │  app/api/chat/ │
   │  use-chat.ts  │              │  start/        │
   │  use-customer │              │  message/      │
   │  -auth.ts     │              │  upload/       │
   │  use-realtime │              │  delete/       │
   │  use-support  │              │  datechange/   │
   │  -presence.ts │              │  attachment-url│
   └──────────────┘              └───────────────┘
          │                              │
          ▼                              ▼
   ┌──────────────────────────────────────────────┐
   │              Supabase                         │
   │  Auth │ Database │ Realtime │ Storage        │
   └──────────────────────────────────────────────┘
          ▲
          │
┌─────────┴────────────────────────────────────────────┐
│                  LADO DEL ADMIN                        │
│                                                        │
│  app/admin/support/page.tsx  (Server Component)        │
│    └─ getAdminAuth()  → verifica sesión + tabla admins │
│    └─ <AdminSupport>                                   │
│         ├─ useConversations()  (estado del dashboard)  │
│         ├─ useAdminPresence()  (marca admin online)     │
│         ├─ ConversationsSidebar (lista + filtros)       │
│         ├─ ConversationView    (mensajes + input)       │
│         └─ CustomerPanel       (info del cliente)       │
│                                                        │
│  app/admin/datechange/page.tsx                         │
│    └─ <DateChanger>  (simulador de fechas)              │
└────────────────────────────────────────────────────────┘
```

### Estructura de Archivos

```
app/
├── api/chat/                      # 6 API routes directos (sin re-exports)
│   ├── start/route.ts             # Crear conversación + mensaje de bienvenida
│   ├── message/route.ts           # Enviar mensaje (cliente/admin)
│   ├── upload/route.ts            # Signed URL para adjuntos
│   ├── attachment-url/route.ts    # URL de descarga de adjuntos
│   ├── delete/route.ts            # Eliminar conversación (admin)
│   └── datechange/route.ts        # Simular fechas (admin)
├── admin/
│   ├── support/page.tsx           # Dashboard del admin
│   └── datechange/page.tsx        # Simulador de fechas
└── layout.tsx                     # Root layout con ChatWidget

components/
├── customer-chat/                # Widget del cliente (9 archivos)
│   ├── client-chat-widget.tsx     # Wrapper Client Component (dynamic ssr:false)
│   ├── chat-widget.tsx            # Entry point del widget
│   ├── chat-button.tsx            # Botón flotante
│   ├── chat-window.tsx            # Ventana del chat
│   ├── chat-header.tsx            # Header (status, idioma, logout)
│   ├── customer-auth-form.tsx     # Login/registro del cliente
│   ├── message-list.tsx           # Lista de mensajes
│   ├── message-input.tsx          # Input + adjuntos
│   └── message-bubble.tsx         # Bubble de mensaje
├── admin-chat/                    # Dashboard del admin (11 archivos)
│   ├── admin-support.tsx          # Entry point del dashboard
│   ├── conversations-sidebar.tsx # Lista de conversaciones
│   ├── conversation-view.tsx      # Vista de mensajes
│   ├── customer-panel.tsx         # Info del cliente
│   ├── date-changer.tsx           # Simulador de fechas
│   ├── auth-screens.tsx           # Pantallas de auth
│   ├── login-form.tsx             # Form de login admin
│   ├── sign-out-button.tsx        # Botón logout
│   ├── message-list.tsx           # Lista de mensajes
│   ├── message-input.tsx          # Input admin
│   └── message-bubble.tsx         # Bubble de mensaje
├── chat/                          # Componentes compartidos
│   ├── date-divider.tsx           # Divider de fecha
│   └── read-icon.tsx              # Icono de leído
└── ui/                            # shadcn/ui components

hooks/                             # Hooks del chat
├── use-chat.ts                    # Estado del chat (cliente)
├── use-customer-auth.ts           # Auth del cliente
├── use-conversations.ts           # Estado del dashboard (admin)
├── use-support-presence.ts        # Presencia online (cliente + admin)
├── use-realtime.ts                # Supabase realtime
└── use-auth.ts                    # Auth general

context/
└── language-context.tsx           # Provider de idioma (EN/ES)

lib/
├── supabase/
│   ├── client.ts                   # 3 clientes browser (admin, anon, customer)
│   └── server.ts                   # Clientes server (cookie, service role)
├── admin-auth.ts                   # Verificación de admin
├── api.ts                          # Helper fetch API
├── attachments.ts                  # Validación de archivos
├── time.ts                          # Formato de fechas
└── validations/chat.ts             # Schemas Zod

types/
└── chat.ts                         # Tipos del dominio

dev.mjs                             # Launcher dev (fix Windows casing)
next.config.mjs                     # Config Next.js
```

### Flujo Completo

#### 1. Cliente abre el chat

1. `ClientChatWidget` carga en el cliente (`ssr: false` evita bug de hidratación en Windows)
2. `ChatWidget` verifica `isSupabaseConfigured`
3. `useSupportOnline()` subscribe al canal de presencia → muestra punto verde (admin online) o rojo (offline)
4. Usuario hace click en `ChatButton` → `setOpen(true)` → abre `ChatWindow`

#### 2. Autenticación del cliente

1. `useCustomerAuth()` verifica si hay sesión activa (storage key: `sb-customer-auth`)
2. Si no hay sesión → muestra `CustomerAuthForm`
3. Usuario puede Sign In o Sign Up
4. `signUp()` crea cuenta en Supabase Auth con `user_metadata: { full_name, phone }`
5. Si email confirmation está activado → pantalla "check your email"

#### 3. Inicio de conversación

1. `useChat().startConversation()` busca conversación OPEN existente por email
2. Si existe → reutiliza (evita duplicados)
3. Si no existe → `POST /api/chat/start`
   - Valida con Zod
   - Verifica conversación existente (anti-duplicados)
   - Crea conversación en Supabase
   - Inserta mensaje de bienvenida automático
4. Guarda sesión en `localStorage` (key: `hcs-chat-session`)

#### 4. Envío de mensajes

**Cliente → Admin:**
1. `MessageInput` → `useChat().sendMessage(content)`
2. Insert directo a Supabase via `getAnonClient()` (RLS protege)
3. Supabase Realtime → `useRealtime('messages')` en admin → `MessageList` actualiza

**Admin → Cliente:**
1. `MessageInput` (admin) → `POST /api/chat/message` con `senderType: 'admin'`
2. API route verifica admin autenticado en tabla `admins`
3. Insert a Supabase
4. Realtime → `useRealtime('messages')` en cliente → `MessageList` actualiza

#### 5. Envío de adjuntos

1. `MessageInput` → `useChat().sendAttachment(file, content)`
2. `POST /api/chat/upload` → obtiene signed upload URL
3. `PUT` directo a Supabase Storage (bucket: `chat-attachments`)
4. `POST /api/chat/message` → crea mensaje con metadata del adjunto (JSON en content)

#### 6. Presencia (online/offline)

- **Admin**: `useAdminPresence(email)` → track en canal `support-presence`
- **Cliente**: `useSupportOnline()` → subscribe al canal → si hay admins → online

### Seguridad

| Capa | Mecanismo |
|------|-----------|
| Cliente → Supabase | RLS policies (anon role) |
| Admin auth | `getAdminAuth()` verifica sesión + tabla `admins` |
| Admin mensajes | API route verifica admin autenticado |
| Upload | Signed URLs (no público), path limitado a `conversations/{id}/` |
| Validación | Zod schemas en todos los endpoints |
| Service role | Solo server-side, nunca llega al cliente |
| Sesiones aisladas | 3 storage keys: admin, anon (`sb-anon-no-persist`), customer (`sb-customer-auth`) |

### Variables de Entorno

```bash
# Supabase (obligatorio para el chat)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # Server-only

# Resend (formularios de contacto)
RESEND_API_KEY=re_your_api_key_here
CONTACT_RECIPIENT_EMAIL=your-recipient-email@domain.com
```

---

## 📦 Cómo Reutilizar el Chat en Otro Proyecto

El sistema de servicio al cliente es **modular y autocontenido**. No depende de rutas hardcoded ni de configuración específica de Windows.

### Paso 1: Copiar archivos

Copia estas carpetas al proyecto destino:

```bash
# API routes
cp -r app/api/chat/          /destino/app/api/chat/

# Páginas admin
cp -r app/admin/             /destino/app/admin/

# Componentes
cp -r components/customer-chat/  /destino/components/customer-chat/
cp -r components/admin-chat/     /destino/components/admin-chat/
cp -r components/chat/            /destino/components/chat/

# Hooks
cp hooks/use-chat.ts           /destino/hooks/
cp hooks/use-customer-auth.ts  /destino/hooks/
cp hooks/use-conversations.ts  /destino/hooks/
cp hooks/use-support-presence.ts /destino/hooks/
cp hooks/use-realtime.ts       /destino/hooks/
cp hooks/use-auth.ts           /destino/hooks/

# Context
cp context/language-context.tsx /destino/context/

# Lib
cp lib/supabase/client.ts     /destino/lib/supabase/
cp lib/supabase/server.ts     /destino/lib/supabase/
cp lib/admin-auth.ts          /destino/lib/
cp lib/api.ts                 /destino/lib/
cp lib/attachments.ts         /destino/lib/
cp lib/time.ts                /destino/lib/
cp lib/validations/chat.ts    /destino/lib/validations/

# Types
cp types/chat.ts              /destino/types/
```

### Paso 2: Instalar dependencias

```bash
npm install @supabase/ssr @supabase/supabase-js zod react-hook-form @hookform/resolvers sonner lucide-react
```

### Paso 3: Configurar Supabase

1. Crear proyecto en [Supabase](https://supabase.com)
2. Crear las tablas:

```sql
-- Tabla de conversaciones
create table conversations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_location text,
  customer_language text default 'en',
  status text default 'open',
  admin_last_read_at timestamptz default now(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tabla de mensajes
create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('customer', 'admin')),
  content text not null default '',
  created_at timestamptz default now()
);

-- Tabla de admins
create table admins (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz default now()
);

-- Habilitar Realtime
alter publication supabase_realtime add table conversations;
alter publication supabase_realtime add table messages;

-- Crear bucket de Storage
insert into storage.buckets (id, name) values ('chat-attachments', 'chat-attachments');
```

3. Configurar RLS policies (ejemplo mínimo):

```sql
-- Mensajes: clientes pueden leer/escribir de sus conversaciones
create policy "Customers can read messages" on messages
  for select using (true);
create policy "Customers can insert messages" on messages
  for insert with check (true);

-- Conversaciones: lectura pública para el widget
create policy "Public can read conversations" on conversations
  for select using (true);
```

### Paso 4: Variables de entorno

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

### Paso 5: Integrar en el layout

```tsx
// app/layout.tsx
import { LanguageProvider } from '@/context/language-context'
import { ClientChatWidget } from '@/components/customer-chat/client-chat-widget'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LanguageProvider>
          {children}
          <ClientChatWidget />
        </LanguageProvider>
      </body>
    </html>
  )
}
```

### Paso 6: CSS para ocultar en admin

```css
/* globals.css */
body:has(.admin-layout) [aria-label="Open chat"],
body:has(.admin-layout) [aria-label="Close chat"],
body:has(.admin-layout) .fixed.bottom-6.right-6 {
  display: none !important;
}
```

---

## ⚠️ Nota sobre Windows (desarrollo local)

En Windows, `process.cwd()` puede retornar `desktop` (minúscula) mientras el directorio real es `Desktop` (mayúscula). Esto causa que webpack cree duplicados de módulos, rompiendo la hidratación de React.

**Solución para dev en Windows:**
```bash
node dev.mjs
```

`dev.mjs` usa `fs.realpathSync.native('.')` para obtener el casing correcto antes de iniciar Next.js.

**Esto NO afecta producción** (Vercel/Docker/Linux son case-sensitive desde el inicio). `dev.mjs` solo se usa en desarrollo local con Windows.

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

**Linux/Mac:**
```bash
npm run dev
# or
pnpm dev
```

**Windows (recomendado):**
```bash
node dev.mjs
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
- `components/customer-chat/customer-auth-form.tsx` — Login/Register tabs in chat widget
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

## 🌐 Deployment on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push your project to a GitHub repository.
2. Import the repository into your Vercel Dashboard.
3. Configure the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL`) in the Vercel Project Settings.
4. Click **Deploy**. Vercel will automatically build the site and spin up the Serverless Functions for your API routes.

---

## 📄 License

This project is private and intended solely for the operations of **HCS Trading**. All rights reserved.
