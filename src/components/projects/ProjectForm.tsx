'use client'

import { useState, useEffect } from 'react'
import { Project, ProjectFormData, ProjectCategory, ProjectStatus } from '@/types/project'
import { useProjects } from '@/hooks/useProjects'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

interface ProjectFormProps {
  projectId?: string
  onSubmit: (data: ProjectFormData) => void
  onCancel: () => void
}

const categoryOptions = [
  { value: ProjectCategory.WEB_DEVELOPMENT, label: 'Web开发' },
  { value: ProjectCategory.MOBILE_APP, label: '移动应用' },
  { value: ProjectCategory.AI_ML, label: 'AI/机器学习' },
  { value: ProjectCategory.BLOCKCHAIN, label: '区块链' },
  { value: ProjectCategory.IOT, label: '物联网' },
  { value: ProjectCategory.GAME, label: '游戏开发' },
  { value: ProjectCategory.OTHER, label: '其他' },
]

const statusOptions = [
  { value: ProjectStatus.PLANNING, label: '规划中' },
  { value: ProjectStatus.IN_PROGRESS, label: '进行中' },
  { value: ProjectStatus.COMPLETED, label: '已完成' },
  { value: ProjectStatus.ON_HOLD, label: '暂停' },
  { value: ProjectStatus.CANCELLED, label: '已取消' },
]

export function ProjectForm({ projectId, onSubmit, onCancel }: ProjectFormProps) {
  const { getProjectById } = useProjects()
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    content: '',
    category: ProjectCategory.WEB_DEVELOPMENT,
    tags: [],
    status: ProjectStatus.PLANNING,
    technologies: [],
    githubUrl: '',
    demoUrl: '',
    imageUrl: '',
    featured: false,
  })
  const [tagInput, setTagInput] = useState('')
  const [techInput, setTechInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (projectId) {
      const project = getProjectById(projectId)
      if (project) {
        setFormData({
          title: project.title,
          description: project.description,
          content: project.content,
          category: project.category,
          tags: project.tags,
          status: project.status,
          technologies: project.technologies,
          githubUrl: project.githubUrl || '',
          demoUrl: project.demoUrl || '',
          imageUrl: project.imageUrl || '',
          featured: project.featured,
        })
      }
    }
  }, [projectId, getProjectById])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = '项目标题不能为空'
    }
    if (!formData.description.trim()) {
      newErrors.description = '项目描述不能为空'
    }
    if (!formData.content.trim()) {
      newErrors.content = '项目内容不能为空'
    }
    if (formData.tags.length === 0) {
      newErrors.tags = '至少需要添加一个标签'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }))
      setTagInput('')
      if (errors.tags) {
        setErrors(prev => ({ ...prev, tags: '' }))
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addTechnology = () => {
    const trimmedTech = techInput.trim()
    if (trimmedTech && !formData.technologies.includes(trimmedTech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, trimmedTech]
      }))
      setTechInput('')
    }
  }

  const removeTechnology = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          项目标题 *
        </label>
        <Input
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="输入项目标题"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          项目描述 *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="简要描述你的项目"
          rows={3}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : ''
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          项目内容 *
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="详细描述项目的背景、功能、技术特点等"
          rows={6}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.content ? 'border-red-500' : ''
          }`}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            项目分类
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            项目状态
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          项目标签 *
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="添加标签"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag}>添加</Button>
        </div>
        {errors.tags && (
          <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          技术栈
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.technologies.map(tech => (
            <span
              key={tech}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
            >
              {tech}
              <button
                type="button"
                onClick={() => removeTechnology(tech)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="添加技术栈"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
          />
          <Button type="button" onClick={addTechnology}>添加</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GitHub 链接
          </label>
          <Input
            value={formData.githubUrl}
            onChange={(e) => handleInputChange('githubUrl', e.target.value)}
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            在线演示链接
          </label>
          <Input
            value={formData.demoUrl}
            onChange={(e) => handleInputChange('demoUrl', e.target.value)}
            placeholder="https://demo.example.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          项目封面图链接
        </label>
        <Input
          value={formData.imageUrl}
          onChange={(e) => handleInputChange('imageUrl', e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) => handleInputChange('featured', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
          设为精选项目
        </label>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          {projectId ? '更新项目' : '创建项目'}
        </Button>
      </div>
    </form>
  )
}