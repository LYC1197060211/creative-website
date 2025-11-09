import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: '邮箱和密码是必需的' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    // 获取或创建用户记录
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .upsert({
          id: data.user.id,
          email: data.user.email!,
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'User',
          avatar_url: data.user.user_metadata?.avatar_url,
        })
        .select()
        .single()

      if (userError) {
        console.error('用户记录创建/更新失败:', userError)
      }

      return NextResponse.json({
        user: {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata,
          profile: userData
        },
        session: data.session
      })
    }

    return NextResponse.json({ user: data.user, session: data.session })

  } catch (error) {
    console.error('登录错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}