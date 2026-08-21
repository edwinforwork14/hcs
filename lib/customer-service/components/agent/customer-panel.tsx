'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock, Globe, Mail, MapPin, Phone, User } from 'lucide-react'

import { useLanguage } from '@/context/language-context'
import type { UseConversations } from '../../hooks/use-conversations'
import { formatConversationTime, formatFullDateTime } from '@/lib/time'

const PANEL_WIDTH = 288
const PALETTE_WIDTH = 44
const TRANSITION_MS = 300

function ChevronLeft({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRight({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

function UserIcon({ color }: { color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block' }}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export function CustomerPanel({ chat }: { chat: UseConversations }) {
  const { t, language } = useLanguage()
  const { selectedConversation } = chat
  const [collapsed, setCollapsed] = useState(false)
  const [showingContent, setShowingContent] = useState(true)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  const toggle = () => {
    if (collapsed) {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
      setShowingContent(true)
      setCollapsed(false)
    } else {
      setCollapsed(true)
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        setShowingContent(false)
        timerRef.current = null
      }, TRANSITION_MS)
    }
  }

  const c = selectedConversation
  const rows = c
    ? [
        { icon: User, label: t('admin.field.name'), value: c.customer_name },
        { icon: Mail, label: t('admin.field.email'), value: c.customer_email },
        {
          icon: Phone,
          label: t('admin.field.phone'),
          value: c.customer_phone ?? '—',
        },
        {
          icon: MapPin,
          label: t('admin.field.location'),
          value: c.customer_location ?? '—',
        },
        {
          icon: Globe,
          label: t('admin.field.language'),
          value: c.customer_language ?? '—',
        },
      ]
    : []

  const rowStyle = {
    display: 'flex' as const,
    alignItems: 'flex-start' as const,
    gap: 10,
  }
  const iconStyle = {
    width: 16,
    height: 16,
    flexShrink: 0,
    marginTop: 2,
    color: '#6b7280',
  }
  const labelStyle = {
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#6b7280',
    margin: 0,
  }
  const valueStyle = {
    fontSize: 14,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    color: 'var(--foreground)',
  }

  return (
    <aside
      style={{
        width: collapsed ? PALETTE_WIDTH : PANEL_WIDTH,
        transition: `width ${TRANSITION_MS}ms ease`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
        borderLeft: '1px solid var(--border)',
        backgroundColor: 'var(--muted)',
      }}
    >
      {showingContent ? (
        <div
          style={{
            width: PANEL_WIDTH,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 10px 0 16px',
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 600, margin: 0 }} className="text-foreground">
              {t('admin.customer')}
            </h3>
            <button
              type="button"
              onClick={toggle}
              aria-label={t('admin.hidePanel')}
              title={t('admin.hidePanel')}
              style={{
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 6,
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ChevronRight color="#6b7280" />
            </button>
          </div>

          {c ? (
            <>
              <div
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {rows.map((row) => (
                  <div key={row.label} style={rowStyle}>
                    <row.icon style={iconStyle} />
                    <div style={{ minWidth: 0 }}>
                      <p style={labelStyle}>{row.label}</p>
                      <p style={valueStyle}>{row.value}</p>
                    </div>
                  </div>
                ))}

                <div style={rowStyle}>
                  <Clock style={iconStyle} />
                  <div style={{ minWidth: 0 }}>
                    <p style={labelStyle}>{t('admin.field.status')}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          flexShrink: 0,
                          backgroundColor:
                            c.status === 'open' ? '#22c55e' : '#9ca3af',
                        }}
                      />
                      <span
                        style={{
                          fontSize: 14,
                          textTransform: 'capitalize',
                        }}
                        className="text-foreground"
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 'auto',
                  borderTop: '1px solid var(--border)',
                  padding: 16,
                }}
              >
                <p style={labelStyle}>{t('admin.conversationStarted')}</p>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: 14,
                    fontWeight: 600,
                  }}
                  className="text-foreground"
                >
                  {formatFullDateTime(c.created_at, language)}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>
                  {formatConversationTime(c.created_at)}
                </p>
              </div>
            </>
          ) : (
            <div style={{ padding: 16, fontSize: 12, color: '#6b7280' }}>
              {t('admin.noSelection')}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            width: PALETTE_WIDTH,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 10,
            paddingBottom: 10,
            gap: 12,
            background: 'linear-gradient(180deg, var(--cs-primary, #D90429) 0%, var(--cs-secondary, #FF4D6A) 100%)',
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            boxShadow: '-2px 0 8px rgba(0,0,0,0.12)',
          }}
        >
          <button
            type="button"
            onClick={toggle}
            aria-label={t('admin.showPanel')}
            title={t('admin.showPanel')}
            style={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.25)',
              border: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <ChevronLeft color="#ffffff" />
          </button>
          <UserIcon color="#ffffff" />
        </div>
      )}
    </aside>
  )
}
