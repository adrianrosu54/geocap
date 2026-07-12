import type { JWTType } from '#/api/schemas'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  token: string | null
  id: string | null
  username: string | null
  setSession: (token: string, jwt: JWTType) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      id: null,
      username: null,
      setSession: (token, jwt) => set({ token, ...jwt }),
      logout: () => set({ token: null, id: null, username: null }),
    }),
    { name: 'auth' }, // localStorage persistance
  ),
)
