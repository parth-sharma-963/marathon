import { NextRequest, NextResponse } from 'next/server'
import { getCollection, Form, Submission } from '@/lib/db'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params
    const { responses, imageUrls } = await request.json()

    const formsCollection = await getCollection<Form>('forms')
    const form = await formsCollection.findOne({ shareLink: resolvedParams.id })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const submissionsCollection = await getCollection<Submission>('submissions')
    const result = await submissionsCollection.insertOne({
      formId: form._id.toString(),
      responses,
      imageUrls: imageUrls || {},
      submittedAt: new Date(),
    })

    return NextResponse.json(
      {
        message: 'Submission received',
        submissionId: result.insertedId.toString(),
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json({ error: 'Failed to submit form' }, { status: 500 })
  }
}
