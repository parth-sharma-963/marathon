import React, { useState, useEffect } from 'react'

interface FormField {
  name: string
  type: 'text' | 'email' | 'number' | 'image' | 'checkbox' | 'select'
  required: boolean
  placeholder?: string
  options?: string[]
}

interface FormRendererProps {
  schema: {
    title: string
    fields: FormField[]
  }
  onSubmit: (data: any, images: Record<string, string>) => Promise<void>
  isLoading?: boolean
}

export const FormRenderer: React.FC<FormRendererProps> = ({
  schema,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string>('')

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleImageUpload = async (fieldName: string, file: File) => {
    setUploading((prev) => ({ ...prev, [fieldName]: true }))
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setImageUrls((prev) => ({
        ...prev,
        [fieldName]: data.url,
      }))

      handleInputChange(fieldName, file.name)
    } catch (err) {
      setError('Failed to upload image')
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate required fields
    for (const field of schema.fields) {
      if (field.required && !formData[field.name] && !imageUrls[field.name]) {
        setError(`${field.name} is required`)
        return
      }
    }

    try {
      await onSubmit(formData, imageUrls)
    } catch (err) {
      setError('Failed to submit form')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-6">{schema.title}</h1>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="space-y-6">
        {schema.fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="font-semibold mb-2">
              {field.name}
              {field.required && <span className="text-red-500">*</span>}
            </label>

            {field.type === 'text' && (
              <input
                type="text"
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required={field.required}
              />
            )}

            {field.type === 'email' && (
              <input
                type="email"
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required={field.required}
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required={field.required}
              />
            )}

            {field.type === 'checkbox' && (
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData[field.name] || false}
                  onChange={(e) => handleInputChange(field.name, e.target.checked)}
                  className="w-4 h-4"
                  required={field.required}
                />
                <span>I agree to the terms</span>
              </label>
            )}

            {field.type === 'select' && (
              <select
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required={field.required}
              >
                <option value="">Select an option</option>
                {field.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'image' && (
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageUpload(field.name, e.target.files[0])
                    }
                  }}
                  className="p-2 border rounded flex-1"
                  disabled={uploading[field.name]}
                  required={field.required && !imageUrls[field.name]}
                />
                {uploading[field.name] && <span className="text-sm text-gray-500">Uploading...</span>}
                {imageUrls[field.name] && <span className="text-sm text-green-600">✓ Uploaded</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading || Object.values(uploading).some((v) => v)}
        className="mt-8 w-full bg-primary text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
