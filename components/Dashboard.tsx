import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface FormItem {
  id: string
  title: string
  purpose: string
  shareLink: string
  createdAt: string
  url: string
}

interface SubmissionItem {
  id: string
  responses: Record<string, any>
  imageUrls: Record<string, string>
  submittedAt: string
}

interface DashboardProps {
  token: string
}

export const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [forms, setForms] = useState<FormItem[]>([])
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [copiedLink, setCopiedLink] = useState<string | null>(null)

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/forms', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to fetch forms')

      const data = await response.json()
      setForms(data.forms)
    } catch (err) {
      setError('Failed to load forms')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubmissions = async (formId: string) => {
    try {
      const response = await fetch(`/api/forms/${formId}/submissions`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to fetch submissions')

      const data = await response.json()
      setSubmissions(data.submissions)
    } catch (err) {
      setError('Failed to load submissions')
    }
  }

  const handleFormSelect = (formId: string) => {
    setSelectedForm(formId)
    fetchSubmissions(formId)
  }

  const deleteForm = async (formId: string) => {
    if (!confirm('Are you sure you want to delete this form and all its submissions?')) return

    try {
      setDeleting(formId)
      const response = await fetch(`/api/forms/${formId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to delete form')

      setForms(forms.filter(f => f.id !== formId))
      if (selectedForm === formId) {
        setSelectedForm(null)
        setSubmissions([])
      }
      setError('')
    } catch (err) {
      setError('Failed to delete form')
    } finally {
      setDeleting(null)
    }
  }

  const deleteSubmission = async (submissionId: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return

    try {
      setDeleting(submissionId)
      const response = await fetch(`/api/forms/${selectedForm}/submissions?submissionId=${submissionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to delete submission')

      setSubmissions(submissions.filter(s => s.id !== submissionId))
      setError('')
    } catch (err) {
      setError('Failed to delete submission')
    } finally {
      setDeleting(null)
    }
  }

  const copyToClipboard = (formId: string, url: string) => {
    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${url}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedLink(formId)
    setTimeout(() => setCopiedLink(null), 2000)
  }

  const shareForm = (formId: string, title: string, url: string) => {
    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${url}`
    if (navigator.share) {
      navigator.share({
        title: `Check out my form: ${title}`,
        url: fullUrl,
      })
    } else {
      copyToClipboard(formId, url)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          href="/create"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Form
        </Link>
      </div>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Forms List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Your Forms</h2>
            {forms.length === 0 ? (
              <p className="text-gray-500">No forms yet. Create one to get started!</p>
            ) : (
              <div className="space-y-3">
                {forms.map((form) => (
                  <div
                    key={form.id}
                    className={`p-4 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedForm === form.id ? 'border-primary bg-blue-50' : ''
                    }`}
                  >
                    <div onClick={() => handleFormSelect(form.id)}>
                      <h3 className="font-semibold">{form.title}</h3>
                      <p className="text-sm text-gray-600">{form.purpose}</p>
                    </div>
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        <a
                          href={form.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Preview
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            shareForm(form.id, form.title, form.url)
                          }}
                          className="flex-1 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                        >
                          {copiedLink === form.id ? '✓ Copied!' : 'Share'}
                        </button>
                      </div>
                      <div className="text-xs bg-gray-100 p-2 rounded break-all">
                        <strong>Link:</strong> {`${typeof window !== 'undefined' ? window.location.origin : 'localhost:3000'}${form.url}`}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteForm(form.id)
                        }}
                        disabled={deleting === form.id}
                        className="w-full bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                      >
                        {deleting === form.id ? 'Deleting...' : 'Delete Form'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submissions List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">
              {selectedForm ? 'Submissions' : 'Select a form to view submissions'}
            </h2>
            {selectedForm && submissions.length === 0 ? (
              <p className="text-gray-500">No submissions yet</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {submissions.map((submission) => (
                  <div key={submission.id} className="p-4 border rounded">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleString()}
                      </p>
                      <button
                        onClick={() => deleteSubmission(submission.id)}
                        disabled={deleting === submission.id}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold disabled:opacity-50"
                      >
                        {deleting === submission.id ? '...' : '✕ Delete'}
                      </button>
                    </div>
                    <div className="mt-2 space-y-2">
                      {Object.entries(submission.responses).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <strong>{key}:</strong> {String(value)}
                        </div>
                      ))}
                    </div>
                    {Object.keys(submission.imageUrls).length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm font-semibold mb-2">Images:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(submission.imageUrls).map(([key, imageUrl]) => (
                            <div key={key}>
                              <p className="text-xs text-gray-600 mb-1">{key}</p>
                              <img
                                src={imageUrl}
                                alt={key}
                                onClick={() => setSelectedImage(imageUrl)}
                                className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-75"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white rounded-lg p-4 max-w-2xl max-h-96">
            <img src={selectedImage} alt="Full view" className="w-full h-full object-contain" />
            <button
              onClick={() => setSelectedImage(null)}
              className="mt-4 w-full bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
