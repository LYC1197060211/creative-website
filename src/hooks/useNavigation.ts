import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NavigationPage = 'dashboard' | 'ideas' | 'ai-optimize' | 'projects' | 'templates' | 'chat'

interface NavigationState {
  currentPage: NavigationPage
  setCurrentPage: (page: NavigationPage) => void
}

export const useNavigation = create<NavigationState>()(
  persist(
    (set) => ({
      currentPage: 'dashboard',
      setCurrentPage: (page) => set({ currentPage: page }),
    }),
    {
      name: 'navigation-storage',
    }
  )
)

// 导航项配置
export const navigationItems = [
  {
    id: 'dashboard' as NavigationPage,
    name: '首页',
    icon: '🏠',
    iconColor: 'text-orange-500',
    description: '系统概览和统计'
  },
  {
    id: 'ideas' as NavigationPage,
    name: '创意管理',
    icon: '💡',
    iconColor: 'text-yellow-500',
    description: '管理创意想法'
  },
  {
    id: 'ai-optimize' as NavigationPage,
    name: 'AI优化',
    icon: '🤖',
    iconColor: 'text-purple-500',
    description: 'AI智能优化'
  },
  {
    id: 'projects' as NavigationPage,
    name: '项目展示',
    icon: '🚀',
    iconColor: 'text-pink-500',
    description: '项目作品展示'
  },
  {
    id: 'templates' as NavigationPage,
    name: '模板库',
    icon: '📚',
    iconColor: 'text-green-500',
    description: '学习模板资源'
  },
  {
    id: 'chat' as NavigationPage,
    name: 'GLM对话',
    icon: '💬',
    iconColor: 'text-blue-500',
    description: 'AI智能对话'
  }
] as const