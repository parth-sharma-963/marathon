'use client'

import { useEffect, useState } from 'react'
import { FormRenderer } from '@/components/FormRenderer'
import { useRouter } from 'next/navigation'

interface FormSchema {
  title: string
  fields: any[]
}

export default function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formId, setFormId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params
      setFormId(resolvedParams.id)
    }
    resolveParams()
  }, [params])

  useEffect(() => {
    if (formId) {
      fetchForm()
    }
  }, [formId])

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}`)
      if (!response.ok) throw new Error('Form not found')

      const data = await response.json()
      setSchema(data.schema)
    } catch (err) {
      setError('Failed to load form')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (data: any, imageUrls: Record<string, string>) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/forms/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          responses: data,
          imageUrls,
        }),
      })

      if (!response.ok) throw new Error('Submission failed')

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setSchema(null)
        fetchForm()
      }, 3000)
    } catch (err) {
      setError('Failed to submit form')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading form...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-green-600">Thank you!</h1>
          <p className="text-gray-600 mt-2">Your submission was received successfully.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {schema && <FormRenderer schema={schema} onSubmit={handleSubmit} isLoading={isSubmitting} />}
    </div>
  )
}
