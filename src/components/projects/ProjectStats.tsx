'use client'

import { Card } from '@/components/ui/Card'
import { Project } from '@/types/project'

interface ProjectStatsProps {
  projects: Project[]
}

export function ProjectStats({ projects }: ProjectStatsProps) {
  // 计算统计数据
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === 'completed').length,
    inProgress: projects.filter(p => p.status === 'in_progress').length,
    planning: projects.filter(p => p.status === 'planning').length,
    featured: projects.filter(p => p.featured).length,
  }
  const statItems = [
    {
      label: '总项目数',
      value: stats.total,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      label: '已完成',
      value: stats.completed,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: '进行中',
      value: stats.inProgress,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: '规划中',
      value: stats.planning,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      label: '精选项目',
      value: stats.featured,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="p-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${item.color}`}>
              {item.value}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {item.label}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}