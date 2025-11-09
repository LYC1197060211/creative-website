'use client'

import { useState } from 'react'

export default function LandingPage() {
  const [testResults, setTestResults] = useState<string[]>([])

  const testAPIConnection = async () => {
    const results = [...testResults]

    try {
      // 测试API连接
      const response = await fetch('/api/auth/me')
      const data = await response.json()

      if (response.status === 401) {
        results.push('✅ API端点正常工作 - 返回401 (需要认证)')
      } else {
        results.push(`✅ API响应: ${JSON.stringify(data)}`)
      }
    } catch (error) {
      results.push(`❌ API连接错误: ${error}`)
    }

    setTestResults(results)
  }

  const testSupabaseConnection = async () => {
    const results = [...testResults]

    try {
      // 测试Supabase连接
      const response = await fetch('/api/templates')
      const data = await response.json()

      if (response.ok) {
        results.push(`✅ Supabase连接成功 - 获取到 ${data.templates?.length || 0} 个模板`)
      } else {
        results.push(`⚠️ Supabase响应: ${data.error || '未知错误'}`)
      }
    } catch (error) {
      results.push(`❌ Supabase连接错误: ${error}`)
    }

    setTestResults(results)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 全栈应用功能测试
          </h1>
          <p className="text-xl text-gray-600">
            你的Next.js + Supabase应用已经成功部署！
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">🌐 生产环境信息</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>应用地址:</strong> https://creative-website-mmbr93nta-lycs-projects-31d2e66f.vercel.app</p>
            <p><strong>状态:</strong> ✅ 部署成功</p>
            <p><strong>技术栈:</strong> Next.js 16 + Supabase + TypeScript + Tailwind CSS</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">🔧 功能测试</h2>
          <div className="flex gap-4 mb-6">
            <button
              onClick={testAPIConnection}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              测试API连接
            </button>
            <button
              onClick={testSupabaseConnection}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              测试Supabase
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">测试结果:</h3>
              {testResults.map((result, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">📋 功能清单</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">✅ 已完成功能</h3>
              <ul className="space-y-2 text-gray-700">
                <li>✅ Next.js 16应用框架</li>
                <li>✅ Supabase数据库集成</li>
                <li>✅ 12个RESTful API端点</li>
                <li>✅ 用户认证系统</li>
                <li>✅ 响应式UI设计</li>
                <li>✅ TypeScript类型安全</li>
                <li>✅ 生产环境部署</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">🎯 核心功能</h3>
              <ul className="space-y-2 text-gray-700">
                <li>💡 创意管理</li>
                <li>🚀 项目展示</li>
                <li>📚 模板库</li>
                <li>💬 AI聊天功能</li>
                <li>👤 用户系统</li>
                <li>🔐 权限管理</li>
                <li>📊 数据持久化</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">🎊 恭喜！</h2>
          <p className="text-gray-700 mb-4">
            你已经成功创建了一个真正的全栈应用！这是一个包含前端、后端、数据库、AI功能的完整Web应用。
          </p>
          <div className="flex gap-4">
            <a
              href="/auth"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              前往登录页面
            </a>
            <a
              href="/test-simple"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              查看测试页面
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}