import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export interface GenerateFormOptions {
  prompt: string
  pastForms?: Array<{ title: string; purpose: string; fields: string[] }>
}

export interface FormField {
  name: string
  type: 'text' | 'email' | 'number' | 'image' | 'checkbox' | 'select'
  required: boolean
  placeholder?: string
  options?: string[]
}

export interface GeneratedForm {
  title: string
  purpose: string
  keywords: string[]
  fields: FormField[]
}

export async function generateFormSchema(options: GenerateFormOptions): Promise<GeneratedForm> {
  // Try latest free tier models in order
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro']
  let lastError: Error | null = null

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName })

      const contextStr = options.pastForms
        ? `\n\nHere are relevant forms the user created before:\n${options.pastForms
            .map((f) => `- Title: ${f.title}, Purpose: ${f.purpose}, Fields: ${f.fields.join(', ')}`)
            .join('\n')}`
        : ''

      const prompt = `You are a form schema generator. Generate a JSON form schema for the following request:

"${options.prompt}"
${contextStr}

Return a JSON object with this exact structure:
{
  "title": "Form Title",
  "purpose": "brief description of form purpose",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "fields": [
    {
      "name": "fieldName",
      "type": "text|email|number|image|checkbox|select",
      "required": true|false,
      "placeholder": "optional placeholder",
      "options": ["for", "select", "fields"]
    }
  ]
}

Important:
- Use appropriate field types (text, email, number, image, checkbox, select)
- For image uploads, use type "image"
- Make required fields true only when necessary
- Add helpful placeholders
- Include 3-5 keywords that describe the form
- Return ONLY valid JSON, no additional text`

      const result = await model.generateContent(prompt)
      const responseText = result.response.text()

      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('Failed to generate valid form schema')
      }

      const parsedForm = JSON.parse(jsonMatch[0]) as GeneratedForm
      console.log(`✓ Form generated successfully using model: ${modelName}`)
      return parsedForm
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(`⚠ Model ${modelName} failed:`, lastError.message)
      // Continue to next model
    }
  }

  // If all models fail, throw the last error
  throw new Error(
    `All Gemini models failed. Last error: ${lastError?.message || 'Unknown error'}. Please check your API key and ensure it has access to Gemini models.`
  )
}

export function extractKeywords(text: string): string[] {
  // Simple keyword extraction: split on spaces, filter short words
  const words = text
    .toLowerCase()
    .split(/[\s,;.!?]+/)
    .filter((w) => w.length > 3)

  // Remove common words
  const stopwords = new Set([
    'form',
    'with',
    'need',
    'have',
    'that',
    'this',
    'what',
    'from',
    'where',
  ])

  return [...new Set(words.filter((w) => !stopwords.has(w)))].slice(0, 10)
}
