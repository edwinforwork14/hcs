import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { RealtimeProvider, RealtimeCallback } from '../../../core/interfaces'

export class SupabaseRealtimeProvider implements RealtimeProvider {
  constructor(private getClient: () => SupabaseClient<Database>) {}

  subscribe(
    table: 'conversations' | 'messages',
    filter: string | undefined,
    callback: RealtimeCallback
  ): () => void {
    const supabase = this.getClient()
    const channelName = `realtime-${table}-${filter ?? 'all'}-${Math.random()
      .toString(36)
      .slice(2, 10)}`

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...(filter ? { filter } : {}),
        },
        (event) => {
          callback({
            eventType: event.eventType as 'INSERT' | 'UPDATE' | 'DELETE' | '*',
            new: event.new || {},
            old: event.old || {},
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }
}
