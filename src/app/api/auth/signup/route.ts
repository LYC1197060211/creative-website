import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, username } = await request.json()

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: '邮箱、密码和用户名都是必需的' },
        { status: 400 }
      )
    }

    // 检查用户名是否已存在
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已被使用' },
        { status: 409 }
      )
    }

    // 创建 Supabase 用户
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        }
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // 创建用户记录
    if (data.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          username: username,
        })
        .select()
        .single()

      if (userError) {
        console.error('用户记录创建失败:', userError)
        // 如果用户记录创建失败，尝试删除已创建的认证用户
        await supabase.auth.admin.deleteUser(data.user.id)
        return NextResponse.json(
          { error: '用户创建失败，请重试' },
          { status: 500 }
        )
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

    return NextResponse.json(
      { error: '用户创建失败' },
      { status: 500 }
    )

  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}