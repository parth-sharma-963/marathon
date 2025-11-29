// Bonus: Pinecone Vector Store Integration for semantic search
import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
})

export async function initPinecone() {
  if (!process.env.PINECONE_API_KEY) {
    console.warn('Pinecone API key not configured. Embeddings disabled.')
    return null
  }

  try {
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME || 'form-builder')
    return index
  } catch (error) {
    console.error('Failed to initialize Pinecone:', error)
    return null
  }
}

export async function storeFormEmbedding(
  formId: string,
  embedding: number[],
  metadata: Record<string, any>
) {
  const index = await initPinecone()
  if (!index) return

  try {
    await index.upsert([
      {
        id: formId,
        values: embedding,
        metadata,
      },
    ])
  } catch (error) {
    console.error('Failed to store embedding:', error)
  }
}

export async function queryFormsByEmbedding(embedding: number[], topK: number = 5) {
  const index = await initPinecone()
  if (!index) return []

  try {
    const results = await index.query({
      vector: embedding,
      topK,
      includeMetadata: true,
    })

    return results.matches.map((match) => ({
      id: match.id,
      score: match.score,
      metadata: match.metadata,
    }))
  } catch (error) {
    console.error('Failed to query embeddings:', error)
    return []
  }
}
