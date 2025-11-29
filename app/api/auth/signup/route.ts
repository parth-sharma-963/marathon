import { NextRequest, NextResponse } from 'next/server'
import { getCollection, User } from '@/lib/db'
import { hashPassword, comparePassword } from '@/lib/password'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const usersCollection = await getCollection<User>('users')
    const user = await usersCollection.findOne({ email })

    if (user) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    const token = generateToken({
      userId: result.insertedId.toString(),
      email,
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        token,
        user: {
          id: result.insertedId.toString(),
          email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
