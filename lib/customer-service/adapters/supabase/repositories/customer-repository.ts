import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types'
import type { CustomerRepository, CreateCustomerInput, UpdateCustomerInput } from '../../../core/interfaces'
import type { Customer } from '../../../core/domain'

export class SupabaseCustomerRepository implements CustomerRepository {
  constructor(private getClient: () => SupabaseClient<Database>) {}

  async findById(id: string): Promise<Customer | null> {
    const { data, error } = await this.getClient()
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const { data, error } = await this.getClient()
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle()
    if (error) throw error
    return data
  }

  async create(data: CreateCustomerInput): Promise<Customer> {
    const { data: created, error } = await this.getClient()
      .from('user_profiles')
      .insert({
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone ?? null,
      })
      .select()
      .single()
    if (error) throw error
    return created
  }

  async update(id: string, data: UpdateCustomerInput): Promise<Customer> {
    const { data: updated, error } = await this.getClient()
      .from('user_profiles')
      .update({
        ...(data.full_name ? { full_name: data.full_name } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return updated
  }
}
