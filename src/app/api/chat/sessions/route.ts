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

// GET - 获取用户的聊天会话列表
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request)
    const sessions = await chatService.getUserSessions(user.id)

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('获取聊天会话列表错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}

// POST - 创建新的聊天会话
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request)
    const { title } = await request.json()

    if (!title) {
      return NextResponse.json(
        { error: '会话标题是必需的' },
        { status: 400 }
      )
    }

    const newSession = await chatService.createSession({
      user_id: user.id,
      title,
    })

    return NextResponse.json(newSession, { status: 201 })

  } catch (error) {
    console.error('创建聊天会话错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}