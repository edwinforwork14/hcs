'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Paperclip, Send } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/context/language-context'
import {
  isAllowedAttachmentType,
  MAX_ATTACHMENT_SIZE,
} from '@/lib/attachments'
import {
  MessageSchema,
  type MessageInput as MessageInputValues,
} from '@/lib/validations/chat'

const ACCEPT =
  '.pdf,.png,.jpg,.jpeg,.gif,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip'

interface MessageInputProps {
  onSend: (content: string) => Promise<void> | void
  onSendAttachment: (file: File, content?: string) => Promise<void> | void
  disabled?: boolean
}

export function MessageInput({
  onSend,
  onSendAttachment,
  disabled,
}: MessageInputProps) {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const form = useForm<MessageInputValues>({
    resolver: zodResolver(MessageSchema),
    defaultValues: { content: '' },
  })

  const handleSubmit = async (values: MessageInputValues) => {
    if (uploading) return
    await onSend(values.content)
    form.reset()
  }

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || uploading) return

    if (file.size > MAX_ATTACHMENT_SIZE) {
      toast.error(t('chat.fileTooBig'))
      return
    }
    if (!isAllowedAttachmentType(file.type)) {
      toast.error(t('chat.fileTypeNotAllowed'))
      return
    }

    setUploading(true)
    try {
      await onSendAttachment(file, form.getValues('content'))
      form.reset()
    } catch {
      toast.error(t('chat.uploadError'))
    } finally {
      setUploading(false)
    }
  }

  const busy = disabled || uploading

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className="flex items-end gap-2 border-t p-3"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleFile}
      />
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={() => fileInputRef.current?.click()}
        disabled={busy}
        aria-label={t('chat.attach')}
        title={t('chat.attach')}
        className="cursor-pointer"
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Paperclip className="size-4" />
        )}
      </Button>
      <Textarea
        rows={1}
        placeholder={t('admin.typeMessage')}
        className="min-h-10 max-h-32 flex-1 resize-none"
        disabled={busy}
        {...form.register('content')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (!busy) form.handleSubmit(handleSubmit)()
          }
        }}
      />
      <Button
        type="submit"
        size="icon"
        disabled={busy}
        aria-label={t('admin.sendMessage')}
        className="cursor-pointer"
      >
        <Send className="size-4" />
      </Button>
    </form>
  )
}
