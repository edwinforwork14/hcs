export class CustomerServiceError extends Error {
  constructor(public code: string, message: string) {
    super(message)
    this.name = 'CustomerServiceError'
  }
}
