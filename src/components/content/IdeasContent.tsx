'use client'

import { useState } from 'react'
import { Button, Input, Card, CardContent, CardHeader, Badge } from '@/components/ui'
import { useCreativeIdeas } from '@/hooks/useCreativeIdeas'
import { CreativeForm } from '@/components/creative/CreativeForm'
import {
  Plus, Search, Filter, Grid, List, Edit, Trash2, Calendar, Flag, Tag, Eye
} from 'lucide-react'

export function IdeasContent() {
  const {
    ideas,
    filteredIdeas,
    searchTerm,
    selectedCategory,
    selectedStatus,
    selectedPriority,
    setSearchTerm,
    setSelectedCategory,
    setSelectedStatus,
    setSelectedPriority,
    clearFilters,
    deleteIdea,
    getCategories,
    getStats
  } = useCreativeIdeas()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingIdeaId, setEditingIdeaId] = useState<string | undefined>()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  const categories = getCategories()
  const stats = getStats()

  const handleEditIdea = (ideaId: string) => {
    setEditingIdeaId(ideaId)
    setIsFormOpen(true)
  }

  const handleDeleteIdea = (ideaId: string) => {
    if (window.confirm('确定要删除这个创意吗？')) {
      deleteIdea(ideaId)
    }
  }

  const handleCreateIdea = () => {
    setEditingIdeaId(undefined)
    setIsFormOpen(true)
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

  const formatDate = (date: Date) => {
    try {
      // 确保date是有效的Date对象
      if (!(date instanceof Date) || isNaN(date.getTime())) {
        return '无效日期'
      }
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date)
    } catch (error) {
      console.error('日期格式化错误:', error)
      return '无效日期'
    }
  }

  // 网格视图
  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredIdeas.map((idea) => (
        <Card key={idea.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {idea.title}
              </h3>
              <div className="flex gap-2">
                <Badge variant={getPriorityColor(idea.priority) as any} size="sm">
                  <Flag className="h-3 w-3 mr-1" />
                  {getPriorityText(idea.priority)}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{idea.category}</span>
              <span>•</span>
              <span>{formatDate(idea.createdAt)}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {idea.description}
            </p>

            {/* 标签 */}
            {idea.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {idea.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
                {idea.tags.length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{idea.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* 底部操作 */}
            <div className="flex items-center justify-between">
              <Badge variant={getStatusColor(idea.status) as any} size="sm">
                {getStatusText(idea.status)}
              </Badge>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditIdea(idea.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteIdea(idea.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // 列表视图
  const renderListView = () => (
    <div className="space-y-4">
      {filteredIdeas.map((idea) => (
        <Card key={idea.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {idea.title}
                  </h3>
                  <Badge variant={getPriorityColor(idea.priority) as any} size="sm">
                    {getPriorityText(idea.priority)}
                  </Badge>
                  <Badge variant={getStatusColor(idea.status) as any} size="sm">
                    {getStatusText(idea.status)}
                  </Badge>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {idea.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{idea.category}</span>
                  <span>•</span>
                  <span>{formatDate(idea.createdAt)}</span>
                  {idea.estimatedTime && (
                    <>
                      <span>•</span>
                      <span>预计 {idea.estimatedTime}</span>
                    </>
                  )}
                </div>

                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {idea.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 ml-4">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditIdea(idea.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteIdea(idea.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">创意管理</h1>
          <p className="text-gray-600">管理您的创意想法和项目规划</p>
        </div>
        <Button onClick={handleCreateIdea}>
          <Plus className="h-4 w-4 mr-2" />
          创建新创意
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
              <p className="text-sm text-gray-600">总创意数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
              <p className="text-sm text-gray-600">进行中</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-gray-600">已完成</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.planning}</p>
              <p className="text-sm text-gray-600">计划中</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1">
              <Input
                placeholder="搜索创意..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>

            {/* 筛选按钮 */}
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              筛选
              {(selectedCategory || selectedStatus || selectedPriority) && (
                <Badge variant="primary" size="sm">已筛选</Badge>
              )}
            </Button>

            {/* 视图切换 */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* 筛选选项 */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    分类
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">全部分类</option>
                    <option value="">未分类</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    状态
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">全部状态</option>
                    <option value="idea">想法</option>
                    <option value="planning">计划中</option>
                    <option value="in-progress">进行中</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    优先级
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    <option value="">全部优先级</option>
                    <option value="high">高优先级</option>
                    <option value="medium">中优先级</option>
                    <option value="low">低优先级</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="secondary"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    清除筛选
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 创意列表 */}
      {filteredIdeas.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {ideas.length === 0 ? '还没有创意' : '没有找到匹配的创意'}
            </h3>
            <p className="text-gray-600 mb-6">
              {ideas.length === 0
                ? '创建您的第一个创意，开始记录您的想法'
                : '尝试调整筛选条件或搜索关键词'
              }
            </p>
            {ideas.length === 0 && (
              <Button onClick={handleCreateIdea}>
                <Plus className="h-4 w-4 mr-2" />
                创建第一个创意
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-600">
            显示 {filteredIdeas.length} 个创意，共 {ideas.length} 个
          </div>
          {viewMode === 'grid' ? renderGridView() : renderListView()}
        </>
      )}

      {/* 创建/编辑表单 */}
      <CreativeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        ideaId={editingIdeaId}
      />
    </div>
  )
}