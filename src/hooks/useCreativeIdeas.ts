import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CreativeIdea } from '@/types'
import { generateId, formatDate } from '@/lib/utils'
import { Idea } from '@/types/database'
import { useAuth } from './useAuth'

interface CreativeIdeasState {
  ideas: CreativeIdea[]
  filteredIdeas: CreativeIdea[]
  isLoading: boolean
  error: string | null
  isSyncing: boolean
  lastSyncTime: Date | null
  searchTerm: string
  selectedCategory: string
  selectedStatus: string
  selectedPriority: string

  // 云端同步操作
  fetchIdeas: () => Promise<void>
  syncIdeas: () => Promise<void>

  // 基础操作
  addIdea: (idea: Omit<CreativeIdea, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateIdea: (id: string, updates: Partial<CreativeIdea>) => Promise<void>
  deleteIdea: (id: string) => Promise<void>
  getIdeaById: (id: string) => CreativeIdea | undefined

  // 筛选和搜索
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  setSelectedStatus: (status: string) => void
  setSelectedPriority: (priority: string) => void
  clearFilters: () => void

  // 辅助方法
  applyFilters: (ideas: CreativeIdea[]) => CreativeIdea[]
  getCategories: () => string[]
  getStats: () => {
    total: number
    completed: number
    inProgress: number
    planning: number
  }
  clearError: () => void
}

export const useCreativeIdeas = create<CreativeIdeasState>()(
  persist(
    (set, get) => ({
      ideas: [],
      filteredIdeas: [],
      isLoading: false,
      error: null,
      isSyncing: false,
      lastSyncTime: null,
      searchTerm: '',
      selectedCategory: '',
      selectedStatus: '',
      selectedPriority: '',

      // 云端同步操作
      fetchIdeas: async () => {
        const auth = useAuth.getState()
        if (!auth.session) {
          set({ error: '用户未登录' })
          return
        }

        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/ideas', {
            headers: {
              'Authorization': `Bearer ${auth.session.access_token}`,
            },
          })

          if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
          }

          const ideas: Idea[] = await response.json()

          // 转换数据库格式到前端格式
          const frontendIdeas: CreativeIdea[] = ideas.map(idea => ({
            id: idea.id,
            title: idea.title,
            description: idea.description,
            tags: idea.tags,
            category: idea.category,
            priority: idea.priority,
            status: idea.status as any,
            techStack: idea.tech_stack,
            aiSuggestions: idea.ai_suggestions,
            createdAt: new Date(idea.created_at),
            updatedAt: new Date(idea.updated_at),
          }))

          set({
            ideas: frontendIdeas,
            filteredIdeas: get().applyFilters(frontendIdeas),
            lastSyncTime: new Date()
          })
        } catch (error) {
          console.error('获取创意列表失败:', error)
          set({ error: '获取创意列表失败' })
        } finally {
          set({ isLoading: false })
        }
      },

      syncIdeas: async () => {
        set({ isSyncing: true, error: null })
        await get().fetchIdeas()
        set({ isSyncing: false })
      },

      // 基础操作
      addIdea: async (ideaData) => {
        const auth = useAuth.getState()
        if (!auth.session) {
          set({ error: '用户未登录' })
          return
        }

        set({ error: null })

        try {
          const response = await fetch('/api/ideas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.session.access_token}`,
            },
            body: JSON.stringify(ideaData),
          })

          if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
          }

          const newIdea: Idea = await response.json()

          // 转换为前端格式
          const frontendIdea: CreativeIdea = {
            id: newIdea.id,
            title: newIdea.title,
            description: newIdea.description,
            tags: newIdea.tags,
            category: newIdea.category,
            priority: newIdea.priority,
            status: newIdea.status as any,
            techStack: newIdea.tech_stack,
            aiSuggestions: newIdea.ai_suggestions,
            createdAt: new Date(newIdea.created_at),
            updatedAt: new Date(newIdea.updated_at),
          }

          set((state) => {
            const updatedIdeas = [...state.ideas, frontendIdea]
            return {
              ideas: updatedIdeas,
              filteredIdeas: state.applyFilters(updatedIdeas)
            }
          })
        } catch (error) {
          console.error('创建创意失败:', error)
          set({ error: '创建创意失败' })
        }
      },

      updateIdea: async (id, updates) => {
        const auth = useAuth.getState()
        if (!auth.session) {
          set({ error: '用户未登录' })
          return
        }

        set({ error: null })

        try {
          const response = await fetch(`/api/ideas/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.session.access_token}`,
            },
            body: JSON.stringify(updates),
          })

          if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
          }

          const updatedIdea: Idea = await response.json()

          // 转换为前端格式
          const frontendIdea: CreativeIdea = {
            id: updatedIdea.id,
            title: updatedIdea.title,
            description: updatedIdea.description,
            tags: updatedIdea.tags,
            category: updatedIdea.category,
            priority: updatedIdea.priority,
            status: updatedIdea.status as any,
            techStack: updatedIdea.tech_stack,
            aiSuggestions: updatedIdea.ai_suggestions,
            createdAt: new Date(updatedIdea.created_at),
            updatedAt: new Date(updatedIdea.updated_at),
          }

          set((state) => {
            const updatedIdeas = state.ideas.map((idea) =>
              idea.id === id ? frontendIdea : idea
            )
            return {
              ideas: updatedIdeas,
              filteredIdeas: state.applyFilters(updatedIdeas)
            }
          })
        } catch (error) {
          console.error('更新创意失败:', error)
          set({ error: '更新创意失败' })
        }
      },

      deleteIdea: async (id) => {
        const auth = useAuth.getState()
        if (!auth.session) {
          set({ error: '用户未登录' })
          return
        }

        set({ error: null })

        try {
          const response = await fetch(`/api/ideas/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${auth.session.access_token}`,
            },
          })

          if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
          }

          set((state) => {
            const updatedIdeas = state.ideas.filter((idea) => idea.id !== id)
            return {
              ideas: updatedIdeas,
              filteredIdeas: state.applyFilters(updatedIdeas)
            }
          })
        } catch (error) {
          console.error('删除创意失败:', error)
          set({ error: '删除创意失败' })
        }
      },

      getIdeaById: (id) => {
        return get().ideas.find((idea) => idea.id === id)
      },

      setSearchTerm: (term) => {
        set({ searchTerm: term })
        // 自动应用筛选
        const state = get()
        set({ filteredIdeas: state.applyFilters(state.ideas) })
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category })
        const state = get()
        set({ filteredIdeas: state.applyFilters(state.ideas) })
      },

      setSelectedStatus: (status) => {
        set({ selectedStatus: status })
        const state = get()
        set({ filteredIdeas: state.applyFilters(state.ideas) })
      },

      setSelectedPriority: (priority) => {
        set({ selectedPriority: priority })
        const state = get()
        set({ filteredIdeas: state.applyFilters(state.ideas) })
      },

      clearFilters: () => {
        set({
          searchTerm: '',
          selectedCategory: '',
          selectedStatus: '',
          selectedPriority: ''
        })
        const state = get()
        set({ filteredIdeas: state.ideas })
      },

      getCategories: () => {
        const ideas = get().ideas
        const categories = new Set(ideas.map((idea) => idea.category).filter(Boolean))
        return Array.from(categories) as string[]
      },

      getStats: () => {
        const ideas = get().ideas
        return {
          total: ideas.length,
          completed: ideas.filter((idea) => idea.status === 'completed').length,
          inProgress: ideas.filter((idea) => idea.status === 'in-progress').length,
          planning: ideas.filter((idea) => idea.status === 'planning').length,
        }
      },

      clearError: () => set({ error: null }),

      // 内部筛选方法
      applyFilters: (ideas: CreativeIdea[]) => {
        const { searchTerm, selectedCategory, selectedStatus, selectedPriority } = get()

        return ideas.filter((idea) => {
          // 搜索词筛选
          const matchesSearch = searchTerm === '' ||
            idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

          // 分类筛选
          const matchesCategory = selectedCategory === '' || idea.category === selectedCategory

          // 状态筛选
          const matchesStatus = selectedStatus === '' || idea.status === selectedStatus

          // 优先级筛选
          const matchesPriority = selectedPriority === '' || idea.priority === selectedPriority

          return matchesSearch && matchesCategory && matchesStatus && matchesPriority
        })
      }
    }),
    {
      name: 'creative-ideas-storage',
      partialize: (state) => ({
        ideas: state.ideas,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.filteredIdeas = state.applyFilters(state.ideas)
        }
      }
    }
  )
)