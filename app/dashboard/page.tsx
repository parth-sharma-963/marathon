'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Dashboard } from '@/components/Dashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (!storedToken) {
      router.push('/login')
    } else {
      setToken(storedToken)
      setLoading(false)
    }
  }, [router])

  if (loading || !token) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return <Dashboard token={token} />
}
