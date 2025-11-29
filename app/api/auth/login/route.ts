import { NextRequest, NextResponse } from 'next/server'
import { getCollection, User } from '@/lib/db'
import { comparePassword } from '@/lib/password'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const usersCollection = await getCollection<User>('users')
    const user = await usersCollection.findOne({ email })

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const userPassword: string = user.password || ''
    const isPasswordValid = await comparePassword(password, userPassword)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = generateToken({
      userId: user._id!.toString(),
      email: user.email,
    })

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id!.toString(),
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
