'use client'

import { useState } from 'react'
import { Button, Card, CardContent, CardHeader, Badge } from '@/components/ui'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectStats } from '@/components/projects/ProjectStats'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { useProjects } from '@/hooks/useProjects'

export function ProjectsContent() {
  const { projects, addProject, updateProject, deleteProject, setFilters } = useProjects()
  const filteredProjects = useProjects((state) => state.filteredProjects())
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<string | undefined>()

  const handleCreateProject = () => {
    setEditingProject(undefined)
    setIsFormOpen(true)
  }

  const handleEditProject = (projectId: string) => {
    setEditingProject(projectId)
    setIsFormOpen(true)
  }

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('确定要删除这个项目吗？')) {
      deleteProject(projectId)
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🚀 项目展示</h1>
          <p className="text-gray-600">展示您的项目成果和作品集</p>
        </div>
        <Button onClick={handleCreateProject}>
          ✨ 创建新项目
        </Button>
      </div>

      {/* 项目统计 */}
      <ProjectStats projects={projects} />

      {/* 筛选器 */}
      <ProjectFilters
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
        statusOptions={[
          { value: 'planning', label: '规划中' },
          { value: 'in-progress', label: '进行中' },
          { value: 'completed', label: '已完成' },
          { value: 'paused', label: '已暂停' },
          { value: 'cancelled', label: '已取消' },
        ]}
        onFilterChange={setFilters}
        onClearFilter={() => setFilters({})}
      />

      {/* 项目列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={handleEditProject}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {projects.length === 0 ? '还没有项目' : '没有找到匹配的项目'}
            </h3>
            <p className="text-gray-600 mb-6">
              {projects.length === 0
                ? '创建您的第一个项目，开始展示您的作品'
                : '尝试调整筛选条件'
              }
            </p>
            {projects.length === 0 && (
              <Button onClick={handleCreateProject}>
                ✨ 创建第一个项目
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* 项目表单 */}
      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        projectId={editingProject}
      />
    </div>
  )
}