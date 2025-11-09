import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const protectedPaths = ['/dashboard', '/ideas', '/ai-optimize', '/templates']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const authCookie = request.cookies.get('auth-storage')

    if (!authCookie) {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }

    try {
      const authState = JSON.parse(authCookie.value)
      if (!authState.state?.isAuthenticated) {
        const loginUrl = new URL('/login', request.url)
        return NextResponse.redirect(loginUrl)
      }
    } catch {
      const loginUrl = new URL('/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname === '/login') {
    const authCookie = request.cookies.get('auth-storage')

    if (authCookie) {
      try {
        const authState = JSON.parse(authCookie.value)
        if (authState.state?.isAuthenticated) {
          const dashboardUrl = new URL('/dashboard', request.url)
          return NextResponse.redirect(dashboardUrl)
        }
      } catch {
        // ignore parse failure and allow access to login page
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/ideas/:path*',
    '/ai-optimize/:path*',
    '/templates/:path*',
    '/login',
  ],
}
