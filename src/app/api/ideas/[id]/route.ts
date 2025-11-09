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

// GET - 获取单个创意
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateUser(request)
    const { id: ideaId } = await params

    // 先获取创意
    const ideas = await ideaService.getUserIdeas(user.id)
    const idea = ideas.find(i => i.id === ideaId)

    if (!idea) {
      return NextResponse.json(
        { error: '创意不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(idea)

  } catch (error) {
    console.error('获取创意错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}

// PUT - 更新创意
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateUser(request)
    const { id: ideaId } = await params
    const updateData = await request.json()

    // 验证创意是否属于当前用户
    const ideas = await ideaService.getUserIdeas(user.id)
    const existingIdea = ideas.find(i => i.id === ideaId)

    if (!existingIdea) {
      return NextResponse.json(
        { error: '创意不存在或无权限' },
        { status: 404 }
      )
    }

    // 更新创意
    const updatedIdea = await ideaService.updateIdea(ideaId, {
      ...updateData,
      tags: Array.isArray(updateData.tags) ? updateData.tags : existingIdea.tags,
      tech_stack: Array.isArray(updateData.tech_stack) ? updateData.tech_stack : existingIdea.tech_stack,
    })

    return NextResponse.json(updatedIdea)

  } catch (error) {
    console.error('更新创意错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}

// DELETE - 删除创意
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateUser(request)
    const { id: ideaId } = await params

    // 验证创意是否属于当前用户
    const ideas = await ideaService.getUserIdeas(user.id)
    const existingIdea = ideas.find(i => i.id === ideaId)

    if (!existingIdea) {
      return NextResponse.json(
        { error: '创意不存在或无权限' },
        { status: 404 }
      )
    }

    // 删除创意
    await ideaService.deleteIdea(ideaId)

    return NextResponse.json({ message: '创意删除成功' })

  } catch (error) {
    console.error('删除创意错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}