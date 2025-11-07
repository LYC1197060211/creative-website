'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Template,
  TemplateFilter,
  TemplateFormData,
  TemplateCategory,
  TemplateDifficulty,
  TemplateReview
} from '@/types/template'

interface TemplateStore {
  templates: Template[]
  reviews: TemplateReview[]
  filter: TemplateFilter
  isLoading: boolean

  // Actions
  setTemplates: (templates: Template[]) => void
  addTemplate: (template: TemplateFormData) => void
  updateTemplate: (id: string, template: Partial<TemplateFormData>) => void
  deleteTemplate: (id: string) => void
  toggleFeatured: (id: string) => void
  incrementUsage: (id: string) => void
  setFilter: (filter: Partial<TemplateFilter>) => void
  clearFilter: () => void
  addReview: (review: Omit<TemplateReview, 'id' | 'createdAt'>) => void
  updateReview: (id: string, review: Partial<TemplateReview>) => void
  deleteReview: (id: string) => void

  // Getters
  filteredTemplates: () => Template[]
  getTemplateById: (id: string) => Template | undefined
  getFeaturedTemplates: () => Template[]
  getTemplatesByCategory: (category: TemplateCategory) => Template[]
  getTemplatesByDifficulty: (difficulty: TemplateDifficulty) => Template[]
  getTemplateStats: () => {
    total: number
    featured: number
    categories: Record<string, number>
    difficulties: Record<string, number>
    averageRating: number
  }
  getTemplateReviews: (templateId: string) => TemplateReview[]
  getTemplateAverageRating: (templateId: string) => number
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const sampleTemplates: Template[] = [
  {
    id: '1',
    title: 'Next.js 全栈开发指南',
    description: '从零开始学习使用 Next.js 构建现代化的全栈 Web 应用程序',
    content: `# Next.js 全栈开发指南

本指南将带你从零开始学习使用 Next.js 构建现代化的全栈 Web 应用程序。

## 目录
1. Next.js 简介
2. 环境搭建
3. 基础概念
4. 路由系统
5. 数据获取
6. API 路由
7. 部署上线

## Next.js 简介
Next.js 是一个基于 React 的全栈框架，提供了以下核心功能：
- 服务器端渲染 (SSR)
- 静态站点生成 (SSG)
- API 路由
- 自动代码分割
- 图片优化
- 内置 CSS 支持

## 环境搭建
\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## 基础概念
- 页面和布局
- 动态路由
- 中间件
- 客户端导航`,
    category: TemplateCategory.WEB_DEVELOPMENT,
    tags: ['Next.js', 'React', '全栈开发', 'TypeScript'],
    difficulty: TemplateDifficulty.INTERMEDIATE,
    estimatedTime: '2-3周',
    prerequisites: ['HTML/CSS基础', 'JavaScript基础', 'React基础'],
    learningObjectives: [
      '掌握Next.js的核心概念',
      '学会构建SSR和SSG应用',
      '理解API路由的使用',
      '学会部署Next.js应用'
    ],
    resources: [
      {
        id: '1',
        title: 'Next.js 官方文档',
        type: 'documentation',
        url: 'https://nextjs.org/docs',
        description: 'Next.js 官方文档是最权威的学习资源'
      },
      {
        id: '2',
        title: 'React 基础教程',
        type: 'course',
        url: 'https://react.dev/learn',
        description: '学习React基础知识'
      }
    ],
    rating: 4.8,
    reviewCount: 24,
    usageCount: 156,
    featured: true,
    author: '技术专家',
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-15T15:30:00Z'
  },
  {
    id: '2',
    title: 'Python 数据科学入门',
    description: '使用 Python 进行数据分析和可视化的完整教程',
    content: `# Python 数据科学入门

本教程将教你如何使用 Python 进行数据科学工作，包括数据清洗、分析和可视化。

## 主要工具
- NumPy: 数值计算
- Pandas: 数据处理
- Matplotlib: 数据可视化
- Scikit-learn: 机器学习

## 学习路径
1. Python 基础回顾
2. NumPy 数组操作
3. Pandas 数据处理
4. 数据可视化
5. 统计分析基础`,
    category: TemplateCategory.DATA_SCIENCE,
    tags: ['Python', '数据科学', 'Pandas', 'NumPy'],
    difficulty: TemplateDifficulty.BEGINNER,
    estimatedTime: '1-2周',
    prerequisites: ['Python基础编程', '基础统计学概念'],
    learningObjectives: [
      '掌握NumPy数组操作',
      '学会使用Pandas处理数据',
      '创建数据可视化图表',
      '进行基础统计分析'
    ],
    resources: [
      {
        id: '3',
        title: 'Python for Data Analysis',
        type: 'book',
        description: 'Wes McKinney 编著的Pandas权威指南'
      },
      {
        id: '4',
        title: 'Kaggle Learn',
        type: 'course',
        url: 'https://www.kaggle.com/learn',
        description: '免费的在线数据科学课程'
      }
    ],
    rating: 4.6,
    reviewCount: 18,
    usageCount: 89,
    featured: true,
    author: '数据科学团队',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-25T14:20:00Z'
  },
  {
    id: '3',
    title: 'React Native 移动应用开发',
    description: '使用 React Native 开发跨平台移动应用程序的实战教程',
    content: `# React Native 移动应用开发

学习使用 React Native 构建iOS和Android移动应用。

## 课程大纲
1. React Native 环境搭建
2. 组件和样式
3. 导航系统
4. 状态管理
5. 原生模块集成
6. 应用发布

## 核心概念
- 组件生命周期
- 样式系统
- 手势处理
- 性能优化`,
    category: TemplateCategory.MOBILE_APP,
    tags: ['React Native', '移动开发', 'iOS', 'Android'],
    difficulty: TemplateDifficulty.INTERMEDIATE,
    estimatedTime: '3-4周',
    prerequisites: ['React基础', 'JavaScript ES6+', '移动开发基础概念'],
    learningObjectives: [
      '搭建React Native开发环境',
      '创建跨平台移动应用',
      '实现导航和路由',
      '集成原生功能'
    ],
    resources: [
      {
        id: '5',
        title: 'React Native 官方文档',
        type: 'documentation',
        url: 'https://reactnative.dev/docs/getting-started',
        description: 'React Native 官方学习资源'
      }
    ],
    rating: 4.5,
    reviewCount: 12,
    usageCount: 67,
    featured: false,
    author: '移动开发专家',
    createdAt: '2024-02-01T11:00:00Z',
    updatedAt: '2024-02-05T16:45:00Z'
  }
]

const sampleReviews: TemplateReview[] = [
  {
    id: '1',
    templateId: '1',
    userId: 'user1',
    rating: 5,
    comment: '非常棒的Next.js教程，内容详尽，实例丰富！',
    createdAt: '2024-01-18T10:00:00Z'
  },
  {
    id: '2',
    templateId: '1',
    userId: 'user2',
    rating: 4,
    comment: '内容很好，但希望能增加更多高级主题',
    createdAt: '2024-01-19T15:30:00Z'
  }
]

export const useTemplates = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: sampleTemplates,
      reviews: sampleReviews,
      filter: {},
      isLoading: false,

      setTemplates: (templates) => set({ templates }),

      addTemplate: (templateData) => {
        const newTemplate: Template = {
          id: generateId(),
          ...templateData,
          rating: 0,
          reviewCount: 0,
          usageCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          templates: [...state.templates, newTemplate],
        }))
      },

      updateTemplate: (id, templateData) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? {
                  ...template,
                  ...templateData,
                  updatedAt: new Date().toISOString(),
                }
              : template
          ),
        }))
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((template) => template.id !== id),
          reviews: state.reviews.filter((review) => review.templateId !== id),
        }))
      },

      toggleFeatured: (id) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? { ...template, featured: !template.featured, updatedAt: new Date().toISOString() }
              : template
          ),
        }))
      },

      incrementUsage: (id) => {
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === id
              ? { ...template, usageCount: template.usageCount + 1 }
              : template
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

      addReview: (reviewData) => {
        const newReview: TemplateReview = {
          id: generateId(),
          ...reviewData,
          createdAt: new Date().toISOString(),
        }

        set((state) => {
          // Add review
          const updatedReviews = [...state.reviews, newReview]

          // Update template rating
          const templateReviews = updatedReviews.filter(r => r.templateId === reviewData.templateId)
          const averageRating = templateReviews.reduce((sum, r) => sum + r.rating, 0) / templateReviews.length

          const updatedTemplates = state.templates.map(template =>
            template.id === reviewData.templateId
              ? {
                  ...template,
                  rating: averageRating,
                  reviewCount: templateReviews.length
                }
              : template
          )

          return {
            reviews: updatedReviews,
            templates: updatedTemplates,
          }
        })
      },

      updateReview: (id, reviewData) => {
        set((state) => {
          const updatedReviews = state.reviews.map(review =>
            review.id === id
              ? { ...review, ...reviewData }
              : review
          )

          // Recalculate template rating if rating changed
          const review = state.reviews.find(r => r.id === id)
          if (review && reviewData.rating !== undefined) {
            const templateReviews = updatedReviews.filter(r => r.templateId === review.templateId)
            const averageRating = templateReviews.reduce((sum, r) => sum + r.rating, 0) / templateReviews.length

            const updatedTemplates = state.templates.map(template =>
              template.id === review.templateId
                ? {
                    ...template,
                    rating: averageRating
                  }
                : template
            )

            return {
              reviews: updatedReviews,
              templates: updatedTemplates,
            }
          }

          return { reviews: updatedReviews }
        })
      },

      deleteReview: (id) => {
        set((state) => {
          const review = state.reviews.find(r => r.id === id)
          const updatedReviews = state.reviews.filter(r => r.id !== id)

          if (review) {
            const templateReviews = updatedReviews.filter(r => r.templateId === review.templateId)
            const averageRating = templateReviews.length > 0
              ? templateReviews.reduce((sum, r) => sum + r.rating, 0) / templateReviews.length
              : 0

            const updatedTemplates = state.templates.map(template =>
              template.id === review.templateId
                ? {
                    ...template,
                    rating: averageRating,
                    reviewCount: templateReviews.length
                  }
                : template
            )

            return {
              reviews: updatedReviews,
              templates: updatedTemplates,
            }
          }

          return { reviews: updatedReviews }
        })
      },

      filteredTemplates: () => {
        const { templates, filter } = get()
        return templates.filter((template) => {
          if (filter.category && template.category !== filter.category) return false
          if (filter.difficulty && template.difficulty !== filter.difficulty) return false
          if (filter.featured !== undefined && template.featured !== filter.featured) return false
          if (filter.minRating && template.rating < filter.minRating) return false
          if (filter.author && !template.author.toLowerCase().includes(filter.author.toLowerCase())) return false
          if (filter.search) {
            const searchLower = filter.search.toLowerCase()
            const titleMatch = template.title.toLowerCase().includes(searchLower)
            const descriptionMatch = template.description.toLowerCase().includes(searchLower)
            const tagsMatch = template.tags.some(tag => tag.toLowerCase().includes(searchLower))
            const authorMatch = template.author.toLowerCase().includes(searchLower)
            if (!titleMatch && !descriptionMatch && !tagsMatch && !authorMatch) return false
          }
          if (filter.tags && filter.tags.length > 0) {
            const hasAllTags = filter.tags.every(tag => template.tags.includes(tag))
            if (!hasAllTags) return false
          }
          return true
        })
      },

      getTemplateById: (id) => {
        const { templates } = get()
        return templates.find((template) => template.id === id)
      },

      getFeaturedTemplates: () => {
        const { templates } = get()
        return templates.filter((template) => template.featured)
      },

      getTemplatesByCategory: (category) => {
        const { templates } = get()
        return templates.filter((template) => template.category === category)
      },

      getTemplatesByDifficulty: (difficulty) => {
        const { templates } = get()
        return templates.filter((template) => template.difficulty === difficulty)
      },

      getTemplateStats: () => {
        const { templates } = get()
        const categories: Record<string, number> = {}
        const difficulties: Record<string, number> = {}

        templates.forEach(template => {
          categories[template.category] = (categories[template.category] || 0) + 1
          difficulties[template.difficulty] = (difficulties[template.difficulty] || 0) + 1
        })

        const totalRating = templates.reduce((sum, t) => sum + t.rating, 0)
        const averageRating = templates.length > 0 ? totalRating / templates.length : 0

        return {
          total: templates.length,
          featured: templates.filter(t => t.featured).length,
          categories,
          difficulties,
          averageRating: Number(averageRating.toFixed(1))
        }
      },

      getTemplateReviews: (templateId) => {
        const { reviews } = get()
        return reviews.filter(review => review.templateId === templateId)
      },

      getTemplateAverageRating: (templateId) => {
        const { reviews } = get()
        const templateReviews = reviews.filter(review => review.templateId === templateId)
        if (templateReviews.length === 0) return 0
        const sum = templateReviews.reduce((acc, review) => acc + review.rating, 0)
        return sum / templateReviews.length
      },
    }),
    {
      name: 'templates-storage',
    }
  )
)