'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button, Card, CardContent, CardHeader, Badge, Modal } from '@/components/ui'
import { useCreativeIdeas } from '@/hooks/useCreativeIdeas'
import { CreativeForm } from '@/components/creative/CreativeForm'
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Flag,
  Tag,
  Clock,
  Code,
  MessageSquare
} from 'lucide-react'

export default function IdeaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { getIdeaById, deleteIdea } = useCreativeIdeas()
  const [idea, setIdea] = useState<any>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    if (params.id) {
      const ideaData = getIdeaById(params.id as string)
      setIdea(ideaData)
    }
  }, [params.id, getIdeaById])

  if (!idea) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载...</p>
        </div>
      </div>
    )
  }

  const handleEdit = () => {
    setIsEditModalOpen(true)
  }

  const handleDelete = () => {
    deleteIdea(idea.id)
    router.push('/ideas')
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error'
      case 'medium': return 'warning'
      case 'low': return 'default'
      default: return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'in-progress': return 'warning'
      case 'planning': return 'primary'
      case 'idea': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'in-progress': return '进行中'
      case 'planning': return '计划中'
      case 'idea': return '想法'
      default: return status
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高优先级'
      case 'medium': return '中优先级'
      case 'low': return '低优先级'
      default: return priority
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/ideas" className="flex items-center text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回创意列表
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                创意详情
              </h1>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                编辑
              </Button>
              <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                删除
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本信息 */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      {idea.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge variant={getStatusColor(idea.status) as any}>
                        {getStatusText(idea.status)}
                      </Badge>
                      <Badge variant={getPriorityColor(idea.priority) as any}>
                        <Flag className="h-3 w-3 mr-1" />
                        {getPriorityText(idea.priority)}
                      </Badge>
                      <Badge variant="secondary">
                        {idea.category || '未分类'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {idea.description}
                  </p>
                </div>

                {/* 时间信息 */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      创建时间：{formatDate(idea.createdAt)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      更新时间：{formatDate(idea.updatedAt)}
                    </div>
                    {idea.estimatedTime && (
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        预计时间：{idea.estimatedTime}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI建议 */}
            {idea.aiSuggestions && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    AI 优化建议
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      {idea.aiSuggestions}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 侧边栏信息 */}
          <div className="space-y-6">
            {/* 标签 */}
            {idea.tags && idea.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-blue-600" />
                    标签
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag: string) => (
                      <Badge key={tag} variant="primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 技术栈 */}
            {idea.techStack && idea.techStack.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Code className="h-5 w-5 mr-2 text-blue-600" />
                    技术栈
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {idea.techStack.map((tech: string) => (
                      <Badge key={tech} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 操作按钮 */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">
                  快速操作
                </h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  编辑创意
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/ai-optimize">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    AI 优化
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/templates">
                    <Code className="h-4 w-4 mr-2" />
                    查看模板
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 编辑模态框 */}
      <CreativeForm
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ideaId={idea.id}
      />

      {/* 删除确认模态框 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="确认删除"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            确定要删除创意 "{idea.title}" 吗？此操作无法撤销。
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              取消
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                handleDelete()
                setIsDeleteModalOpen(false)
              }}
            >
              确认删除
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}