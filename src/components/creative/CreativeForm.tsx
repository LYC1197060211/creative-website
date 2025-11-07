'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Modal, Badge } from '@/components/ui'
import { CreativeIdea } from '@/types'
import { useCreativeIdeas } from '@/hooks/useCreativeIdeas'
import { aiService } from '@/lib/ai'
import { X, Plus, Tag, Calendar, Flag, Sparkles, AlertCircle } from 'lucide-react'

interface CreativeFormProps {
  isOpen: boolean
  onClose: () => void
  ideaId?: string // 如果提供，则为编辑模式
}

const CATEGORIES = [
  'Web开发',
  '移动应用',
  'AI应用',
  '数据分析',
  '开源项目',
  '学习笔记',
  '产品设计',
  '其他'
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: '低优先级', color: 'default' },
  { value: 'medium', label: '中优先级', color: 'warning' },
  { value: 'high', label: '高优先级', color: 'error' }
]

const STATUS_OPTIONS = [
  { value: 'idea', label: '想法' },
  { value: 'planning', label: '计划中' },
  { value: 'in-progress', label: '进行中' },
  { value: 'completed', label: '已完成' }
]

export const CreativeForm: React.FC<CreativeFormProps> = ({
  isOpen,
  onClose,
  ideaId
}) => {
  const { addIdea, updateIdea, getIdeaById } = useCreativeIdeas()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'idea' as 'idea' | 'planning' | 'in-progress' | 'completed',
    tags: [] as string[],
    techStack: [] as string[],
    estimatedTime: ''
  })
  const [tagInput, setTagInput] = useState('')
  const [techStackInput, setTechStackInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [aiError, setAiError] = useState('')

  // 编辑模式时加载现有数据
  useEffect(() => {
    if (ideaId && isOpen) {
      const idea = getIdeaById(ideaId)
      if (idea) {
        setFormData({
          title: idea.title,
          description: idea.description,
          category: idea.category,
          priority: idea.priority,
          status: idea.status,
          tags: idea.tags,
          techStack: idea.techStack || [],
          estimatedTime: idea.estimatedTime || ''
        })
      }
    } else if (isOpen) {
      // 重置表单
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        status: 'idea',
        tags: [],
        techStack: [],
        estimatedTime: ''
      })
      setTagInput('')
      setTechStackInput('')
    }
  }, [ideaId, isOpen, getIdeaById])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (ideaId) {
        // 编辑模式
        await updateIdea(ideaId, formData)
      } else {
        // 创建模式
        await addIdea(formData)
      }

      onClose()
    } catch (error) {
      console.error('保存创意失败:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addTechStack = () => {
    if (techStackInput.trim() && !formData.techStack.includes(techStackInput.trim())) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, techStackInput.trim()]
      }))
      setTechStackInput('')
    }
  }

  const removeTechStack = (techToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(tech => tech !== techToRemove)
    }))
  }

  const handleAIOptimize = async () => {
    if (!formData.title.trim() && !formData.description.trim()) {
      setAiError('请先填写标题或描述内容')
      return
    }

    setIsOptimizing(true)
    setAiError('')

    try {
      const response = await aiService.optimizeIdea(formData)

      if (response.success && response.data) {
        // 解析AI建议并更新表单
        const aiSuggestions = response.data

        // 这里可以添加更智能的解析逻辑来提取具体的建议
        // 目前将AI建议保存到description字段进行优化
        setFormData(prev => ({
          ...prev,
          description: prev.description + '\n\nAI优化建议：\n' + aiSuggestions
        }))
      } else {
        setAiError(response.error || 'AI优化失败')
      }
    } catch (err) {
      setAiError('优化过程中发生错误')
    } finally {
      setIsOptimizing(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={ideaId ? '编辑创意' : '创建新创意'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="space-y-4">
          <Input
            label="创意标题"
            placeholder="给您的创意起个名字"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              详细描述
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={4}
              placeholder="详细描述您的创意想法..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>
        </div>

        {/* 分类和优先级 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              分类
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
            >
              <option value="">选择分类</option>
              {CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              优先级
            </label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority: option.value as any }))}
                  className={`flex-1 px-3 py-2 rounded-lg border-2 transition-colors ${
                    formData.priority === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Flag className="inline h-4 w-4 mr-1" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 状态 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            状态
          </label>
          <div className="flex flex-wrap gap-2">
            {STATUS_OPTIONS.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, status: option.value as any }))}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  formData.status === option.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 标签 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Tag className="inline h-4 w-4 mr-1" />
            标签
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="添加标签..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <Badge key={tag} variant="primary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* 技术栈 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            技术栈（可选）
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="添加技术栈..."
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechStack())}
            />
            <Button type="button" onClick={addTechStack} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.techStack.map(tech => (
              <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechStack(tech)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* 预计时间 */}
        <Input
          label="预计完成时间（可选）"
          placeholder="例如：2周、1个月"
          value={formData.estimatedTime}
          onChange={(e) => setFormData(prev => ({ ...prev, estimatedTime: e.target.value }))}
        />

        {/* AI优化功能 */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              AI 智能优化
            </h4>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAIOptimize}
              loading={isOptimizing}
              disabled={isOptimizing || (!formData.title.trim() && !formData.description.trim())}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isOptimizing ? 'AI分析中...' : 'AI优化建议'}
            </Button>
          </div>

          {aiError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">{aiError}</p>
              </div>
            </div>
          )}

          {formData.description.includes('AI优化建议：') && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="font-medium text-blue-900 mb-2">AI优化建议已添加到描述中</h5>
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-600">
                  💡 AI优化建议已添加到描述字段中，您可以根据需要进行调整
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" loading={isLoading} disabled={isLoading}>
            {isLoading ? '保存中...' : (ideaId ? '更新创意' : '创建创意')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}