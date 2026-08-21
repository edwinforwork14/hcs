export type RealtimeStatus = 'CONNECTING' | 'SUBSCRIBED' | 'CLOSED' | 'CHANNEL_ERROR'

export interface RealtimeEvent {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  new: Record<string, any>
  old: Record<string, any>
}

export type RealtimeCallback = (event: RealtimeEvent) => void

export interface RealtimeProvider {
  subscribe(
    table: 'conversations' | 'messages',
    filter: string | undefined,
    callback: RealtimeCallback
  ): () => void
}
