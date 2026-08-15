/** Allowed MIME types for chat attachments. */
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
])

export const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024 // 25 MB

export function isAllowedAttachmentType(type: string): boolean {
  return ALLOWED_TYPES.has(type)
}

/** Human-readable file size, e.g. "1.4 MB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Sanitize a file name so it is safe to use inside a storage path. */
export function sanitizeFileName(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100)
  return base || 'file'
}

/** Ask the server for a short-lived signed URL to open/download an attachment. */
export async function getAttachmentDownloadUrl(path: string): Promise<string> {
  const response = await fetch('/api/chat/attachment-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path }),
  })
  const data = await response.json()
  if (!response.ok || !data?.url) {
    throw new Error(data?.error || 'Could not generate download link')
  }
  return data.url as string
}
