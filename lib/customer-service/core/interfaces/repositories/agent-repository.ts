import type { Agent } from '../../domain'

export interface AgentRepository {
  findByEmail(email: string): Promise<Agent | null>
  findAll(): Promise<Agent[]>
  create(data: { email: string; name: string }): Promise<Agent>
}
