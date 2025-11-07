'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Project, ProjectFilter, ProjectFormData, ProjectCategory, ProjectStatus } from '@/types/project'

interface ProjectStore {
  projects: Project[]
  filter: ProjectFilter
  isLoading: boolean

  // Actions
  setProjects: (projects: Project[]) => void
  addProject: (project: ProjectFormData) => void
  updateProject: (id: string, project: Partial<ProjectFormData>) => void
  deleteProject: (id: string) => void
  toggleFeatured: (id: string) => void
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
      projects: sampleProjects,
      filter: {},
      isLoading: false,

      setProjects: (projects) => set({ projects }),

      addProject: (projectData) => {
        const newProject: Project = {
          id: generateId(),
          ...projectData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          projects: [...state.projects, newProject],
        }))
      },

      updateProject: (id, projectData) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? {
                  ...project,
                  ...projectData,
                  updatedAt: new Date().toISOString(),
                }
              : project
          ),
        }))
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        }))
      },

      toggleFeatured: (id) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, featured: !project.featured, updatedAt: new Date().toISOString() }
              : project
          ),
        }))
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
    }),
    {
      name: 'projects-storage',
    }
  )
)