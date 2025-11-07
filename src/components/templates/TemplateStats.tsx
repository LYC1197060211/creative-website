'use client'

import { Card } from '@/components/ui/Card'

interface Template {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  tags: string[]
  featured?: boolean
  rating?: number
  downloads?: number
  createdAt: Date
  updatedAt: Date
}

interface TemplateStatsProps {
  templates: Template[]
}

export function TemplateStats({ templates }: TemplateStatsProps) {
  // 计算统计数据
  const stats = {
    total: templates.length,
    featured: templates.filter(t => t.featured).length,
    categories: templates.reduce((acc, template) => {
      acc[template.category] = (acc[template.category] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    difficulties: templates.reduce((acc, template) => {
      acc[template.difficulty] = (acc[template.difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    averageRating: templates.length > 0
      ? templates.reduce((sum, t) => sum + (t.rating || 0), 0) / templates.length
      : 0,
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

  const topCategories = Object.entries(stats.categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const topDifficulties = Object.entries(stats.difficulties)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            总模板数
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.featured}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            精选模板
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            平均评分
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-blue-600">
            {topCategories[0] ? categoryLabels[topCategories[0][0] as keyof typeof categoryLabels] : '-'}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            最热门分类
          </div>
          {topCategories[0] && (
            <div className="text-xs text-gray-500 mt-1">
              {topCategories[0][1]} 个模板
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">
            {topDifficulties[0] ? difficultyLabels[topDifficulties[0][0] as keyof typeof difficultyLabels] : '-'}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            主要难度
          </div>
          {topDifficulties[0] && (
            <div className="text-xs text-gray-500 mt-1">
              {topDifficulties[0][1]} 个模板
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}