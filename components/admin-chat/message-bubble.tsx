'use client'

import { Check, CheckCheck } from 'lucide-react'

import { cn } from '@/lib/utils'
import { formatMessageTime } from '@/lib/time'
import { getMessageAttachment, getMessageText, type Message } from '@/types/chat'

import { AttachmentCard } from '@/components/chat/attachment-card'

interface MessageBubbleProps {
  message: Message
  /**
   * `admin_last_read_at` of the conversation (from the database).
   * A customer message is "read" when it was created at or before this
   * timestamp; otherwise it is still unread.
   */
  lastReadAt: string | null
}

export function MessageBubble({ message, lastReadAt }: MessageBubbleProps) {
  const isCustomer = message.sender_type === 'customer'
  const attachment = getMessageAttachment(message)

  // Only customer → admin messages carry a read state (has the admin seen it?).
  const isRead =
    isCustomer &&
    !!lastReadAt &&
    new Date(message.created_at).getTime() <= new Date(lastReadAt).getTime()

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
            <AttachmentCard attachment={attachment} tone="light" />
          </div>
        )}
        {getMessageText(message) && (
          <p className="whitespace-pre-wrap break-words">
            {getMessageText(message)}
          </p>
        )}
      </div>
      <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
        {formatMessageTime(message.created_at)}
        {isCustomer &&
          (isRead ? (
            <CheckCheck
              aria-label="Read"
              style={{ width: 13, height: 13, color: '#2563eb' }}
            />
          ) : (
            <Check
              aria-label="Not read"
              style={{ width: 13, height: 13, color: '#9ca3af' }}
            />
          ))}
      </span>
    </div>
  )
}
