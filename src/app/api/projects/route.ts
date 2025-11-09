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

// GET - 获取项目列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')

    // 如果请求精选项目，不需要认证
    if (featured === 'true') {
      const projects = await projectService.getFeaturedProjects()
      return NextResponse.json(projects)
    }

    // 否则需要认证并获取用户项目
    const user = await authenticateUser(request)
    const projects = await projectService.getUserProjects(user.id)

    return NextResponse.json(projects)
  } catch (error) {
    console.error('获取项目列表错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}

// POST - 创建新项目
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request)
    const projectData = await request.json()

    // 验证必需字段
    if (!projectData.title || !projectData.description || !projectData.content || !projectData.category) {
      return NextResponse.json(
        { error: '标题、描述、内容和分类是必需的' },
        { status: 400 }
      )
    }

    // 创建项目时添加用户ID
    const newProject = await projectService.createProject({
      ...projectData,
      user_id: user.id,
      status: projectData.status || 'draft',
      tags: Array.isArray(projectData.tags) ? projectData.tags : [],
      technologies: Array.isArray(projectData.technologies) ? projectData.technologies : [],
      featured: projectData.featured || false,
    })

    return NextResponse.json(newProject, { status: 201 })

  } catch (error) {
    console.error('创建项目错误:', error)
    const status = error instanceof Error && error.message.includes('认证') ? 401 : 500
    const message = error instanceof Error ? error.message : '服务器内部错误'

    return NextResponse.json(
      { error: message },
      { status }
    )
  }
}