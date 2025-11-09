import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { projectService } from '@/lib/database'

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

// GET - 获取单个项目
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateUser(request)
    const { id: projectId } = await params

    // 先获取项目
    const projects = await projectService.getUserProjects(user.id)
    const project = projects.find(p => p.id === projectId)

    if (!project) {
      return NextResponse.json(
        { error: '项目不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json(project)

  } catch (error) {
    console.error('获取项目错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}

// PUT - 更新项目
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateUser(request)
    const { id: projectId } = await params
    const updateData = await request.json()

    // 验证项目是否属于当前用户
    const projects = await projectService.getUserProjects(user.id)
    const existingProject = projects.find(p => p.id === projectId)

    if (!existingProject) {
      return NextResponse.json(
        { error: '项目不存在或无权限' },
        { status: 404 }
      )
    }

    // 更新项目
    const updatedProject = await projectService.updateProject(projectId, {
      ...updateData,
      tags: Array.isArray(updateData.tags) ? updateData.tags : existingProject.tags,
      technologies: Array.isArray(updateData.technologies) ? updateData.technologies : existingProject.technologies,
    })

    return NextResponse.json(updatedProject)

  } catch (error) {
    console.error('更新项目错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}

// DELETE - 删除项目
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateUser(request)
    const { id: projectId } = await params

    // 验证项目是否属于当前用户
    const projects = await projectService.getUserProjects(user.id)
    const existingProject = projects.find(p => p.id === projectId)

    if (!existingProject) {
      return NextResponse.json(
        { error: '项目不存在或无权限' },
        { status: 404 }
      )
    }

    // 删除项目
    await projectService.deleteProject(projectId)

    return NextResponse.json({ message: '项目删除成功' })

  } catch (error) {
    console.error('删除项目错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}