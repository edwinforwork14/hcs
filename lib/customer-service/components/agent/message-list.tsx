'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DateDivider } from '@/components/chat/date-divider'
import { useCustomerService } from '../../context'
import { computeMessageDividers } from '@/lib/time'
import type { Message } from '../../core/domain'

import { MessageBubble } from '../shared/message-bubble'

export function MessageList({
  messages,
  lastReadAt,
}: {
  messages: Message[]
  lastReadAt: string | null
}) {
  const { t } = useCustomerService()
  const scrollRef = useRef<HTMLDivElement>(null)
  const nearBottomRef = useRef(true)
  const [showJump, setShowJump] = useState(false)

  const scrollToBottom = () => {
    const viewport = scrollRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    )
    if (viewport) viewport.scrollTop = viewport.scrollHeight
  }

  const handleScroll = () => {
    const viewport = scrollRef.current?.querySelector(
      '[data-slot="scroll-area-viewport"]',
    )
    if (!viewport) return
    const distance =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
    nearBottomRef.current = distance < 80
    if (nearBottomRef.current) setShowJump(false)
  }

  useEffect(() => {
    if (nearBottomRef.current) {
      scrollToBottom()
      setShowJump(false)
    } else {
      setShowJump(true)
    }
  }, [messages.length])

  const dividers = computeMessageDividers(messages)

  return (
    <div
      className="relative flex min-h-0 flex-1"
      onScrollCapture={handleScroll}
    >
      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="flex flex-col gap-2 p-4">
          {messages.map((message, index) => {
            const divider = dividers.find((d) => d.messageIndex === index)
            return (
              <div key={message.id} className="flex flex-col gap-2">
                {divider && <DateDivider date={message.created_at} />}
                <MessageBubble message={message} lastReadAt={lastReadAt} mode="agent" />
              </div>
            )
          })}
        </div>
      </ScrollArea>

      {showJump && (
        <Button
          type="button"
          size="icon-sm"
          onClick={() => {
            nearBottomRef.current = true
            scrollToBottom()
            setShowJump(false)
          }}
          aria-label={t('admin.newMessages')}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 cursor-pointer shadow-lg border-0"
        >
          <ArrowDown className="size-4" />
        </Button>
      )}
    </div>
  )
}
