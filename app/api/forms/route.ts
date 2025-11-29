import { NextRequest, NextResponse } from 'next/server'
import { getCollection, Form } from '@/lib/db'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization') || undefined)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const formsCollection = await getCollection<Form>('forms')
    const forms = await formsCollection
      .find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({
      forms: forms.map((form: any) => ({
        id: form._id?.toString(),
        title: form.title,
        purpose: form.purpose,
        shareLink: form.shareLink,
        createdAt: form.createdAt,
        url: `/form/${form.shareLink}`,
      })),
    })
  } catch (error) {
    console.error('Get forms error:', error)
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 })
  }
}
