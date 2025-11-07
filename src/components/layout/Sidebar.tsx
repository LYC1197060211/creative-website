'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navigation = [
    {
      name: '概览',
      href: '/dashboard',
      icon: '🏠',
      description: '系统总览和统计'
    },
    {
      name: '创意管理',
      href: '/ideas',
      icon: '💡',
      description: '管理创意想法'
    },
    {
      name: 'AI优化',
      href: '/ai-optimize',
      icon: '🤖',
      description: 'AI智能优化'
    },
    {
      name: '项目展示',
      href: '/projects',
      icon: '🚀',
      description: '项目作品展示'
    },
    {
      name: '模板库',
      href: '/templates',
      icon: '📚',
      description: '学习模板资源'
    },
  ]

  const quickActions = [
    { name: '新建创意', href: '/ideas?action=create', icon: '✨' },
    { name: 'AI优化', href: '/ai-optimize', icon: '🚀' },
    { name: '创建项目', href: '/projects?action=create', icon: '📁' },
  ]

  return (
    <div className={`hidden lg:flex lg:flex-shrink-0 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col border-r border-gray-200 bg-white">
        {/* Sidebar Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">功能菜单</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2"
          >
            {isCollapsed ? '→' : '←'}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">快速操作</h3>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link
                  key={action.name}
                  href={action.href}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100 group"
                >
                  <span className="mr-2">{action.icon}</span>
                  <span className="flex-1">{action.name}</span>
                  <span className="text-gray-400 group-hover:text-gray-600">→</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <div className="flex items-center justify-between mb-2">
                <span>系统状态</span>
                <Badge className="bg-green-100 text-green-800">正常</Badge>
              </div>
              <div className="text-gray-400">
                © 2024 创意工坊
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}