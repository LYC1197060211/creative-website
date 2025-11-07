'use client'

import { useNavigation, navigationItems } from '@/hooks/useNavigation'

export function MainNavigation() {
  const { currentPage, setCurrentPage } = useNavigation()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 品牌标识 */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">创意工坊</h1>
          </div>

          {/* 导航菜单 */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center space-x-2 px-1 py-4 text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className={`text-lg ${item.iconColor}`}>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </nav>

          {/* 用户区域 */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">欢迎回来</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">用</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}