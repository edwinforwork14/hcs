import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { PresenceProvider } from '../../../core/interfaces'
import type { PresenceData } from '../../../core/domain'

export class SupabasePresenceProvider implements PresenceProvider {
  private activeChannels = new Map<string, any>()

  constructor(private getClient: () => SupabaseClient<Database>) {}

  private getOrCreateChannel(channelName: string) {
    let channel = this.activeChannels.get(channelName)
    if (!channel) {
      channel = this.getClient().channel(channelName)
      this.activeChannels.set(channelName, channel)
    }
    return channel
  }

  subscribe(
    channelName: string,
    onSync: (state: Record<string, PresenceData[]>) => void
  ): () => void {
    const supabase = this.getClient()
    const channel = this.getOrCreateChannel(channelName)

    channel
      .on('presence', { event: 'sync' }, () => {
        const rawState = channel.presenceState()
        const mappedState: Record<string, PresenceData[]> = {}
        for (const key of Object.keys(rawState)) {
          mappedState[key] = (rawState[key] || []) as unknown as PresenceData[]
        }
        onSync(mappedState)
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
      this.activeChannels.delete(channelName)
    }
  }

  async track(channelName: string, data: PresenceData): Promise<void> {
    const channel = this.getOrCreateChannel(channelName)
    return new Promise((resolve, reject) => {
      // In case already subscribed
      if (channel.state === 'joined') {
        channel.track(data).then(resolve).catch(reject)
        return
      }

      channel.subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          try {
            await channel.track(data)
            resolve()
          } catch (e) {
            reject(e)
          }
        } else if (status === 'CHANNEL_ERROR') {
          reject(new Error('Channel error subscribing to presence'))
        }
      })
    })
  }

  async untrack(channelName: string): Promise<void> {
    const channel = this.activeChannels.get(channelName)
    if (channel) {
      await channel.untrack()
    }
  }
}
