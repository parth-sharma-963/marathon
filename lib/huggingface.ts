// Bonus: Generate embeddings using HuggingFace
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const embedding = await hf.featureExtraction({
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      inputs: text,
    })

    return embedding as number[]
  } catch (error) {
    console.error('Failed to generate embedding:', error)
    return []
  }
}

export async function generateFormEmbedding(
  title: string,
  purpose: string,
  keywords: string[]
): Promise<number[]> {
  const combinedText = `${title} ${purpose} ${keywords.join(' ')}`
  return generateEmbedding(combinedText)
}
