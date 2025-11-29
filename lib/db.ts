import { MongoClient, Db, Collection, ObjectId } from 'mongodb'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db
  }

  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set')
  }

  client = new MongoClient(mongoUri)
  await client.connect()
  db = client.db()

  return db
}

export async function getCollection<T>(collectionName: string): Promise<Collection<T>> {
  const database = await connectToDatabase()
  return database.collection<T>(collectionName)
}

export interface User {
  _id?: ObjectId
  email: string
  password: string
  createdAt: Date
}

export interface FormSchema {
  title: string
  fields: Array<{
    name: string
    type: 'text' | 'email' | 'number' | 'image' | 'checkbox' | 'select'
    required: boolean
    placeholder?: string
    options?: string[]
  }>
}

export interface Form {
  _id?: ObjectId
  userId: string
  title: string
  purpose: string
  keywords: string[]
  schema: FormSchema
  shareLink: string
  embedding?: number[]
  createdAt: Date
  updatedAt?: Date
}

export interface Submission {
  _id?: ObjectId
  formId: string
  responses: Record<string, any>
  imageUrls: Record<string, string>
  submittedAt: Date
}

export interface CachedRetrieval {
  _id?: ObjectId
  queryHash: string
  userId: string
  retrievedForms: string[]
  expiresAt: Date
}
