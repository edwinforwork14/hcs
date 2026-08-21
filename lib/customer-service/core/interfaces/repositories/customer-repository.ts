import type { Customer } from '../../domain'

export interface CreateCustomerInput {
  id: string
  full_name: string
  email: string
  phone?: string | null
}

export interface UpdateCustomerInput {
  full_name?: string
  phone?: string | null
}

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>
  findByEmail(email: string): Promise<Customer | null>
  create(data: CreateCustomerInput): Promise<Customer>
  update(id: string, data: UpdateCustomerInput): Promise<Customer>
}
