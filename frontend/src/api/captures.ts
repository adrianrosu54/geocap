import { apiClient } from './client'
import type { Capture } from './schemas'

export const postCapture = (formData: FormData): Promise<Capture> =>
  apiClient('/api/captures', { method: 'POST', body: formData })

export const getCaptures = (): Promise<Capture[]> => apiClient('/api/captures')

export const getCapture = (capture_id: string): Promise<Capture> =>
  apiClient(`/api/captures/${capture_id}`)

export const deleteCapture = (capture_id: string): Promise<string> =>
  apiClient(`/api/captures/${capture_id}`)

export const putCapture = (
  capture_id: string,
  formData: FormData,
): Promise<Capture> =>
  apiClient(`/api/captures/${capture_id}`, { method: 'PUT', body: formData })
