'use client'

import { useState } from 'react'
import { Project } from '@/types/project'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useProjects } from '@/hooks/useProjects'

interface ProjectCardProps {
  project: Project
  viewMode: 'grid' | 'list'
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onToggleFeatured: (id: string) => void
}

const categoryLabels = {
  web_development: 'Web开发',
  mobile_app: '移动应用',
  ai_ml: 'AI/机器学习',
  blockchain: '区块链',
  iot: '物联网',
  game: '游戏开发',
  other: '其他',
}

const statusLabels = {
  planning: '规划中',
  in_progress: '进行中',
  completed: '已完成',
  on_hold: '暂停',
  cancelled: '已取消',
}

const statusColors = {
  planning: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800',
}

export function ProjectCard({ project, viewMode, onEdit, onDelete, onToggleFeatured }: ProjectCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true)
  const { getProjectById } = useProjects()

  const handleEdit = () => {
    onEdit(project.id)
  }

  const handleDelete = () => {
    onDelete(project.id)
  }

  const handleToggleFeatured = () => {
    onToggleFeatured(project.id)
  }

  if (viewMode === 'list') {
    return (
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start space-x-4">
          {project.imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-20 h-20 object-cover rounded-lg"
                onLoad={() => setIsImageLoading(false)}
                onError={() => setIsImageLoading(false)}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      ⭐ 精选
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{categoryLabels[project.category]}</span>
                  <span>•</span>
                  <Badge className={statusColors[project.status]}>
                    {statusLabels[project.status]}
                  </Badge>
                  <span>•</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {project.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleFeatured}
                  title={project.featured ? '取消精选' : '设为精选'}
                >
                  {project.featured ? '⭐' : '☆'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  编辑
                </Button>
                <Button variant="outline" size="sm" onClick={handleDelete}>
                  删除
                </Button>
              </div>
            </div>
            {(project.githubUrl || project.demoUrl) && (
              <div className="flex space-x-3 mt-4">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    GitHub
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    在线演示
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {project.imageUrl && (
        <div className="aspect-video bg-gray-200 relative">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          {project.featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-yellow-100 text-yellow-800">
                ⭐ 精选
              </Badge>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
            {project.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleFeatured}
            className="p-1"
            title={project.featured ? '取消精选' : '设为精选'}
          >
            {project.featured ? '⭐' : '☆'}
          </Button>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <Badge className={statusColors[project.status]}>
            {statusLabels[project.status]}
          </Badge>
          <span className="text-xs text-gray-500">
            {categoryLabels[project.category]}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                演示
              </a>
            )}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              编辑
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              删除
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}