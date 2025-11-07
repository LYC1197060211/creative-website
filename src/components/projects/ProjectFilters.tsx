'use client'

import { useState } from 'react'
import { ProjectFilter } from '@/types/project'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface ProjectFiltersProps {
  filter: ProjectFilter
  categoryOptions: Array<{ value: string; label: string }>
  statusOptions: Array<{ value: string; label: string }>
  onFilterChange: (filter: Partial<ProjectFilter>) => void
  onClearFilter: () => void
}

export function ProjectFilters({
  filter,
  categoryOptions,
  statusOptions,
  onFilterChange,
  onClearFilter,
}: ProjectFiltersProps) {
  const [searchInput, setSearchInput] = useState(filter.search || '')

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    onFilterChange({ search: value })
  }

  const handleCategoryChange = (value: string) => {
    onFilterChange({ category: value || undefined })
  }

  const handleStatusChange = (value: string) => {
    onFilterChange({ status: value || undefined })
  }

  const handleFeaturedChange = (value: string) => {
    onFilterChange({ featured: value === 'true' ? true : value === 'false' ? false : undefined })
  }

  const hasActiveFilters = Object.keys(filter).length > 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 搜索框 */}
        <div className="md:col-span-2">
          <Input
            placeholder="搜索项目标题、描述、标签或技术栈..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        {/* 分类筛选 */}
        <select
          value={filter.category || ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 状态筛选 */}
        <select
          value={filter.status || ''}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* 精选筛选 */}
          <select
            value={filter.featured === true ? 'true' : filter.featured === false ? 'false' : ''}
            onChange={(e) => handleFeaturedChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">所有项目</option>
            <option value="true">精选项目</option>
            <option value="false">普通项目</option>
          </select>
        </div>

        {/* 清除筛选按钮 */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilter}>
            清除筛选
          </Button>
        )}
      </div>
    </div>
  )
}