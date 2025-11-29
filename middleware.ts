import { NextRequest, NextResponse } from 'next/server'

// Middleware for protecting routes
export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // Public routes (no auth required)
  const publicRoutes = ['/login', '/signup', '/', '/form/']

  const isPublicRoute = publicRoutes.some((route) =>
    pathname === route || pathname.startsWith(route)
  )

  // If accessing protected route without token, redirect to login
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
