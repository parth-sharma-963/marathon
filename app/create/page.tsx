'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FormGenerator } from '@/components/FormGenerator'
import Link from 'next/link'

export default function CreatePage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [generatedForm, setGeneratedForm] = useState<any>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      router.push('/login')
    } else {
      setToken(storedToken)
      setLoading(false)
    }
  }, [router])

  const handleGenerate = async (prompt: string, options: any) => {
    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/forms/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt, ...options }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate form')
      }

      const data = await response.json()
      setGeneratedForm(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  if (loading || !token) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Create New Form</h1>
          <Link href="/dashboard" className="text-primary hover:underline">
            Back to Dashboard
          </Link>
        </div>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormGenerator onGenerate={handleGenerate} isLoading={isGenerating} />
          </div>

          {generatedForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Preview</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Title</p>
                  <p className="font-semibold">{generatedForm.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Purpose</p>
                  <p className="text-sm">{generatedForm.purpose}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Keywords</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {generatedForm.keywords?.map((k: string) => (
                      <span key={k} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fields ({generatedForm.schema?.length || 0})</p>
                  <ul className="mt-2 space-y-1">
                    {generatedForm.schema?.map((field: any, idx: number) => (
                      <li key={idx} className="text-sm">
                        • <strong>{field.name}</strong> ({field.type})
                        {field.required && <span className="text-red-500">*</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded">
                  <p className="text-green-800 text-sm">
                    ✓ Form created! Share link: <strong>{generatedForm.shareLink}</strong>
                  </p>
                </div>
                <a
                  href={generatedForm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-primary text-white py-2 rounded hover:bg-blue-600"
                >
                  View Form
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
