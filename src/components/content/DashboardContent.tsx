'use client'

import { useEffect, useState } from 'react'
import { Button, Card, CardContent, CardHeader, Badge } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { useCreativeIdeas } from '@/hooks/useCreativeIdeas'
import { useProjects } from '@/hooks/useProjects'
import { useTemplates } from '@/hooks/useTemplates'

export function DashboardContent() {
  const { user } = useAuth()
  const { ideas } = useCreativeIdeas()
  const { projects } = useProjects()
  const { templates } = useTemplates()

  const [stats, setStats] = useState({
    ideas: { total: 0, inProgress: 0, completed: 0 },
    projects: { total: 0, completed: 0, featured: 0 },
    templates: { total: 0, featured: 0 }
  })

  useEffect(() => {
    if (ideas.length > 0 || projects.length > 0 || templates.length > 0) {
      const ideaStats = {
        total: ideas.length,
        inProgress: ideas.filter(idea => idea.status === 'in-progress').length,
        completed: ideas.filter(idea => idea.status === 'completed').length
      }

      const projectStats = {
        total: projects.length,
        completed: projects.filter(project => project.status === 'completed').length,
        featured: projects.filter(project => project.featured).length
      }

      const templateStats = {
        total: templates.length,
        featured: templates.filter(template => template.featured).length
      }

      setStats({
        ideas: ideaStats,
        projects: projectStats,
        templates: templateStats
      })
    }
  }, [ideas, projects, templates])

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 mb-8 text-white">
        <h2 className="text-2xl font-bold mb-2">
          欢迎回来，{user?.username || '用户'}！
        </h2>
        <p className="text-blue-100 mb-4">
          开始管理您的创意想法，让灵感转化为现实
        </p>
        <div className="flex space-x-4">
          <Button className="bg-white text-blue-600 hover:bg-gray-100">
            ✨ 创建新创意
          </Button>
          <Button className="bg-blue-500 text-white hover:bg-blue-400">
            🤖 AI 优化
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">💡 创意总数</p>
                <p className="text-3xl font-bold text-blue-600">{stats.ideas.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.ideas.inProgress} 进行中, {stats.ideas.completed} 已完成
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">💡</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">🚀 项目展示</p>
                <p className="text-3xl font-bold text-green-600">{stats.projects.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.projects.completed} 已完成, {stats.projects.featured} 精选
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">🚀</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">📚 模板库</p>
                <p className="text-3xl font-bold text-purple-600">{stats.templates.total}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.templates.featured} 精选模板
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">🤖 AI 工具</p>
                <p className="text-3xl font-bold text-orange-600">GLM-4.6</p>
                <p className="text-xs text-gray-500 mt-1">
                  智能优化引擎
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">🤖</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              🤖 AI 智能工具
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full justify-start">
                ✨ AI 创意优化
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                📚 浏览模板
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              使用GLM-4.6 AI技术，优化您的创意想法和实施方案
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              📋 快速链接
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full justify-start">
                💡 创意管理
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                🚀 项目展示
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-3">
              快速访问您的创意、项目和模板资源
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              📊 最近活动
            </h3>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">
                查看创意
              </Button>
              <Button variant="secondary" size="sm">
                查看项目
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 最近创意 */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">💡 最近创意</h4>
              <div className="space-y-3">
                {ideas.slice(0, 3).map((idea) => (
                  <div key={idea.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                          {idea.title}
                        </h5>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {idea.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {idea.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {idea.status === 'completed' ? '已完成' :
                             idea.status === 'in-progress' ? '进行中' : '计划中'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {ideas.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    暂无创意，创建第一个创意
                  </p>
                )}
              </div>
            </div>

            {/* 精选项目 */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">🚀 精选项目</h4>
              <div className="space-y-3">
                {projects.filter(p => p.featured).slice(0, 3).map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">
                          {project.title}
                        </h5>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {project.category}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {project.status === 'completed' ? '已完成' :
                             project.status === 'in_progress' ? '进行中' : '计划中'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {projects.filter(p => p.featured).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    暂无精选项目，创建项目
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}