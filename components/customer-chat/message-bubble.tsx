'use client'

import { cn } from '@/lib/utils'
import { formatMessageTime } from '@/lib/time'
import { getMessageAttachment, getMessageText, type Message } from '@/types/chat'

import { AttachmentCard } from '@/components/chat/attachment-card'

export function MessageBubble({ message }: { message: Message }) {
  const isCustomer = message.sender_type === 'customer'
  const attachment = getMessageAttachment(message)

  return (
    <div
      className={cn(
        'flex flex-col',
        isCustomer ? 'items-end' : 'items-start',
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm',
          isCustomer
            ? 'rounded-br-sm bg-gradient-to-r from-[#D90429] to-[#FF4D6A] text-white'
            : 'rounded-bl-sm bg-muted text-foreground',
        )}
      >
        {attachment && (
          <div className="mb-1.5">
            <AttachmentCard attachment={attachment} tone="dark" />
          </div>
        )}
        {getMessageText(message) && (
          <p className="whitespace-pre-wrap break-words">
            {getMessageText(message)}
          </p>
        )}
      </div>
      <span className="mt-0.5 text-[10px] text-muted-foreground">
        {formatMessageTime(message.created_at)}
      </span>
    </div>
  )
}
