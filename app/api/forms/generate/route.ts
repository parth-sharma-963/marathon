import { NextRequest, NextResponse } from 'next/server'
import { generateFormSchema, extractKeywords } from '@/lib/ai'
import { getCollection, Form, FormSchema } from '@/lib/db'
import { retrieveRelevantForms, buildContextPrompt } from '@/lib/retrieval'
import { extractTokenFromHeader, verifyToken } from '@/lib/auth'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromHeader(request.headers.get('authorization'))
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { prompt, useTemplates = false, useEmbeddings = false } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Retrieve relevant past forms for context
    const keywords = extractKeywords(prompt)
    const relevantForms = await retrieveRelevantForms(
      payload.userId,
      prompt,
      keywords,
      useEmbeddings,
      5
    )

    // Generate form schema with context
    const contextStr = buildContextPrompt(relevantForms)
    const generatedForm = await generateFormSchema({
      prompt,
      pastForms: relevantForms.map((f) => ({
        title: f.title,
        purpose: f.purpose,
        fields: f.schema.fields.map((field) => field.name),
      })),
    })

    // Create shareLink
    const shareLink = nanoid(10)

    // Save to database
    const formsCollection = await getCollection<Form>('forms')
    const result = await formsCollection.insertOne({
      userId: payload.userId,
      title: generatedForm.title,
      purpose: generatedForm.purpose,
      keywords: generatedForm.keywords,
      schema: {
        title: generatedForm.title,
        fields: generatedForm.fields,
      },
      shareLink,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any)

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        title: generatedForm.title,
        purpose: generatedForm.purpose,
        keywords: generatedForm.keywords,
        schema: generatedForm.fields,
        shareLink,
        url: `/form/${shareLink}`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Form generation error:', error)
    return NextResponse.json({ error: 'Failed to generate form' }, { status: 500 })
  }
}
