export interface Agent {
  id: string
  email: string
  name: string
  created_at?: string
}

export type AgentStatus = 'online' | 'offline'
