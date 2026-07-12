import { apiClient } from './client'
import type { User } from './schemas'

export const getMe = (): Promise<User> => apiClient('/users/me')
