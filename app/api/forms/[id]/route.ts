import { NextRequest, NextResponse } from 'next/server'
import { getCollection, Form, Submission } from '@/lib/db'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { ObjectId, Filter } from 'mongodb'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const formsCollection = await getCollection<Form>('forms')
    const form = await formsCollection.findOne({ shareLink: resolvedParams.id })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: form._id?.toString(),
      title: form.title,
      purpose: form.purpose,
      schema: form.schema,
    })
  } catch (error) {
    console.error('Get form error:', error)
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const token = extractTokenFromHeader(request.headers.get('authorization') || undefined)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const formsCollection = await getCollection<Form>('forms')
    const filter: any = {
      _id: new ObjectId(resolvedParams.id),
      userId: payload.userId,
    }
    const form = await formsCollection.findOne(filter as any)

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Delete form
    await formsCollection.deleteOne({ _id: form._id })

    // Delete all submissions for this form
    const submissionsCollection = await getCollection<Submission>('submissions')
    await submissionsCollection.deleteMany({ formId: form._id!.toString() })

    return NextResponse.json({ message: 'Form and submissions deleted successfully' })
  } catch (error) {
    console.error('Delete form error:', error)
    return NextResponse.json({ error: 'Failed to delete form' }, { status: 500 })
  }
}
