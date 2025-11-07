import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CreativeIdea } from '@/types'
import { generateId, formatDate } from '@/lib/utils'

interface CreativeIdeasState {
  ideas: CreativeIdea[]
  filteredIdeas: CreativeIdea[]
  isLoading: boolean
  searchTerm: string
  selectedCategory: string
  selectedStatus: string
  selectedPriority: string

  // 基础操作
  addIdea: (idea: Omit<CreativeIdea, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateIdea: (id: string, updates: Partial<CreativeIdea>) => void
  deleteIdea: (id: string) => void
  getIdeaById: (id: string) => CreativeIdea | undefined

  // 筛选和搜索
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  setSelectedStatus: (status: string) => void
  setSelectedPriority: (priority: string) => void
  clearFilters: () => void

  // 辅助方法
  getCategories: () => string[]
  getStats: () => {
    total: number
    completed: number
    inProgress: number
    planning: number
  }
}

export const useCreativeIdeas = create<CreativeIdeasState>()(
  persist(
    (set, get) => ({
      ideas: [],
      filteredIdeas: [],
      isLoading: false,
      searchTerm: '',
      selectedCategory: '',
      selectedStatus: '',
      selectedPriority: '',

      addIdea: (ideaData) => {
        const newIdea: CreativeIdea = {
          ...ideaData,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        set((state) => {
          const updatedIdeas = [...state.ideas, newIdea]
          return {
            ideas: updatedIdeas,
            filteredIdeas: state.applyFilters(updatedIdeas)
          }
        })
      },

      updateIdea: (id, updates) => {
        set((state) => {
          const updatedIdeas = state.ideas.map((idea) =>
            idea.id === id
              ? { ...idea, ...updates, updatedAt: new Date() }
              : idea
          )
          return {
            ideas: updatedIdeas,
            filteredIdeas: state.applyFilters(updatedIdeas)
          }
        })
      },

      deleteIdea: (id) => {
        set((state) => {
          const updatedIdeas = state.ideas.filter((idea) => idea.id !== id)
          return {
            ideas: updatedIdeas,
            filteredIdeas: state.applyFilters(updatedIdeas)
          }
        })
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