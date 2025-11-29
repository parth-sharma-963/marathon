import React, { useState } from 'react'
import Link from 'next/link'

interface AuthFormProps {
  isLogin?: boolean
  onSubmit: (email: string, password: string) => Promise<void>
  isLoading?: boolean
  error?: string
}

export const AuthForm: React.FC<AuthFormProps> = ({
  isLogin = false,
  onSubmit,
  isLoading = false,
  error = '',
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (!email || !password) {
      setLocalError('Email and password are required')
      return
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    try {
      await onSubmit(email, password)
    } catch (err: any) {
      setLocalError(err.message || 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>

        {(error || localError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error || localError}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <Link
            href={isLogin ? '/signup' : '/login'}
            className="text-primary hover:underline ml-1"
          >
            {isLogin ? 'Sign up' : 'Login'}
          </Link>
        </p>
      </div>
    </div>
  )
}
