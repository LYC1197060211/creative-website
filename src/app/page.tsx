export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            欢迎来到创意管理系统
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            收集、整理和优化您的创意想法
          </p>
          <div className="space-y-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              开始使用
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}