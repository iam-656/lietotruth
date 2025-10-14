'use client' 

import { useState } from 'react'

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!url) {
      alert('Please enter a URL')
      return
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
    alert('URL must start with http:// or https://')
    return
  }

    setIsLoading(true)
    // Simulate scanning (we'll add real logic later)
    setTimeout(() => {
      alert(`Scanning: ${url}`)
      setIsLoading(false)
    }, 1000)
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

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <label className="block text-left text-sm font-medium text-gray-700 mb-2">
              Enter Crypto Project URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example-crypto-project.com"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-600 text-black"
                disabled={isLoading}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {isLoading ? 'Scanning...' : 'Check Now'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              ✓ Free scan • No signup required • Instant results
            </p>
          </form>

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