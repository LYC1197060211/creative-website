'use client'

import { useState, useEffect, useRef } from 'react'
import { Button, Card, CardContent, Input } from '@/components/ui'
import { useGLMChat } from '@/hooks/useGLMChat'
import { GLMService } from '@/services/glmService'
import {
  Send, Plus, MessageSquare, Trash2, Edit3, Check, X,
  Bot, User, Copy, ThumbsUp, ThumbsDown, RefreshCw, MoreVertical,
  Globe, Search
} from 'lucide-react'

export function ChatInterface() {
  const {
    sessions,
    currentSessionId,
    isLoading,
    currentMessage,
    setCurrentSessionId,
    createNewSession,
    addMessage,
    updateMessage,
    deleteMessage,
    deleteSession,
    updateSessionTitle,
    setCurrentMessage,
    setIsLoading,
    getCurrentSession,
  } = useGLMChat()

  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [enableWebSearch, setEnableWebSearch] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 直接使用预设的API密钥
  const API_KEY = 'eb614a329d0945b596245cb56410ba95.999UJoSMoBs65g5x'
  const glmServiceRef = useRef<GLMService>(new GLMService(API_KEY))

  console.log('GLM服务已初始化，API密钥前缀:', API_KEY.substring(0, 10) + '...')

  const currentSession = getCurrentSession()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession?.messages])

  
  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return

    console.log('开始发送消息:', currentMessage.trim())

    // 如果没有当前会话，创建一个新会话
    let sessionId = currentSessionId
    if (!sessionId) {
      console.log('创建新会话')
      sessionId = handleNewSession()
    }

    // 直接使用预设的API密钥
    console.log('使用预设API密钥')

    const userMessage = currentMessage.trim()
    setCurrentMessage('')

    // 添加用户消息
    addMessage(sessionId, {
      content: userMessage,
      role: 'user',
    })

    // 添加AI助手消息占位符
    const assistantMessageId = addMessage(sessionId, {
      content: '',
      role: 'assistant',
      isStreaming: true,
    })

    setIsLoading(true)

    try {
      console.log('调用GLM API')

      // 获取会话历史
      const session = useGLMChat.getState().getSession(sessionId)
      if (!session) throw new Error('会话不存在')

      console.log('会话历史:', session.messages.length, '条消息')

      // 构建消息历史（限制最近20条消息）
      const recentMessages = session.messages.slice(-20)
      const glmMessages = recentMessages
        .filter(msg => !msg.isStreaming)
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))

      console.log('发送到GLM的消息:', glmMessages)

      // 调用GLM API
      const response = await glmServiceRef.current.sendMessage(
        glmMessages,
        (content) => {
          console.log('收到流式内容:', content)
          updateMessage(sessionId, assistantMessageId, content)
        },
        enableWebSearch
      )

      console.log('GLM API最终响应:', response)

      // 更新消息状态，移除流式标记
      const updatedSession = useGLMChat.getState().getSession(sessionId)
      if (updatedSession) {
        const updatedMessage = updatedSession.messages.find(m => m.id === assistantMessageId)
        if (updatedMessage) {
          updatedMessage.isStreaming = false
        }
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      let errorMessage = '抱歉，发生了错误，请稍后重试。'

      if (error instanceof Error) {
        console.error('错误详情:', error.message)
        if (error.message.includes('401')) {
          errorMessage = 'API密钥无效，请检查API Key。'
        } else if (error.message.includes('429')) {
          errorMessage = '请求过于频繁，请稍后再试。'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = '网络连接错误，请检查网络后重试。'
        } else {
          errorMessage = `错误: ${error.message}`
        }
      }

      updateMessage(sessionId, assistantMessageId, errorMessage)

      // 更新消息状态，移除流式标记
      const updatedSession = useGLMChat.getState().getSession(sessionId)
      if (updatedSession) {
        const updatedMessage = updatedSession.messages.find(m => m.id === assistantMessageId)
        if (updatedMessage) {
          updatedMessage.isStreaming = false
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNewSession = () => {
    const newSessionId = createNewSession()
    setCurrentSessionId(newSessionId)
    return newSessionId
  }

  
  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm('确定要删除这个对话吗？')) {
      deleteSession(sessionId)
    }
  }

  const handleStartEditTitle = (session: any) => {
    setEditingSessionId(session.id)
    setEditingTitle(session.title)
  }

  const handleSaveTitle = () => {
    if (editingSessionId && editingTitle.trim()) {
      updateSessionTitle(editingSessionId, editingTitle.trim())
      setEditingSessionId(null)
      setEditingTitle('')
    }
  }

  const handleCancelEdit = () => {
    setEditingSessionId(null)
    setEditingTitle('')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* 侧边栏头部 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              GLM 对话
            </h2>
          </div>
          <Button
            onClick={handleNewSession}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            新建对话
          </Button>
        </div>

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${
                currentSessionId === session.id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setCurrentSessionId(session.id)}
            >
              {editingSessionId === session.id ? (
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Input
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTitle()
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                    className="flex-1 text-sm"
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleSaveTitle}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {session.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.messages.length} 条消息
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartEditTitle(session)
                        }}
                        className="p-1"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSession(session.id)
                        }}
                        className="p-1 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 主对话区域 */}
      <div className="flex-1 flex flex-col">
        {currentSession ? (
          <>
            {/* 对话头部 */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentSession.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Bot className="w-4 h-4" />
                  GLM 助手
                </div>
              </div>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
              {currentSession.messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-blue-600" />
                    </div>
                  )}

                  <div className={`max-w-3xl ${
                    message.role === 'user' ? 'order-first' : ''
                  }`}>
                    <Card className={`${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white border-gray-200'
                    }`}>
                      <CardContent className="p-4">
                        <div className="whitespace-pre-wrap break-words">
                          {message.content}
                          {message.isStreaming && (
                            <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1" />
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* 消息操作 */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      <span>
                        {message.timestamp instanceof Date
                          ? message.timestamp.toLocaleTimeString()
                          : new Date(message.timestamp).toLocaleTimeString()
                        }
                      </span>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyMessage(message.content)}
                          className="p-1 opacity-0 group-hover:opacity-100"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        {message.role === 'assistant' && (
                          <>
                            <Button size="sm" variant="ghost" className="p-1">
                              <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="p-1">
                              <ThumbsDown className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="p-1">
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* 输入区域 */}
            <div className="border-t border-gray-200 bg-white px-6 py-4">
              {/* 网络搜索开关 */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">网络搜索</span>
                  <button
                    onClick={() => setEnableWebSearch(!enableWebSearch)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      enableWebSearch ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enableWebSearch ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  {enableWebSearch && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <Search className="w-3 h-3" />
                      已启用
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {enableWebSearch ? '将自动搜索最新信息' : '仅使用模型内部知识'}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={enableWebSearch ? "输入您的消息...（支持网络搜索最新信息）" : "输入您的消息..."}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isLoading}
                    className="px-6 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                按 Enter 发送，Shift + Enter 换行
              </div>
            </div>
          </>
        ) : (
          /* 空状态 */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                开始新的对话
              </h2>
              <p className="text-gray-600 mb-6">
                选择一个现有对话或创建新对话开始聊天
              </p>
              <Button
                onClick={handleNewSession}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                新建对话
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
