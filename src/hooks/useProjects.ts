'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project, ProjectFilter, ProjectFormData, ProjectCategory, ProjectStatus } from '@/types/project'
import { Project as DatabaseProject } from '@/types/database'
import { useAuth } from './useAuth'

interface ProjectStore {
  projects: Project[]
  filter: ProjectFilter
  isLoading: boolean
  error: string | null
  isSyncing: boolean
  lastSyncTime: Date | null

  // 云端同步操作
  fetchProjects: () => Promise<void>
  fetchFeaturedProjects: () => Promise<void>
  syncProjects: () => Promise<void>

  // Actions
  setProjects: (projects: Project[]) => void
  addProject: (project: ProjectFormData) => Promise<void>
  updateProject: (id: string, project: Partial<ProjectFormData>) => Promise<void>
  deleteProject: (id: string) => Promise<void>
  toggleFeatured: (id: string) => Promise<void>
  setFilter: (filter: Partial<ProjectFilter>) => void
  clearFilter: () => void

  // Getters
  filteredProjects: () => Project[]
  getProjectById: (id: string) => Project | undefined
  getFeaturedProjects: () => Project[]
  getProjectsByCategory: (category: ProjectCategory) => Project[]
  getProjectsByStatus: (status: ProjectStatus) => Project[]
  getProjectStats: () => {
    total: number
    completed: number
    inProgress: number
    planning: number
    featured: number
  }
  clearError: () => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const sampleProjects: Project[] = [
  {
    id: '1',
    title: '智能创意助手',
    description: '基于GLM-4.6的智能创意优化平台，帮助用户提升创意质量和实施可行性',
    content: '这是一个集成了最新AI技术的创意管理平台，通过GLM-4.6大语言模型为用户提供创意优化、技术栈推荐、实施计划生成等服务。平台采用Next.js 14构建，具有现代化的用户界面和完善的用户体验。',
    category: ProjectCategory.AI_ML,
    tags: ['AI', 'GLM-4.6', '创意管理', 'Next.js'],
    status: ProjectStatus.COMPLETED,
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Zustand', 'GLM API'],
    githubUrl: 'https://github.com/example/creative-assistant',
    demoUrl: 'https://creative-assistant-demo.com',
    imageUrl: '/images/projects/creative-assistant.jpg',
    featured: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    title: '区块链投票系统',
    description: '基于以太坊的去中心化投票平台，确保投票过程的透明性和不可篡改性',
    content: '利用智能合约技术实现的去中心化投票系统，支持多种投票机制，具有高度的透明性和安全性。系统采用Web3.js与区块链交互，前端使用React构建。',
    category: ProjectCategory.BLOCKCHAIN,
    tags: ['区块链', '以太坊', '智能合约', 'Web3'],
    status: ProjectStatus.IN_PROGRESS,
    technologies: ['React', 'Solidity', 'Web3.js', 'Ethereum', 'IPFS'],
    githubUrl: 'https://github.com/example/blockchain-voting',
    featured: true,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-10T14:20:00Z'
  },
  {
    id: '3',
    title: 'IoT智能家居控制系统',
    description: '基于物联网技术的智能家居控制平台，支持多种设备接入和场景自动化',
    content: '集成多种IoT设备和传感器的智能家居控制系统，支持远程控制、场景联动、数据分析等功能。采用MQTT协议进行设备通信，使用微服务架构构建后端系统。',
    category: ProjectCategory.IOT,
    tags: ['IoT', '智能家居', 'MQTT', '微服务'],
    status: ProjectStatus.PLANNING,
    technologies: ['Node.js', 'MQTT', 'MongoDB', 'Docker', 'Raspberry Pi'],
    githubUrl: 'https://github.com/example/smart-home',
    featured: false,
    createdAt: '2024-02-15T11:00:00Z',
    updatedAt: '2024-02-15T11:00:00Z'
  }
]

export const useProjects = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      filter: {},
      isLoading: false,
      error: null,
      isSyncing: false,
      lastSyncTime: null,

      // 云端同步操作
      fetchProjects: async () => {
        const auth = useAuth.getState()
        if (!auth.session) {
          set({ error: '用户未登录' })
          return
        }

        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/projects', {
            headers: {
              'Authorization': `Bearer ${auth.session.access_token}`,
            },
          })

          if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
          }

          const projects: DatabaseProject[] = await response.json()

          // 转换数据库格式到前端格式
          const frontendProjects: Project[] = projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            content: project.content,
            category: project.category as any,
            tags: project.tags,
            status: project.status as any,
            technologies: project.technologies,
            githubUrl: project.github_url,
            demoUrl: project.demo_url,
            imageUrl: project.image_url,
            featured: project.featured,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
          }))

          set({
            projects: frontendProjects,
            lastSyncTime: new Date()
          })
        } catch (error) {
          console.error('获取项目列表失败:', error)
          set({ error: '获取项目列表失败' })
        } finally {
          set({ isLoading: false })
        }
      },

      fetchFeaturedProjects: async () => {
        set({ isLoading: true, error: null })

        try {
          const response = await fetch('/api/projects?featured=true')

          if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
          }

          const projects: DatabaseProject[] = await response.json()

          // 转换数据库格式到前端格式
          const frontendProjects: Project[] = projects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            content: project.content,
            category: project.category as any,
            tags: project.tags,
            status: project.status as any,
            technologies: project.technologies,
            githubUrl: project.github_url,
            demoUrl: project.demo_url,
            imageUrl: project.image_url,
            featured: project.featured,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
          }))

          set({
            projects: frontendProjects,
            lastSyncTime: new Date()
          })
        } catch (error) {
          console.error('获取精选项目失败:', error)
          set({ error: '获取精选项目失败' })
        } finally {
          set({ isLoading: false })
        }
      },

      syncProjects: async () => {
        set({ isSyncing: true, error: null })
        const auth = useAuth.getState()
        if (auth.session) {
          await get().fetchProjects()
        } else {
          await get().fetchFeaturedProjects()
        }
        set({ isSyncing: false })
      },

      setProjects: (projects) => set({ projects }),

      addProject: async (projectData) => {
        const auth = useAuth.getState()
        if (!auth.session) {
          set({ error: '用户未登录' })
          return
        }

        set({ error: null })

        try {
          const response = await fetch('/api/projects', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.session.access_token}`,
            },
            body: JSON.stringify(projectData),
          })

          if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
          }

          const newProject: DatabaseProject = await response.json()

          // 转换为前端格式
          const frontendProject: Project = {
            id: newProject.id,
            title: newProject.title,
            description: newProject.description,
            content: newProject.content,
            category: newProject.category as any,
            tags: newProject.tags,
            status: newProject.status as any,
            technologies: newProject.technologies,
            githubUrl: newProject.github_url,
            demoUrl: newProject.demo_url,
            imageUrl: newProject.image_url,
            featured: newProject.featured,
            createdAt: newProject.created_at,
            updatedAt: newProject.updated_at,
          }

          set((state) => ({
            projects: [...state.projects, frontendProject],
          }))
        } catch (error) {
          console.error('创建项目失败:', error)
          set({ error: '创建项目失败' })
        }
      },

      updateProject: async (id, projectData) => {
        const auth = useAuth.getState()
        if (!auth.session) {
          set({ error: '用户未登录' })
          return
        }

        set({ error: null })

        try {
          const response = await fetch(`/api/projects/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${auth.session.access_token}`,
            },
            body: JSON.stringify(projectData),
          })

          if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
          }

          const updatedProject: DatabaseProject = await response.json()

          // 转换为前端格式
          const frontendProject: Project = {
            id: updatedProject.id,
            title: updatedProject.title,
            description: updatedProject.description,
            content: updatedProject.content,
            category: updatedProject.category as any,
            tags: updatedProject.tags,
            status: updatedProject.status as any,
            technologies: updatedProject.technologies,
            githubUrl: updatedProject.github_url,
            demoUrl: updatedProject.demo_url,
            imageUrl: updatedProject.image_url,
            featured: updatedProject.featured,
            createdAt: updatedProject.created_at,
            updatedAt: updatedProject.updated_at,
          }

          set((state) => ({
            projects: state.projects.map((project) =>
              project.id === id ? frontendProject : project
            ),
          }))
        } catch (error) {
          console.error('更新项目失败:', error)
          set({ error: '更新项目失败' })
        }
      },

      deleteProject: async (id) => {
        const auth = useAuth.getState()
        if (!auth.session) {
          set({ error: '用户未登录' })
          return
        }

        set({ error: null })

        try {
          const response = await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${auth.session.access_token}`,
            },
          })

          if (!response.ok) {
            const error = await response.text()
            throw new Error(error)
          }

          set((state) => ({
            projects: state.projects.filter((project) => project.id !== id),
          }))
        } catch (error) {
          console.error('删除项目失败:', error)
          set({ error: '删除项目失败' })
        }
      },

      toggleFeatured: async (id) => {
        const project = get().projects.find(p => p.id === id)
        if (!project) return

        await get().updateProject(id, { featured: !project.featured })
      },

      setFilter: (newFilter) => {
        set((state) => ({
          filter: { ...state.filter, ...newFilter },
        }))
      },

      clearFilter: () => {
        set({ filter: {} })
      },

      filteredProjects: () => {
        const { projects, filter } = get()
        return projects.filter((project) => {
          if (filter.category && project.category !== filter.category) return false
          if (filter.status && project.status !== filter.status) return false
          if (filter.featured !== undefined && project.featured !== filter.featured) return false
          if (filter.search) {
            const searchLower = filter.search.toLowerCase()
            const titleMatch = project.title.toLowerCase().includes(searchLower)
            const descriptionMatch = project.description.toLowerCase().includes(searchLower)
            const tagsMatch = project.tags.some(tag => tag.toLowerCase().includes(searchLower))
            const technologiesMatch = project.technologies.some(tech => tech.toLowerCase().includes(searchLower))
            if (!titleMatch && !descriptionMatch && !tagsMatch && !technologiesMatch) return false
          }
          if (filter.tags && filter.tags.length > 0) {
            const hasAllTags = filter.tags.every(tag => project.tags.includes(tag))
            if (!hasAllTags) return false
          }
          return true
        })
      },

      getProjectById: (id) => {
        const { projects } = get()
        return projects.find((project) => project.id === id)
      },

      getFeaturedProjects: () => {
        const { projects } = get()
        return projects.filter((project) => project.featured)
      },

      getProjectsByCategory: (category) => {
        const { projects } = get()
        return projects.filter((project) => project.category === category)
      },

      getProjectsByStatus: (status) => {
        const { projects } = get()
        return projects.filter((project) => project.status === status)
      },

      getProjectStats: () => {
        const { projects } = get()
        return {
          total: projects.length,
          completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
          inProgress: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
          planning: projects.filter(p => p.status === ProjectStatus.PLANNING).length,
          featured: projects.filter(p => p.featured).length,
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'projects-storage',
    }
  )
)