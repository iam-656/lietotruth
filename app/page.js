'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate
    if (!url) {
      setError('Please enter a URL')
      return
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://')
      return
    }

    setIsLoading(true)

    try {
      // Call our API
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Scan failed')
      }

      // Redirect to results page
      router.push(`/results/${data.id}`)

    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-20">
        
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            LietoTruth
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Detect Crypto Scams in 30 Seconds
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Analyze any crypto project, token, or NFT for scam signals before you invest.
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              Enter Crypto Project URL
            </label>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example-crypto-project.com"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600 text-black"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Scanning...
                  </span>
                ) : 'Check Now'}
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-3">
              ✓ Free scan • No signup required • Instant results
            </p>
          </form>

          {/* Trust Indicators */}
          <div className="mt-12 flex justify-center gap-8 text-sm text-gray-600">
            <div>✅ AI-Powered</div>
            <div>✅ 47+ Red Flags Checked</div>
            <div>✅ Free Forever</div>
          </div>
        </div>

      </div>
    </main>
  )
}