import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthState = {
  token: string | null
  setSession: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setSession: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    { name: 'auth' }, // localStorage persistance
  ),
)
