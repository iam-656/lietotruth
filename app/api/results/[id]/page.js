'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const runtime = 'nodejs'

export default function ResultsPage() {
  const params = useParams()
  const [scan, setScan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchScan()
  }, [])

  async function fetchScan() {
    try {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      
      if (!data) {
        setError('Scan not found')
        return
      }

      setScan(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading scan results...</p>
        </div>
      </div>
    )
  }

  if (error || !scan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Scan not found'}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  // Determine color based on risk level
  const riskColors = {
    high: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      badge: 'bg-red-600'
    },
    medium: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      badge: 'bg-yellow-600'
    },
    low: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      badge: 'bg-green-600'
    }
  }

  const colors = riskColors[scan.risk_level] || riskColors.medium

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
            ← Scan another URL
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Scan Results</h1>
        </div>

        {/* URL Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">{scan.project_name}</h2>
          <p className="text-sm text-gray-600 break-all">{scan.url}</p>
          <p className="text-xs text-gray-400 mt-2">
            Scanned {new Date(scan.created_at).toLocaleString()}
          </p>
        </div>

        {/* Score Card */}
        <div className={`${colors.bg} ${colors.border} border-2 rounded-lg p-8 mb-6`}>
          <div className="text-center">
            <div className={`inline-block ${colors.badge} text-white px-4 py-2 rounded-full text-sm font-semibold mb-4`}>
              {scan.risk_level.toUpperCase()} RISK
            </div>
            
            <div className="mb-4">
              <div className="text-6xl font-bold text-gray-900">{scan.scam_score}</div>
              <div className="text-gray-600">/ 100 Scam Score</div>
            </div>

            {scan.risk_level === 'high' && (
              <p className={`${colors.text} font-semibold text-lg`}>
                ⚠️ High risk of scam - Do NOT invest
              </p>
            )}
            {scan.risk_level === 'medium' && (
              <p className={`${colors.text} font-semibold text-lg`}>
                ⚠️ Proceed with extreme caution
              </p>
            )}
            {scan.risk_level === 'low' && (
              <p className={`${colors.text} font-semibold text-lg`}>
                ✓ Low risk detected, but always do your own research
              </p>
            )}
          </div>
        </div>

        {/* Red Flags */}
        {scan.red_flags && scan.red_flags.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🚩 Red Flags Detected ({scan.red_flags.length})
            </h2>
            
            <div className="space-y-4">
              {scan.red_flags.map((flag, index) => (
                <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                  <h3 className="font-semibold text-gray-900">{flag.type.replace(/_/g, ' ').toUpperCase()}</h3>
                  <p className="text-gray-600 text-sm mt-1">{flag.description}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Confidence: {Math.round(flag.confidence * 100)}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {scan.red_flags && scan.red_flags.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <p className="text-gray-600">
              ✅ No obvious red flags detected. However, always do your own research before investing.
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
          <p className="font-semibold mb-2">⚠️ Disclaimer:</p>
          <p>
            This analysis is for informational purposes only and should not be considered financial advice.
            Always do your own research (DYOR) before investing in any cryptocurrency project.
          </p>
        </div>

      </div>
    </div>
  )
}