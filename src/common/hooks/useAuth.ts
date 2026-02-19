import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthState } from '@/common/types/user'

// ai-disable-next-line no-use-any
// zustand's persist middleware uses generic any internally
export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
)
