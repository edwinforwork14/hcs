import type { PresenceData } from '../../domain'

export interface PresenceProvider {
  subscribe(
    channelName: string,
    onSync: (state: Record<string, PresenceData[]>) => void
  ): () => void
  track(channelName: string, data: PresenceData): Promise<void>
  untrack(channelName: string): Promise<void>
}
