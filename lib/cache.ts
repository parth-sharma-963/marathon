// Bonus: Caching utilities for form retrieval optimization
import { getCollection } from './db'

export interface CacheEntry {
  key: string
  value: any
  expiresAt: Date
  createdAt: Date
}

const CACHE_DURATION_MS = 60 * 60 * 1000 // 1 hour

export async function getCachedValue(key: string): Promise<any | null> {
  try {
    const cacheCollection = await getCollection<any>('cache')
    const entry = await cacheCollection.findOne({
      key,
      expiresAt: { $gt: new Date() },
    })

    return entry?.value || null
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export async function setCachedValue(key: string, value: any, ttl: number = CACHE_DURATION_MS) {
  try {
    const cacheCollection = await getCollection<any>('cache')
    await cacheCollection.updateOne(
      { key },
      {
        $set: {
          key,
          value,
          expiresAt: new Date(Date.now() + ttl),
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function clearExpiredCache() {
  try {
    const cacheCollection = await getCollection<any>('cache')
    await cacheCollection.deleteMany({
      expiresAt: { $lt: new Date() },
    })
  } catch (error) {
    console.error('Cache cleanup error:', error)
  }
}
