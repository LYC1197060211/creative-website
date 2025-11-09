import { NextRequest, NextResponse } from 'next/server'
import { templateService } from '@/lib/database'

// GET - 获取模板列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')

    let templates = []

    if (featured === 'true') {
      // 获取精选模板
      templates = await templateService.getFeaturedTemplates()
    } else if (category) {
      // 按分类获取模板
      templates = await templateService.getTemplatesByCategory(category)
    } else {
      // 获取所有模板
      templates = await templateService.getAllTemplates()
    }

    return NextResponse.json(templates)
  } catch (error) {
    console.error('获取模板列表错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

// POST - 创建新模板（管理员功能，需要管理员认证）
export async function POST(request: NextRequest) {
  try {
    const templateData = await request.json()

    // 验证必需字段
    if (!templateData.title || !templateData.description || !templateData.content || !templateData.category || !templateData.author) {
      return NextResponse.json(
        { error: '标题、描述、内容、分类和作者是必需的' },
        { status: 400 }
      )
    }

    // 创建模板
    const newTemplate = await templateService.createTemplate({
      ...templateData,
      tags: Array.isArray(templateData.tags) ? templateData.tags : [],
      prerequisites: Array.isArray(templateData.prerequisites) ? templateData.prerequisites : [],
      learning_objectives: Array.isArray(templateData.learning_objectives) ? templateData.learning_objectives : [],
      rating: templateData.rating || 0,
      review_count: templateData.review_count || 0,
      usage_count: templateData.usage_count || 0,
      featured: templateData.featured || false,
      difficulty: templateData.difficulty || 'beginner',
    })

    return NextResponse.json(newTemplate, { status: 201 })

  } catch (error) {
    console.error('创建模板错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}