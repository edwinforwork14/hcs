'use client'

import { useEffect, useRef } from 'react'

import { ScrollArea } from '@/components/ui/scroll-area'
import { DateDivider } from '@/components/chat/date-divider'
import { computeMessageDividers } from '@/lib/time'
import type { Message } from '@/types/chat'

import { MessageBubble } from './message-bubble'

export function MessageList({ messages }: { messages: Message[] }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length])

  const dividers = computeMessageDividers(messages)

  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="flex flex-col gap-2 p-4">
        {messages.map((message, index) => {
          const divider = dividers.find((d) => d.messageIndex === index)
          return (
            <div key={message.id} className="flex flex-col gap-2">
              {divider && <DateDivider date={message.created_at} />}
              <MessageBubble message={message} />
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
