'use client'

import { useState, useEffect } from 'react'
import { useProjects } from '@/hooks/useProjects'
import { ProjectCategory, ProjectStatus } from '@/types/project'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { ProjectStats } from '@/components/projects/ProjectStats'
import { ProjectFilters } from '@/components/projects/ProjectFilters'

export default function ProjectsPage() {
  const {
    projects,
    filteredProjects,
    getProjectStats,
    addProject,
    updateProject,
    deleteProject,
    toggleFeatured,
    setFilter,
    clearFilter,
    filter,
  } = useProjects()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [stats, setStats] = useState(getProjectStats())

  useEffect(() => {
    setStats(getProjectStats())
  }, [filteredProjects, getProjectStats])

  const handleCreateProject = (projectData: any) => {
    addProject(projectData)
    setIsCreateModalOpen(false)
  }

  const handleEditProject = (projectData: any) => {
    if (editingProject) {
      updateProject(editingProject, projectData)
      setEditingProject(null)
    }
  }

  const handleDeleteProject = (id: string) => {
    if (confirm('确定要删除这个项目吗？')) {
      deleteProject(id)
    }
  }

  const handleToggleFeatured = (id: string) => {
    toggleFeatured(id)
  }

  const categoryOptions = [
    { value: '', label: '所有分类' },
    { value: ProjectCategory.WEB_DEVELOPMENT, label: 'Web开发' },
    { value: ProjectCategory.MOBILE_APP, label: '移动应用' },
    { value: ProjectCategory.AI_ML, label: 'AI/机器学习' },
    { value: ProjectCategory.BLOCKCHAIN, label: '区块链' },
    { value: ProjectCategory.IOT, label: '物联网' },
    { value: ProjectCategory.GAME, label: '游戏开发' },
    { value: ProjectCategory.OTHER, label: '其他' },
  ]

  const statusOptions = [
    { value: '', label: '所有状态' },
    { value: ProjectStatus.PLANNING, label: '规划中' },
    { value: ProjectStatus.IN_PROGRESS, label: '进行中' },
    { value: ProjectStatus.COMPLETED, label: '已完成' },
    { value: ProjectStatus.ON_HOLD, label: '暂停' },
    { value: ProjectStatus.CANCELLED, label: '已取消' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">项目展示</h1>
              <p className="text-gray-600 mt-2">管理和展示我的项目作品</p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              新建项目
            </Button>
          </div>

          {/* Stats */}
          <ProjectStats projects={projects as any} />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <ProjectFilters
            filter={filter}
            categoryOptions={categoryOptions}
            statusOptions={statusOptions}
            onFilterChange={setFilter}
            onClearFilter={clearFilter}
          />
        </Card>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            共 {filteredProjects().length} 个项目
          </div>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              网格视图
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              列表视图
            </Button>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects().length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg font-medium mb-2">暂无项目</p>
              <p className="text-sm mb-4">创建你的第一个项目来开始展示</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                创建项目
              </Button>
            </div>
          </Card>
        ) : (
          <div className={viewMode === 'grid' ?
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' :
            'space-y-4'
          }>
            {filteredProjects().map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                onEdit={(id) => setEditingProject(id)}
                onDelete={handleDeleteProject}
                onToggleFeatured={handleToggleFeatured}
              />
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="创建新项目"
        >
          <ProjectForm
            onSubmit={handleCreateProject}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </Modal>

        {/* Edit Project Modal */}
        {editingProject && (
          <Modal
            isOpen={true}
            onClose={() => setEditingProject(null)}
            title="编辑项目"
          >
            <ProjectForm
              projectId={editingProject}
              onSubmit={handleEditProject}
              onCancel={() => setEditingProject(null)}
            />
          </Modal>
        )}
      </div>
    </div>
  )
}