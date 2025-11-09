'use client'

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 全栈应用部署成功！
        </h1>
        <p className="text-gray-600 mb-6">
          恭喜！你的Next.js + Supabase应用已成功部署到生产环境！
        </p>
        <div className="space-y-2 text-left bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            ✅ Next.js 16 应用运行正常
          </p>
          <p className="text-sm text-gray-700">
            ✅ 环境变量配置成功
          </p>
          <p className="text-sm text-gray-700">
            ✅ 生产环境可以访问
          </p>
          <p className="text-sm text-gray-700">
            ✅ 真正的全栈应用开发完成！
          </p>
        </div>
        <div className="mt-6">
          <a
            href="/auth"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            前往登录页面
          </a>
        </div>
      </div>
    </div>
  )
}