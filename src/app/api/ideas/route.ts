import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { ideaService } from '@/lib/database'

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

// GET - 获取用户的所有创意
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request)
    const ideas = await ideaService.getUserIdeas(user.id)

    return NextResponse.json(ideas)
  } catch (error) {
    console.error('获取创意列表错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}

// POST - 创建新创意
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request)
    const ideaData = await request.json()

    // 验证必需字段
    if (!ideaData.title || !ideaData.description || !ideaData.category) {
      return NextResponse.json(
        { error: '标题、描述和分类是必需的' },
        { status: 400 }
      )
    }

    // 创建创意时添加用户ID
    const newIdea = await ideaService.createIdea({
      ...ideaData,
      user_id: user.id,
      priority: ideaData.priority || 'medium',
      status: ideaData.status || 'idea',
      tags: Array.isArray(ideaData.tags) ? ideaData.tags : [],
      tech_stack: Array.isArray(ideaData.tech_stack) ? ideaData.tech_stack : [],
    })

    return NextResponse.json(newIdea, { status: 201 })

  } catch (error) {
    console.error('创建创意错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}