import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { userService } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '缺少认证令牌' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // 验证用户令牌
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { error: '无效的认证令牌' },
        { status: 401 }
      )
    }

    // 获取用户的完整信息
    const userData = await userService.getUserById(user.id)

    return NextResponse.json({
      id: user.id,
      email: user.email,
      user_metadata: user.user_metadata,
      profile: userData
    })

  } catch (error) {
    console.error('获取用户信息错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}