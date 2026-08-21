import type { PresenceProvider } from '../interfaces'

export class PresenceService {
  constructor(private presenceProvider: PresenceProvider) {}

  subscribe(
    channelName: string,
    onSync: (online: boolean) => void
  ): () => void {
    return this.presenceProvider.subscribe(channelName, (state) => {
      const online = Object.keys(state).length > 0
      onSync(online)
    })
  }

  async trackAgent(channelName: string, agentEmail: string): Promise<void> {
    await this.presenceProvider.track(channelName, { email: agentEmail })
  }

  async untrackAgent(channelName: string): Promise<void> {
    await this.presenceProvider.untrack(channelName)
  }
}
