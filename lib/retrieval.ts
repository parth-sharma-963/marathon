import { Form } from './db'
import crypto from 'crypto'
import { getCollection } from './db'

function hashQuery(query: string, userId: string): string {
  return crypto.createHash('md5').update(`${query}-${userId}`).digest('hex')
}

export async function retrieveRelevantForms(
  userId: string,
  query: string,
  keywords: string[],
  useEmbeddings: boolean = false,
  limit: number = 5
): Promise<Form[]> {
  const formsCollection = await getCollection<Form>('forms')
  const cachingCollection = await getCollection<any>('cache')

  // Check cache first
  const queryHash = hashQuery(query, userId)
  const cached = await cachingCollection.findOne({
    queryHash,
    userId,
    expiresAt: { $gt: new Date() },
  })

  if (cached) {
    const cachedForms = await formsCollection
      .find({
        _id: { $in: cached.retrievedForms.map((id: string) => ({ $oid: id })) },
      })
      .toArray()
    return cachedForms
  }

  let retrievedForms: Form[] = []

  if (useEmbeddings) {
    // Use embedding-based retrieval (bonus feature)
    retrievedForms = await retrieveByEmbeddings(userId, query, limit)
  } else {
    // Use keyword-based retrieval
    retrievedForms = await retrieveByKeywords(userId, keywords, limit)
  }

  // Cache the result for 1 hour
  await cachingCollection.updateOne(
    { queryHash, userId },
    {
      $set: {
        queryHash,
        userId,
        retrievedForms: retrievedForms.map((f) => f._id?.toString()),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    },
    { upsert: true }
  )

  return retrievedForms
}

async function retrieveByKeywords(userId: string, keywords: string[], limit: number): Promise<Form[]> {
  const formsCollection = await getCollection<Form>('forms')

  const forms = await formsCollection
    .find({
      userId,
      keywords: { $in: keywords },
    })
    .limit(limit)
    .toArray()

  return forms
}

async function retrieveByEmbeddings(
  userId: string,
  query: string,
  limit: number
): Promise<Form[]> {
  // This would use Pinecone for vector similarity search
  // For now, returning empty array - will be implemented in bonus section
  try {
    // TODO: Implement Pinecone vector search
    return []
  } catch (error) {
    console.error('Embedding retrieval failed:', error)
    return []
  }
}

export function buildContextPrompt(forms: Form[]): string {
  if (forms.length === 0) {
    return ''
  }

  return `\n\nHere are relevant forms the user created before:\n${forms
    .map(
      (f) =>
        `- Title: "${f.title}", Purpose: "${f.purpose}", Fields: ${f.schema.fields
          .map((field) => field.name)
          .join(', ')}`
    )
    .join('\n')}`
}
