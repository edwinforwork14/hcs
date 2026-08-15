'use client'

import { useEffect, useState } from 'react'
import {
  ExternalLink,
  File as FileIcon,
  FileArchive,
  FileText,
  Loader2,
} from 'lucide-react'

import {
  formatFileSize,
  getAttachmentDownloadUrl,
} from '@/lib/attachments'
import { cn } from '@/lib/utils'
import type { MessageAttachment } from '@/types/chat'

interface AttachmentCardProps {
  attachment: MessageAttachment
  /** 'dark' = light text on a colored bubble, 'light' = normal bubble. */
  tone?: 'dark' | 'light'
}

function fileIcon(type: string) {
  if (type.startsWith('image/')) return FileImageIcon
  if (
    type === 'application/pdf' ||
    type.startsWith('text/') ||
    type.includes('word') ||
    type.includes('document')
  ) {
    return FileText
  }
  if (type.includes('zip') || type.includes('archive')) return FileArchive
  return FileIcon
}

function FileImageIcon(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  )
}

export function AttachmentCard({
  attachment,
  tone = 'light',
}: AttachmentCardProps) {
  const [opening, setOpening] = useState(false)
  const [thumbUrl, setThumbUrl] = useState<string | null>(null)
  const isImage = attachment.type.startsWith('image/')
  const Icon = fileIcon(attachment.type)

  // Resolve the signed URL once for image thumbnails.
  useEffect(() => {
    if (!isImage) return
    let cancelled = false
    getAttachmentDownloadUrl(attachment.path)
      .then((url) => {
        if (!cancelled) setThumbUrl(url)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [isImage, attachment.path])

  const open = async () => {
    if (opening) return
    setOpening(true)
    try {
      const url = await getAttachmentDownloadUrl(attachment.path)
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch {
      // The link simply does not open; keep the UI stable.
    } finally {
      setOpening(false)
    }
  }

  return (
    <button
      type="button"
      onClick={open}
      disabled={opening}
      className={cn(
        'flex w-full cursor-pointer items-center gap-2.5 rounded-lg border p-2 pr-3 text-left text-sm transition-colors',
        tone === 'dark'
          ? 'border-white/25 bg-white/10 text-white hover:bg-white/20'
          : 'border bg-background text-foreground hover:bg-accent',
      )}
    >
      {isImage && thumbUrl ? (
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl}
            alt={attachment.name}
            className="h-full w-full object-cover"
          />
        </span>
      ) : (
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-md',
            tone === 'dark' ? 'bg-white/20' : 'bg-muted',
          )}
        >
          <Icon className="size-4" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{attachment.name}</span>
        <span
          className={cn(
            'block text-xs',
            tone === 'dark' ? 'text-white/70' : 'text-muted-foreground',
          )}
        >
          {formatFileSize(attachment.size)}
        </span>
      </span>
      {opening ? (
        <Loader2 className="size-4 shrink-0 animate-spin" />
      ) : (
        <ExternalLink className="size-4 shrink-0" />
      )}
    </button>
  )
}
