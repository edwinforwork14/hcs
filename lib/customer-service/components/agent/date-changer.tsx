'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Calendar, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCustomerService } from '../../context'
import type { Conversation } from '../../core/domain'

interface DateChangerProps {
  initialConversations: Conversation[]
}

export function DateChanger({ initialConversations }: DateChangerProps) {
  const { t } = useCustomerService()
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string>(initialConversations[0]?.id ?? '')
  const [targetDate, setTargetDate] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId || !targetDate) return

    setLoading(true)
    try {
      const res = await fetch('/api/chat/datechange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedId,
          targetDate: new Date(targetDate).toISOString(),
        }),
      })

      const json = await res.json()
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to update date')
      }

      toast.success('Conversation date updated!')
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error updating date')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md space-y-6 rounded-xl border bg-background p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Calendar className="size-6" />
          </div>
          <h1 className="mt-4 text-lg font-semibold">Date Simulator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Shift conversation and message timestamps for testing or training.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="conversation-select">Conversation</Label>
            <select
              id="conversation-select"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {initialConversations.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name} ({c.customer_email})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-date">New Target Start Date</Label>
            <Input
              id="target-date"
              type="datetime-local"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="bg-background text-foreground"
            />
          </div>

          <Button type="submit" disabled={loading || !selectedId || !targetDate} className="w-full cursor-pointer">
            {loading && <Loader2 className="size-4 animate-spin mr-2" />}
            Shift Conversation Timestamps
          </Button>
        </form>
      </div>
    </div>
  )
}
