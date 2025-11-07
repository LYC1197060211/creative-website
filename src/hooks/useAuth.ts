import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  email?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuth: () => void
}

// 简单的用户验证
const VALID_USERS = {
  lyc: {
    id: '1',
    username: 'lyc',
    password: '060214',
    email: 'lyc@example.com'
  }
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true })

        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 1000))

        const validUser = VALID_USERS[username as keyof typeof VALID_USERS]

        if (validUser && validUser.password === password) {
          const user = {
            id: validUser.id,
            username: validUser.username,
            email: validUser.email
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false
          })
          return true
        }

        set({ isLoading: false })
        return false
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        })
      },

      checkAuth: () => {
        const { user, isAuthenticated } = get()
        if (user && isAuthenticated) {
          set({ isAuthenticated: true })
        } else {
          set({ isAuthenticated: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)