'use client'

import dynamic from 'next/dynamic'

// Client Component wrapper that loads ChatWidget with ssr: false.
// This avoids the Windows casing bug that breaks React hydration when
// next/navigation is loaded by the layout router during SSR.
const ChatWidget = dynamic(
  () => import('./chat-widget').then((m) => m.ChatWidget),
  { ssr: false },
)

export function ClientChatWidget() {
  return <ChatWidget />
}
