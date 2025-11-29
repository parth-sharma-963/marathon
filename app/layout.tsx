import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FormBuilder AI',
  description: 'AI-powered form builder with smart context memory',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
