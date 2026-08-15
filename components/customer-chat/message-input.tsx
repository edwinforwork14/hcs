'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'

import { useLanguage } from '@/context/language-context'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageSchema, type MessageInput as MessageInputValues } from '@/lib/validations/chat'

interface MessageInputProps {
  onSend: (content: string) => Promise<void> | void
  disabled?: boolean
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const { t } = useLanguage()

  const form = useForm<MessageInputValues>({
    resolver: zodResolver(MessageSchema),
    defaultValues: { content: '' },
  })

  const handleSubmit = async (values: MessageInputValues) => {
    await onSend(values.content)
    form.reset()
  }

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex items-end gap-2 border-t p-3"
    >
      <Textarea
        rows={1}
        placeholder={t('chat.placeholder')}
        className="min-h-10 max-h-32 flex-1 resize-none"
        disabled={disabled}
        {...form.register('content')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (!disabled) form.handleSubmit(handleSubmit)()
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={disabled}
        aria-label={t('chat.send')}
        className="cursor-pointer bg-gradient-to-r from-[#D90429] to-[#FF4D6A] hover:from-[#B80324] hover:to-[#D90429]"
      >
        <Send className="size-4" />
      </Button>
    </form>
  )
}
