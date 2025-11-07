'use client'

import { useState } from 'react'
import { TemplateFilter } from '@/types/template'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

interface TemplateFiltersProps {
  filter: TemplateFilter
  categoryOptions: Array<{ value: string; label: string }>
  difficultyOptions: Array<{ value: string; label: string }>
  onFilterChange: (filter: Partial<TemplateFilter>) => void
  onClearFilter: () => void
}

export function TemplateFilters({
  filter,
  categoryOptions,
  difficultyOptions,
  onFilterChange,
  onClearFilter,
}: TemplateFiltersProps) {
  const [searchInput, setSearchInput] = useState(filter.search || '')

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    onFilterChange({ search: value })
  }

  const handleCategoryChange = (value: string) => {
    onFilterChange({ category: value || undefined })
  }

  const handleDifficultyChange = (value: string) => {
    onFilterChange({ difficulty: value || undefined })
  }

  const handleFeaturedChange = (value: string) => {
    onFilterChange({ featured: value === 'true' ? true : value === 'false' ? false : undefined })
  }

  const handleRatingChange = (value: string) => {
    onFilterChange({ minRating: value ? Number(value) : undefined })
  }

  const hasActiveFilters = Object.keys(filter).length > 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* 搜索框 */}
        <div className="md:col-span-2">
          <Input
            placeholder="搜索模板标题、描述、标签或作者..."
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

        {/* 难度筛选 */}
        <select
          value={filter.difficulty || ''}
          onChange={(e) => handleDifficultyChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {difficultyOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* 评分筛选 */}
        <select
          value={filter.minRating?.toString() || ''}
          onChange={(e) => handleRatingChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">所有评分</option>
          <option value="4.5">4.5分以上</option>
          <option value="4">4分以上</option>
          <option value="3.5">3.5分以上</option>
          <option value="3">3分以上</option>
          <option value="2">2分以上</option>
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
            <option value="">所有模板</option>
            <option value="true">精选模板</option>
            <option value="false">普通模板</option>
          </select>

          {/* 作者筛选 */}
          <Input
            placeholder="作者名称"
            value={filter.author || ''}
            onChange={(e) => onFilterChange({ author: e.target.value || undefined })}
            className="w-40"
          />
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