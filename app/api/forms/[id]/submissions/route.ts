import { NextRequest, NextResponse } from 'next/server'
import { getCollection, Form, Submission } from '@/lib/db'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Verify form ownership
    const formsCollection = await getCollection<Form>('forms')
    const form = await formsCollection.findOne({
      _id: new ObjectId(resolvedParams.id),
      userId: payload.userId,
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Get submissions
    const submissionsCollection = await getCollection<Submission>('submissions')
    const submissions = await submissionsCollection
      .find({
        formId: form._id!.toString(),
      })
      .sort({ submittedAt: -1 })
      .toArray()

    return NextResponse.json({
      formId: form._id!.toString(),
      formTitle: form.title,
      submissions: submissions.map((sub: any) => ({
        id: sub._id.toString(),
        responses: sub.responses,
        imageUrls: sub.imageUrls,
        submittedAt: sub.submittedAt,
      })),
    })
  } catch (error) {
    console.error('Get submissions error:', error)
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
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

    // Verify form ownership
    const formsCollection = await getCollection<Form>('forms')
    const form = await formsCollection.findOne({
      _id: new ObjectId(resolvedParams.id),
      userId: payload.userId,
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    // Get submission ID from query params
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('submissionId')

    if (!submissionId) {
      return NextResponse.json({ error: 'Submission ID required' }, { status: 400 })
    }

    // Delete submission
    const submissionsCollection = await getCollection<Submission>('submissions')
    const result = await submissionsCollection.deleteOne({
      _id: new ObjectId(submissionId),
      formId: form._id!.toString(),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Submission deleted successfully' })
  } catch (error) {
    console.error('Delete submission error:', error)
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 })
  }
}
