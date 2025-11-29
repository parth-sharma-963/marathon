import React, { useState } from 'react'

interface FormGeneratorProps {
  onGenerate: (prompt: string, options: any) => Promise<void>
  isLoading?: boolean
}

export const FormGenerator: React.FC<FormGeneratorProps> = ({ onGenerate, isLoading = false }) => {
  const [prompt, setPrompt] = useState('')
  const [useEmbeddings, setUseEmbeddings] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!prompt.trim()) {
      setError('Please describe your form')
      return
    }

    try {
      await onGenerate(prompt, { useEmbeddings })
    } catch (err) {
      setError('Failed to generate form')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Generate a Form</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mb-4">
        <label className="block font-semibold mb-2">Describe your form:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'I need a job application form with name, email, resume upload, and cover letter'"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
          rows={4}
        />
      </div>

      <div className="mb-4 flex items-center space-x-2">
        <input
          type="checkbox"
          id="embeddings"
          checked={useEmbeddings}
          onChange={(e) => setUseEmbeddings(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="embeddings" className="text-sm text-gray-700">
          Use semantic search (better matching, requires Pinecone)
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Generating...' : 'Generate Form'}
      </button>
    </form>
  )
}
