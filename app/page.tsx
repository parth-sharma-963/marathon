import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-blue-400 to-secondary text-white">
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">FormBuilder AI</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Generate beautiful forms with plain English. AI remembers your patterns.
        </p>

        <div className="flex gap-4 justify-center mb-12">
          <Link
            href="/login"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Sign Up
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white/10 backdrop-blur p-8 rounded-lg">
            <div className="text-3xl mb-3">🎨</div>
            <h3 className="text-xl font-bold mb-2">Describe in English</h3>
            <p className="opacity-90">
              Just describe what form you need in plain English. AI generates it instantly.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur p-8 rounded-lg">
            <div className="text-3xl mb-3">🧠</div>
            <h3 className="text-xl font-bold mb-2">Smart Memory</h3>
            <p className="opacity-90">
              AI remembers your previous forms and adapts to your style and preferences.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur p-8 rounded-lg">
            <div className="text-3xl mb-3">🔗</div>
            <h3 className="text-xl font-bold mb-2">Share & Collect</h3>
            <p className="opacity-90">
              Get a shareable link, collect submissions, and manage responses all in one place.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-white/10 backdrop-blur p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Key Features</h2>
          <ul className="space-y-2 text-left inline-block">
            <li>✓ AI-powered form generation</li>
            <li>✓ Image upload support</li>
            <li>✓ Context-aware form memory</li>
            <li>✓ Form templates for quick start</li>
            <li>✓ Semantic search with embeddings</li>
            <li>✓ Response caching & optimization</li>
            <li>✓ Public shareable links</li>
            <li>✓ Submissions dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
