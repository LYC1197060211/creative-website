'use client'

import { useState } from 'react'
import { Button, Card, CardContent, CardHeader, Badge, Input, Modal } from '@/components/ui'
import { aiService } from '@/lib/ai'
import mammoth from 'mammoth'
import { useCreativeIdeas } from '@/hooks/useCreativeIdeas'
import { CreativeForm } from '@/components/creative/CreativeForm'
import {
  Brain,
  Zap,
  Target,
  Lightbulb,
  FileText,
  Upload,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  Code,
  TrendingUp
} from 'lucide-react'

type OptimizationType = 'content' | 'tech-stack' | 'expand' | 'implementation'

interface OptimizationResult {
  type: OptimizationType
  content: string
  timestamp: Date
}

export function AIOptimizeContent() {
  const [ideaContent, setIdeaContent] = useState('')
  const [ideaCategory, setIdeaCategory] = useState('')
  const [selectedIdea, setSelectedIdea] = useState<string>('')
  const [optimizationType, setOptimizationType] = useState<OptimizationType>('content')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [error, setError] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [fileContent, setFileContent] = useState('')
  const [fileName, setFileName] = useState('')

  const { ideas, addIdea, updateIdea } = useCreativeIdeas()

  const optimizationOptions = [
    {
      type: 'content' as OptimizationType,
      title: '创意内容优化',
      description: '分析创意价值，提供改进建议',
      icon: <Lightbulb className="h-5 w-5" />,
      color: 'blue'
    },
    {
      type: 'tech-stack' as OptimizationType,
      title: '技术栈推荐',
      description: '推荐最适合的技术方案',
      icon: <Code className="h-5 w-5" />,
      color: 'green'
    },
    {
      type: 'expand' as OptimizationType,
      title: '创意扩展',
      description: '将简短想法扩展为详细规划',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'purple'
    },
    {
      type: 'implementation' as OptimizationType,
      title: '实施计划生成',
      description: '制定详细的项目实施计划',
      icon: <Target className="h-5 w-5" />,
      color: 'orange'
    }
  ]

  const handleOptimize = async () => {
    if (!ideaContent.trim()) {
      setError('请输入创意内容')
      return
    }

    setIsProcessing(true)
    setError('')
    setResult(null)

    try {
      let response

      switch (optimizationType) {
        case 'content':
          response = await aiService.optimizeIdea({
            title: selectedIdea ? ideas.find(i => i.id === selectedIdea)?.title : '未命名创意',
            description: ideaContent,
            category: ideaCategory
          })
          break
        case 'tech-stack':
          response = await aiService.recommendTechStack(ideaContent, ideaCategory)
          break
        case 'expand':
          response = await aiService.expandIdea(ideaContent)
          break
        case 'implementation':
          response = await aiService.generateImplementationPlan({
            title: selectedIdea ? ideas.find(i => i.id === selectedIdea)?.title : '未命名创意',
            description: ideaContent,
            category: ideaCategory
          })
          break
        default:
          throw new Error('未知的优化类型')
      }

      if (response.success && response.data) {
        setResult({
          type: optimizationType,
          content: response.data,
          timestamp: new Date()
        })

        // 如果选择了现有创意，自动保存AI建议
        if (selectedIdea) {
          await updateIdea(selectedIdea, {
            aiSuggestions: response.data
          })
        }
      } else {
        setError(response.error || 'AI处理失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '处理过程中发生错误')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) { // 10MB限制
      setError('文件大小不能超过10MB')
      return
    }

    setIsProcessing(true)
    setFileName(file.name)

    try {
      let content = ''

      // 根据文件类型处理不同格式
      if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
        // 纯文本文件
        content = await file.text()
      } else if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        // Markdown文件
        content = await file.text()
      } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        // DOCX/DOC文件 - 使用mammoth.js提取文本内容
        try {
          const arrayBuffer = await file.arrayBuffer()

          // 使用mammoth.js将DOCX转换为纯文本
          const result = await mammoth.convertToRawText({ arrayBuffer })
          content = result.value

          // 清理和验证文本内容，确保编码正确
          if (content) {
            // 移除多余的空白字符，保留基本格式
            content = content
              .replace(/\r\n/g, '\n')  // 统一换行符
              .replace(/\n{3,}/g, '\n\n')  // 移除多余空行
              .trim()

            // 验证内容是否包含有效字符（不仅仅是控制字符）
            const hasValidContent = /[\u4e00-\u9fa5a-zA-Z0-9]/.test(content)

            if (!hasValidContent || content.length < 10) {
              const htmlResult = await mammoth.convertToHtml({ arrayBuffer })
              if (htmlResult.value && htmlResult.value.length > 100) {
                content = `文档标题：${file.name}\n\n注意：成功提取了文档HTML格式内容，建议：\n1. 将HTML内容转换为纯文本后重新分析\n2. 或者直接复制文档内容到下方文本框中\n\n原始HTML内容长度：${htmlResult.value.length} 字符`
              } else {
                content = `文档标题：${file.name}\n\n注意：无法解析DOCX文件内容。\n可能的原因：\n1. 文件已损坏\n2. 文件格式不正确\n3. 文件受密码保护\n\n建议：\n1. 确认文件可以正常打开\n2. 将文档另存为TXT格式重新上传\n3. 或者直接复制文档内容到下方文本框中进行分析`
              }
            } else {
              // 添加内容信息前缀
              content = `文档标题：${file.name}\n提取时间：${new Date().toLocaleString('zh-CN')}\n内容长度：${content.length} 字符\n\n=== 文档内容 ===\n\n${content}`
            }
          }
        } catch (error) {
          console.error('DOCX解析错误:', error)
          content = `文档标题：${file.name}\n\nDOCX文件解析失败：${error instanceof Error ? error.message : '未知错误'}\n\n建议：\n1. 确认文件可以正常打开\n2. 尝试将文档另存为TXT格式重新上传\n3. 或者直接复制文档内容到下方文本框中进行分析`
        }
      } else {
        // 其他文件类型
        try {
          content = await file.text()
        } catch {
          content = `文件名：${file.name}\n文件类型：${file.type || '未知'}\n\n注意：此文件格式可能不被完全支持。建议使用TXT、MD或DOCX格式。`
        }
      }

      setFileContent(content)

      // 分析文档内容
      const response = await aiService.analyzeDocument(content, file.name)

      if (response.success && response.data) {
        setResult({
          type: 'content',
          content: response.data,
          timestamp: new Date()
        })
      } else {
        setError(response.error || '文档分析失败')
      }
    } catch (err) {
      console.error('文件处理错误:', err)
      setError('文件读取失败，请尝试使用支持的文件格式或直接粘贴内容')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveAsNewIdea = async () => {
    if (!result) return

    const newIdea = {
      title: `AI优化创意 - ${optimizationOptions.find(o => o.type === result.type)?.title}`,
      description: result.content,
      category: ideaCategory || 'AI生成',
      priority: 'medium' as const,
      status: 'idea' as const,
      tags: ['AI生成', optimizationOptions.find(o => o.type === result.type)?.title].filter((tag): tag is string => Boolean(tag)),
      aiSuggestions: result.content
    }

    await addIdea(newIdea)
    setIsCreateModalOpen(false)
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          AI 创意优化
        </h1>
        <p className="text-gray-600">使用AI技术优化您的创意想法和实施方案</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧输入区域 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 优化类型选择 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                选择优化类型
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimizationOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => setOptimizationType(option.type)}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      optimizationType === option.type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`text-${option.color}-600`}>
                        {option.icon}
                      </div>
                      <h4 className="font-medium text-gray-900">
                        {option.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600 text-left">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 输入区域 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                输入创意内容
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 选择现有创意 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  选择现有创意（可选）
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedIdea}
                  onChange={(e) => {
                    const idea = ideas.find(i => i.id === e.target.value)
                    setSelectedIdea(e.target.value)
                    if (idea) {
                      setIdeaContent(idea.description)
                      setIdeaCategory(idea.category)
                    }
                  }}
                >
                  <option value="">选择一个创意...</option>
                  {ideas.map(idea => (
                    <option key={idea.id} value={idea.id}>
                      {idea.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* 创意分类 */}
              <Input
                label="创意分类"
                placeholder="例如：Web开发、AI应用、产品设计等"
                value={ideaCategory}
                onChange={(e) => setIdeaCategory(e.target.value)}
              />

              {/* 创意描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  创意描述
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                  placeholder="详细描述您的创意想法..."
                  value={ideaContent}
                  onChange={(e) => setIdeaContent(e.target.value)}
                />
              </div>

              {/* 文件上传 */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".txt,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    点击上传文档，或拖拽文件到此处
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    支持 .txt, .md, .doc, .docx 格式，最大10MB
                  </p>
                </label>
                {fileName && (
                  <p className="text-sm text-blue-600 mt-2">
                    已上传: {fileName}
                  </p>
                )}
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {/* 优化按钮 */}
              <Button
                onClick={handleOptimize}
                loading={isProcessing}
                disabled={isProcessing || (!ideaContent.trim() && !fileContent)}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI正在分析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    开始AI优化
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧结果区域 */}
        <div className="space-y-6">
          {/* AI能力介绍 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                AI 能力介绍
              </h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">智能分析</p>
                  <p className="text-xs text-gray-600">深度分析创意可行性和价值</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">技术建议</p>
                  <p className="text-xs text-gray-600">推荐最适合的技术方案</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">实施规划</p>
                  <p className="text-xs text-gray-600">制定详细的项目实施计划</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">文档分析</p>
                  <p className="text-xs text-gray-600">智能分析上传的文档内容</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 优化结果 */}
          {result && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    优化结果
                  </h3>
                  <Badge variant="primary" size="sm">
                    {optimizationOptions.find(o => o.type === result.type)?.title}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {formatTimestamp(result.timestamp)}
                </p>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {result.content}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(result.content)}
                    >
                      复制结果
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setIsCreateModalOpen(true)}
                    >
                      保存为新创意
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 使用统计 */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">
                使用统计
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">今日优化次数</span>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">本月优化次数</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">总计创意数量</span>
                  <span className="text-sm font-medium text-gray-900">{ideas.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 创建创意模态框 */}
      <CreativeForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}