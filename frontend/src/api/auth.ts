import { apiClient, formBody } from './client'
import type { LoginFormTypes, Token, User } from './schemas'

export const register = (payload: LoginFormTypes): Promise<User> =>
  apiClient('/api/auth/register', {
    method: 'POST',
    ...formBody(payload),
    skipAuth: true,
  })

export const login = (payload: LoginFormTypes): Promise<Token> =>
  apiClient('/api/auth/login', {
    method: 'POST',
    ...formBody(payload),
    skipAuth: true,
  })
