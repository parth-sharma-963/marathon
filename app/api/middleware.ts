import { NextRequest, NextResponse } from 'next/server'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = extractTokenFromHeader(request.headers.get('authorization'))

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }

  return payload
}

export function withAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    const payload = middleware(request)

    if (payload instanceof NextResponse) {
      return payload
    }

    return handler(request, context, payload)
  }
}
