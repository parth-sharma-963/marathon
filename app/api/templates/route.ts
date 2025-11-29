import { NextRequest, NextResponse } from 'next/server'
import { listTemplates, getTemplateByName } from '@/lib/templates'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      templates: listTemplates(),
    })
  } catch (error: any) {
    console.error('Get templates error:', error)
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { templateName } = await request.json()

    if (!templateName) {
      return NextResponse.json({ error: 'Template name required' }, { status: 400 })
    }

    const template = getTemplateByName(templateName as any)

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    return NextResponse.json({
      template: template.schema,
    })
  } catch (error: any) {
    console.error('Get template error:', error)
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 })
  }
}
