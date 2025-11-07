import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 需要登录的页面路径
const protectedPaths = ['/dashboard', '/ideas', '/ai-optimize', '/templates']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 检查是否访问受保护的页面
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    // 检查是否有认证token
    const authCookie = request.cookies.get('auth-storage')

    if (!authCookie) {
      // 重定向到登录页面
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    try {
      // 解析认证状态
      const authState = JSON.parse(authCookie.value)
      if (!authState.state?.isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
      }
    } catch (error) {
      // 如果解析失败，重定向到登录页面
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 如果已登录用户访问登录页面，重定向到仪表板
  if (pathname === '/login') {
    const authCookie = request.cookies.get('auth-storage')

    if (authCookie) {
      try {
        const authState = JSON.parse(authCookie.value)
        if (authState.state?.isAuthenticated) {
          const dashboardUrl = new URL('/dashboard', request.url)
          return NextResponse.redirect(dashboardUrl)
        }
      } catch (error) {
        // 解析失败，继续到登录页面
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}