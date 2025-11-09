import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/database'

interface AuthState {
  user: User | null
  session: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, username: string) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()

          if (!response.ok) {
            set({ error: data.error || '登录失败', isLoading: false })
            return false
          }

          set({
            user: data.user.profile,
            session: data.session,
            isAuthenticated: true,
            isLoading: false
          })

          return true
        } catch (error) {
          console.error('登录错误:', error)
          set({
            error: '网络错误，请重试',
            isLoading: false
          })
          return false
        }
      },

      signup: async (email: string, password: string, username: string) => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, username }),
          })

          const data = await response.json()

          if (!response.ok) {
            set({ error: data.error || '注册失败', isLoading: false })
            return false
          }

          set({
            user: data.user.profile,
            session: data.session,
            isAuthenticated: true,
            isLoading: false
          })

          return true
        } catch (error) {
          console.error('注册错误:', error)
          set({
            error: '网络错误，请重试',
            isLoading: false
          })
          return false
        }
      },

      logout: async () => {
        try {
          const response = await fetch('/api/auth/signout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${get().session?.access_token}`,
            },
          })

          if (!response.ok) {
            console.error('登出失败:', await response.text())
          }
        } catch (error) {
          console.error('登出错误:', error)
        } finally {
          // 无论请求成功与否，都清除本地状态
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            error: null
          })
        }
      },

      checkAuth: async () => {
        const { session } = get()
        if (!session) {
          set({ isAuthenticated: false })
          return
        }

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          })

          if (!response.ok) {
            // Token 可能已过期，清除本地状态
            set({
              user: null,
              session: null,
              isAuthenticated: false
            })
            return
          }

          const data = await response.json()
          set({
            user: data.profile,
            isAuthenticated: true
          })
        } catch (error) {
          console.error('认证检查错误:', error)
          set({
            user: null,
            session: null,
            isAuthenticated: false
          })
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)