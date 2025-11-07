'use client'

import { useState } from 'react'
import { Button, Card, CardContent, CardHeader, Badge } from '@/components/ui'
import { TemplateForm } from '@/components/templates/TemplateForm'
import { TemplateCard } from '@/components/templates/TemplateCard'
import { TemplateStats } from '@/components/templates/TemplateStats'
import { TemplateFilters } from '@/components/templates/TemplateFilters'
import { useTemplates } from '@/hooks/useTemplates'

export function TemplatesContent() {
  const { templates, addTemplate, updateTemplate, deleteTemplate, setFilters } = useTemplates()
  const filteredTemplates = useTemplates((state) => state.filteredTemplates())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<string | undefined>()

  const handleCreateTemplate = () => {
    setEditingTemplate(undefined)
    setIsFormOpen(true)
  }

  const handleEditTemplate = (templateId: string) => {
    setEditingTemplate(templateId)
    setIsFormOpen(true)
  }

  const handleDeleteTemplate = (templateId: string) => {
    if (window.confirm('确定要删除这个模板吗？')) {
      deleteTemplate(templateId)
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📚 模板库</h1>
          <p className="text-gray-600">学习和分享创意模板资源</p>
        </div>
        <Button onClick={handleCreateTemplate}>
          📝 创建新模板
        </Button>
      </div>

      {/* 模板统计 */}
      <TemplateStats templates={templates} />

      {/* 筛选器 */}
      <TemplateFilters
        filter={{}}
        categoryOptions={[
          { value: 'web_development', label: 'Web开发' },
          { value: 'mobile_app', label: '移动应用' },
          { value: 'ai_ml', label: 'AI/机器学习' },
          { value: 'blockchain', label: '区块链' },
          { value: 'iot', label: '物联网' },
          { value: 'game', label: '游戏开发' },
          { value: 'data_science', label: '数据科学' },
          { value: 'cloud_computing', label: '云计算' },
          { value: 'devops', label: 'DevOps' },
          { value: 'ui_ux', label: 'UI/UX设计' },
          { value: 'other', label: '其他' },
        ]}
        difficultyOptions={[
          { value: 'beginner', label: '初级' },
          { value: 'intermediate', label: '中级' },
          { value: 'advanced', label: '高级' },
          { value: 'expert', label: '专家级' },
        ]}
        onFilterChange={setFilters}
        onClearFilter={() => setFilters({})}
      />

      {/* 模板列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
          />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {templates.length === 0 ? '还没有模板' : '没有找到匹配的模板'}
            </h3>
            <p className="text-gray-600 mb-6">
              {templates.length === 0
                ? '创建您的第一个模板，开始分享资源'
                : '尝试调整筛选条件'
              }
            </p>
            {templates.length === 0 && (
              <Button onClick={handleCreateTemplate}>
                📝 创建第一个模板
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* 模板表单 */}
      <TemplateForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        templateId={editingTemplate}
      />
    </div>
  )
}