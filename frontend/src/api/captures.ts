import { apiClient } from './client'
import type { Capture } from './schemas'

export const postCapture = (formData: FormData): Promise<Capture> =>
  apiClient('/captures', { method: 'POST', body: formData })

export const getCaptures = (): Promise<Capture[]> => apiClient('/captures')

export const getCapture = (capture_id: string): Promise<Capture> =>
  apiClient(`/captures/${capture_id}`)

export const putCapture = (
  capture_id: string,
  formData: FormData,
): Promise<Capture> =>
  apiClient(`/captures/${capture_id}`, { method: 'PUT', body: formData })
