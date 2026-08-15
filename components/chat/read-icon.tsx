'use client'

/**
 * WhatsApp-style read receipt rendered as a plain inline SVG with explicit
 * attributes. It does not depend on any CSS class, icon library or external
 * font, so it renders identically in every browser (Windows, macOS, mobile).
 *
 * - read=false: single gray check  — message sent, not read yet
 * - read=true:  double blue check  — message read
 */
export function ReadIcon({ read, size = 14 }: { read: boolean; size?: number }) {
  const color = read ? '#2563eb' : '#9ca3af'
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={read ? 'Read' : 'Not read'}
      style={{ flexShrink: 0, display: 'inline-block' }}
    >
      {read ? (
        <>
          <path d="M18 6 7 17l-5-5" />
          <path d="m22 10-7.5 7.5L13 16" />
        </>
      ) : (
        <path d="M20 6 9 17l-5-5" />
      )}
    </svg>
  )
}
