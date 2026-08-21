import type { Metadata } from 'next'
import { Inter, Sora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/language-context'
import { Toaster } from '@/components/ui/sonner'
import dynamic from 'next/dynamic'

// SSR disabled: avoids the Windows casing bug that breaks React hydration
// when next/navigation is loaded by the layout router.
const ChatWidget = dynamic(
  () => import('@/components/customer-chat/chat-widget').then((m) => m.ChatWidget),
  { ssr: false },
)
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const sora = Sora({
  subsets: ["latin"],
  variable: '--font-sora'
})

export const metadata: Metadata = {
  title: 'HCS trading | Connecting Global Brands Across the Americas',
  description: 'HCS trading specializes in electronics and global supply solutions, representing and distributing international brands across the Americas through reliable partnerships, strategic logistics, and industry expertise.',
  keywords: ['electronics', 'global supply', 'distribution', 'Americas', 'networking solutions', 'CCTV', 'security systems'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${inter.variable} ${sora.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
          <Toaster position="top-right" />
          <ChatWidget />
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' &&
          process.env.VERCEL === '1' && <Analytics />}
      </body>
    </html>
  )
}
