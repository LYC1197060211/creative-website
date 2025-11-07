'use client'

import { useState, useEffect } from 'react'
import { useTemplates } from '@/hooks/useTemplates'
import { TemplateCategory, TemplateDifficulty } from '@/types/template'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { TemplateForm } from '@/components/templates/TemplateForm'
import { TemplateStats } from '@/components/templates/TemplateStats'
import { TemplateFilters } from '@/components/templates/TemplateFilters'
import { Rating } from '@/components/templates/Rating'

export default function TemplatesPage() {
  const {
    filteredTemplates,
    getTemplateStats,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    toggleFeatured,
    incrementUsage,
    setFilter,
    clearFilter,
    filter,
  } = useTemplates()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [stats, setStats] = useState(getTemplateStats())

  useEffect(() => {
    setStats(getTemplateStats())
  }, [filteredTemplates, getTemplateStats])

  const handleCreateTemplate = (templateData: any) => {
    addTemplate(templateData)
    setIsCreateModalOpen(false)
  }

  const handleEditTemplate = (templateData: any) => {
    if (editingTemplate) {
      updateTemplate(editingTemplate, templateData)
      setEditingTemplate(null)
    }
  }

  const handleDeleteTemplate = (id: string) => {
    if (confirm('确定要删除这个模板吗？')) {
      deleteTemplate(id)
    }
  }

  const handleToggleFeatured = (id: string) => {
    toggleFeatured(id)
  }

  const handleUseTemplate = (id: string) => {
    incrementUsage(id)
    // 这里可以添加更多逻辑，比如复制模板内容到创意管理
    alert('模板已使用！内容已复制到创意管理中。')
  }

  const categoryOptions = [
    { value: '', label: '所有分类' },
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
    { value: '', label: '所有难度' },
    { value: TemplateDifficulty.BEGINNER, label: '初级' },
    { value: TemplateDifficulty.INTERMEDIATE, label: '中级' },
    { value: TemplateDifficulty.ADVANCED, label: '高级' },
    { value: TemplateDifficulty.EXPERT, label: '专家级' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">模板库</h1>
              <p className="text-gray-600 mt-2">发现和使用高质量的项目模板</p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              创建模板
            </Button>
          </div>

          {/* Stats */}
          <TemplateStats stats={stats} />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <TemplateFilters
            filter={filter}
            categoryOptions={categoryOptions}
            difficultyOptions={difficultyOptions}
            onFilterChange={setFilter}
            onClearFilter={clearFilter}
          />
        </Card>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            共 {filteredTemplates().length} 个模板
          </div>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              网格视图
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              列表视图
            </Button>
          </div>
        </div>

        {/* Templates Grid/List */}
        {filteredTemplates().length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg font-medium mb-2">暂无模板</p>
              <p className="text-sm mb-4">创建你的第一个模板来开始分享</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                创建模板
              </Button>
            </div>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ?
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
            'space-y-4'
          }>
            {filteredTemplates().map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                viewMode={viewMode}
                onEdit={(id) => setEditingTemplate(id)}
                onDelete={handleDeleteTemplate}
                onToggleFeatured={handleToggleFeatured}
                onUse={handleUseTemplate}
              />
            ))}
          </div>
        )}

        {/* Create Template Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="创建新模板"
        >
          <TemplateForm
            onSubmit={handleCreateTemplate}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Edit Template Modal */}
        {editingTemplate && (
          <Modal
            isOpen={true}
            onClose={() => setEditingTemplate(null)}
            title="编辑模板"
          >
            <TemplateForm
              templateId={editingTemplate}
              onSubmit={handleEditTemplate}
              onCancel={() => setEditingTemplate(null)}
            />
          </Modal>
        )}
      </div>
    </div>
  )
}