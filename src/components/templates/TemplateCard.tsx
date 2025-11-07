'use client'

import { useState } from 'react'
import { Template } from '@/types/template'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Rating } from './Rating'

interface TemplateCardProps {
  template: Template
  viewMode: 'grid' | 'list'
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleFeatured: (id: string) => void
  onUse: (id: string) => void
}

const categoryLabels = {
  web_development: 'Web开发',
  mobile_app: '移动应用',
  ai_ml: 'AI/机器学习',
  blockchain: '区块链',
  iot: '物联网',
  game: '游戏开发',
  data_science: '数据科学',
  cloud_computing: '云计算',
  devops: 'DevOps',
  ui_ux: 'UI/UX设计',
  other: '其他',
}

const difficultyLabels = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
  expert: '专家级',
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-blue-100 text-blue-800',
  advanced: 'bg-orange-100 text-orange-800',
  expert: 'bg-red-100 text-red-800',
}

export function TemplateCard({ template, viewMode, onEdit, onDelete, onToggleFeatured, onUse }: TemplateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleEdit = () => {
    onEdit(template.id)
  }

  const handleDelete = () => {
    onDelete(template.id)
  }

  const handleToggleFeatured = () => {
    onToggleFeatured(template.id)
  }

  const handleUse = () => {
    onUse(template.id)
  }

  if (viewMode === 'list') {
    return (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start space-x-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {template.title}
                  </h3>
                  {template.featured && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      ⭐ 精选
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span>{categoryLabels[template.category]}</span>
                  <span>•</span>
                  <Badge className={difficultyColors[template.difficulty]}>
                    {difficultyLabels[template.difficulty]}
                  </Badge>
                  <span>•</span>
                  <span>{template.estimatedTime}</span>
                  <span>•</span>
                  <span>作者: {template.author}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <Rating rating={template.rating} readonly />
                  <span>({template.reviewCount} 评价)</span>
                  <span>{template.usageCount} 次使用</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>
                {template.prerequisites.length > 0 && (
                  <div className="text-sm text-gray-600 mb-2">
                    <strong>前置要求:</strong> {template.prerequisites.join(', ')}
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleToggleFeatured}
                  title={template.featured ? '取消精选' : '设为精选'}
                >
                  {template.featured ? '⭐' : '☆'}
                </Button>
                <Button size="sm" onClick={handleUse}>
                  使用模板
                </Button>
                <Button variant="secondary" size="sm" onClick={handleEdit}>
                  编辑
                </Button>
                <Button variant="secondary" size="sm" onClick={handleDelete}>
                  删除
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {template.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFeatured}
            className="p-1"
            title={template.featured ? '取消精选' : '设为精选'}
          >
            {template.featured ? '⭐' : '☆'}
          </Button>
        </div>

        {template.featured && (
          <div className="mb-3">
            <Badge className="bg-yellow-100 text-yellow-800">
              ⭐ 精选模板
            </Badge>
          </div>
        )}

        <p className="text-gray-600 mb-4 line-clamp-3">
          {template.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge className={difficultyColors[template.difficulty]}>
              {difficultyLabels[template.difficulty]}
            </Badge>
            <span className="text-xs text-gray-500">
              {template.estimatedTime}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {categoryLabels[template.category]}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Rating rating={template.rating} readonly />
            <span>({template.reviewCount})</span>
            <span>•</span>
            <span>{template.usageCount} 次使用</span>
          </div>
          <div className="text-xs text-gray-500">
            作者: {template.author}
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {template.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {template.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{template.tags.length - 3}
            </Badge>
          )}
        </div>

        {template.prerequisites.length > 0 && (
          <div className="text-sm text-gray-600 mb-4">
            <strong>前置要求:</strong>
            <div className="mt-1">
              {template.prerequisites.slice(0, 2).map((prereq, index) => (
                <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1">
                  {prereq}
                </span>
              ))}
              {template.prerequisites.length > 2 && (
                <span className="text-xs text-gray-500">
                  +{template.prerequisites.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1 mb-4">
          {template.learningObjectives.slice(0, 2).map((objective, index) => (
            <div key={index} className="text-xs text-gray-600 flex items-center">
              <span className="text-green-500 mr-1">✓</span>
              {objective.length > 30 ? `${objective.substring(0, 30)}...` : objective}
            </div>
          ))}
          {template.learningObjectives.length > 2 && (
            <div className="text-xs text-gray-500">
              +{template.learningObjectives.length - 2} 个学习目标
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Button size="sm" onClick={handleUse} className="flex-1">
            使用模板
          </Button>
          <Button variant="secondary" size="sm" onClick={handleEdit}>
            编辑
          </Button>
          <Button variant="secondary" size="sm" onClick={handleDelete}>
            删除
          </Button>
        </div>
      </div>
    </Card>
  )
}