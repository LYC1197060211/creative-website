'use client'

import { useState, useEffect } from 'react'
import { Template, TemplateFormData, TemplateCategory, TemplateDifficulty, TemplateResource, ResourceType } from '@/types/template'
import { useTemplates } from '@/hooks/useTemplates'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'

interface TemplateFormProps {
  templateId?: string
  onSubmit: (data: TemplateFormData) => void
  onCancel: () => void
}

const categoryOptions = [
  { value: TemplateCategory.WEB_DEVELOPMENT, label: 'Web开发' },
  { value: TemplateCategory.MOBILE_APP, label: '移动应用' },
  { value: TemplateCategory.AI_ML, label: 'AI/机器学习' },
  { value: TemplateCategory.BLOCKCHAIN, label: '区块链' },
  { value: TemplateCategory.IOT, label: '物联网' },
  { value: TemplateCategory.GAME, label: '游戏开发' },
  { value: TemplateCategory.DATA_SCIENCE, label: '数据科学' },
  { value: TemplateCategory.CLOUD_COMPUTING, label: '云计算' },
  { value: TemplateCategory.DEVOPS, label: 'DevOps' },
  { value: TemplateCategory.UI_UX, label: 'UI/UX设计' },
  { value: TemplateCategory.OTHER, label: '其他' },
]

const difficultyOptions = [
  { value: TemplateDifficulty.BEGINNER, label: '初级' },
  { value: TemplateDifficulty.INTERMEDIATE, label: '中级' },
  { value: TemplateDifficulty.ADVANCED, label: '高级' },
  { value: TemplateDifficulty.EXPERT, label: '专家级' },
]

const resourceTypeOptions = [
  { value: ResourceType.DOCUMENTATION, label: '文档' },
  { value: ResourceType.VIDEO, label: '视频' },
  { value: ResourceType.ARTICLE, label: '文章' },
  { value: ResourceType.CODE_EXAMPLE, label: '代码示例' },
  { value: ResourceType.TOOL, label: '工具' },
  { value: ResourceType.BOOK, label: '书籍' },
  { value: ResourceType.COURSE, label: '课程' },
]

export function TemplateForm({ templateId, onSubmit, onCancel }: TemplateFormProps) {
  const { getTemplateById } = useTemplates()
  const [formData, setFormData] = useState<TemplateFormData>({
    title: '',
    description: '',
    content: '',
    category: TemplateCategory.WEB_DEVELOPMENT,
    tags: [],
    difficulty: TemplateDifficulty.BEGINNER,
    estimatedTime: '',
    prerequisites: [],
    learningObjectives: [],
    resources: [],
    featured: false,
    author: '技术专家',
  })

  const [tagInput, setTagInput] = useState('')
  const [prereqInput, setPrereqInput] = useState('')
  const [objectiveInput, setObjectiveInput] = useState('')
  const [newResource, setNewResource] = useState<Partial<TemplateResource>>({
    title: '',
    type: ResourceType.DOCUMENTATION,
    url: '',
    content: '',
    description: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (templateId) {
      const template = getTemplateById(templateId)
      if (template) {
        setFormData({
          title: template.title,
          description: template.description,
          content: template.content,
          category: template.category,
          tags: template.tags,
          difficulty: template.difficulty,
          estimatedTime: template.estimatedTime,
          prerequisites: template.prerequisites,
          learningObjectives: template.learningObjectives,
          resources: template.resources,
          featured: template.featured,
          author: template.author,
        })
      }
    }
  }, [templateId, getTemplateById])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = '模板标题不能为空'
    }
    if (!formData.description.trim()) {
      newErrors.description = '模板描述不能为空'
    }
    if (!formData.content.trim()) {
      newErrors.content = '模板内容不能为空'
    }
    if (formData.tags.length === 0) {
      newErrors.tags = '至少需要添加一个标签'
    }
    if (!formData.estimatedTime.trim()) {
      newErrors.estimatedTime = '预估时间不能为空'
    }
    if (formData.prerequisites.length === 0) {
      newErrors.prerequisites = '至少需要添加一个前置要求'
    }
    if (formData.learningObjectives.length === 0) {
      newErrors.learningObjectives = '至少需要添加一个学习目标'
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

  const handleInputChange = (field: keyof TemplateFormData, value: any) => {
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

  const addPrerequisite = () => {
    const trimmedPrereq = prereqInput.trim()
    if (trimmedPrereq && !formData.prerequisites.includes(trimmedPrereq)) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, trimmedPrereq]
      }))
      setPrereqInput('')
      if (errors.prerequisites) {
        setErrors(prev => ({ ...prev, prerequisites: '' }))
      }
    }
  }

  const removePrerequisite = (prereqToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(prereq => prereq !== prereqToRemove)
    }))
  }

  const addObjective = () => {
    const trimmedObjective = objectiveInput.trim()
    if (trimmedObjective && !formData.learningObjectives.includes(trimmedObjective)) {
      setFormData(prev => ({
        ...prev,
        learningObjectives: [...prev.learningObjectives, trimmedObjective]
      }))
      setObjectiveInput('')
      if (errors.learningObjectives) {
        setErrors(prev => ({ ...prev, learningObjectives: '' }))
      }
    }
  }

  const removeObjective = (objectiveToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter(objective => objective !== objectiveToRemove)
    }))
  }

  const addResource = () => {
    if (newResource.title?.trim()) {
      const resource: TemplateResource = {
        id: Math.random().toString(36).substr(2, 9),
        title: newResource.title,
        type: newResource.type || ResourceType.DOCUMENTATION,
        url: newResource.url,
        content: newResource.content,
        description: newResource.description,
      }
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, resource]
      }))
      setNewResource({
        title: '',
        type: ResourceType.DOCUMENTATION,
        url: '',
        content: '',
        description: '',
      })
    }
  }

  const removeResource = (resourceId: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(resource => resource.id !== resourceId)
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-96 overflow-y-auto pr-2">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          模板标题 *
        </label>
        <Input
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="输入模板标题"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          模板描述 *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="简要描述模板内容和用途"
          rows={2}
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
          模板内容 *
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          placeholder="详细的模板内容，可以包括步骤说明、代码示例等"
          rows={4}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.content ? 'border-red-500' : ''
          }`}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            模板分类
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
            难度等级
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {difficultyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            预估完成时间 *
          </label>
          <Input
            value={formData.estimatedTime}
            onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
            placeholder="例如: 2-3周"
            className={errors.estimatedTime ? 'border-red-500' : ''}
          />
          {errors.estimatedTime && (
            <p className="mt-1 text-sm text-red-600">{errors.estimatedTime}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          模板标签 *
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
          前置要求 *
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.prerequisites.map(prereq => (
            <span
              key={prereq}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
            >
              {prereq}
              <button
                type="button"
                onClick={() => removePrerequisite(prereq)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={prereqInput}
            onChange={(e) => setPrereqInput(e.target.value)}
            placeholder="添加前置要求"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
          />
          <Button type="button" onClick={addPrerequisite}>添加</Button>
        </div>
        {errors.prerequisites && (
          <p className="mt-1 text-sm text-red-600">{errors.prerequisites}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          学习目标 *
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.learningObjectives.map(objective => (
            <span
              key={objective}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
            >
              {objective.length > 20 ? `${objective.substring(0, 20)}...` : objective}
              <button
                type="button"
                onClick={() => removeObjective(objective)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={objectiveInput}
            onChange={(e) => setObjectiveInput(e.target.value)}
            placeholder="添加学习目标"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
          />
          <Button type="button" onClick={addObjective}>添加</Button>
        </div>
        {errors.learningObjectives && (
          <p className="mt-1 text-sm text-red-600">{errors.learningObjectives}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          作者
        </label>
        <Input
          value={formData.author}
          onChange={(e) => handleInputChange('author', e.target.value)}
          placeholder="模板作者"
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
          设为精选模板
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">
          {templateId ? '更新模板' : '创建模板'}
        </Button>
      </div>
    </form>
  )
}