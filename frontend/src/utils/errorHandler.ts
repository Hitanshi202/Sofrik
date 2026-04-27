import type { ApiError } from '@/types'
import { AxiosError } from 'axios'

export function extractApiError(error: unknown): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiError
    const messages: string[] = []
    for (const key of Object.keys(data)) {
      const val = data[key]
      if (Array.isArray(val)) {
        messages.push(...val)
      } else if (typeof val === 'string') {
        messages.push(val)
      }
    }
    return messages.join(' ') || 'An error occurred.'
  }
  return 'An unexpected error occurred.'
}
