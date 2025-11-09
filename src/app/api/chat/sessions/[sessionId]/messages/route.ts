import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { chatService } from '@/lib/database'

// 验证用户认证
async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('缺少认证令牌')
  }

  const token = authHeader.substring(7)
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    throw new Error('无效的认证令牌')
  }

  return user
}

// 验证会话是否属于当前用户
async function validateSessionOwnership(userId: string, sessionId: string) {
  const sessions = await chatService.getUserSessions(userId)
  const session = sessions.find(s => s.id === sessionId)

  if (!session) {
    throw new Error('会话不存在或无权限')
  }

  return session
}

// GET - 获取会话的消息列表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await authenticateUser(request)
    const { sessionId } = await params

    // 验证会话所有权
    await validateSessionOwnership(user.id, sessionId)

    // 获取消息
    const messages = await chatService.getSessionMessages(sessionId)

    return NextResponse.json(messages)
  } catch (error) {
    console.error('获取聊天消息错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}

// POST - 添加新消息
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const user = await authenticateUser(request)
    const { sessionId } = await params
    const { role, content } = await request.json()

    // 验证必需字段
    if (!role || !content) {
      return NextResponse.json(
        { error: '消息角色和内容是必需的' },
        { status: 400 }
      )
    }

    // 验证角色
    if (role !== 'user' && role !== 'assistant') {
      return NextResponse.json(
        { error: '无效的消息角色' },
        { status: 400 }
      )
    }

    // 验证会话所有权
    await validateSessionOwnership(user.id, sessionId)

    // 添加消息
    const newMessage = await chatService.addMessage({
      session_id: sessionId,
      role,
      content,
    })

    return NextResponse.json(newMessage, { status: 201 })

  } catch (error) {
    console.error('添加聊天消息错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}