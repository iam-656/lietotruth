import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// POST /api/scan
export async function POST(request) {
  try {
    // 1. Get URL from request body
    const { url } = await request.json()
    
    // 2. Validate URL
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json(
        { error: 'URL must start with http:// or https://' },
        { status: 400 }
      )
    }

    // 3. Analyze URL for scams (basic version for now)
    const analysis = analyzeURL(url)

    // 4. Save to database
    const { data: scan, error: dbError } = await supabase
      .from('scans')
      .insert({
        url: url,
        project_name: analysis.projectName,
        scam_score: analysis.scamScore,
        risk_level: analysis.riskLevel,
        red_flags: analysis.redFlags,
        is_public: true
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save scan' },
        { status: 500 }
      )
    }

    // 5. Return results
    return NextResponse.json({
      id: scan.id,
      url: scan.url,
      projectName: analysis.projectName,
      scamScore: analysis.scamScore,
      riskLevel: analysis.riskLevel,
      redFlags: analysis.redFlags
    })

  } catch (error) {
    console.error('Scan error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Simple scam detection function (we'll improve this later)
function analyzeURL(url) {
  const redFlags = []
  let scamScore = 0

  // Convert URL to lowercase for checking
  const urlLower = url.toLowerCase()
  
  // Red Flag 1: Suspicious keywords
  const scamKeywords = ['moon', 'safe', 'elon', 'guarantee', '1000x', 'get-rich']
  scamKeywords.forEach(keyword => {
    if (urlLower.includes(keyword)) {
      redFlags.push({
        type: 'suspicious_keyword',
        description: `URL contains suspicious keyword: "${keyword}"`,
        confidence: 0.75
      })
      scamScore += 15
    }
  })

  // Red Flag 2: Very new domain patterns
  if (urlLower.includes('2024') || urlLower.includes('2025')) {
    redFlags.push({
      type: 'new_domain_pattern',
      description: 'URL contains current year (often used by scams)',
      confidence: 0.60
    })
    scamScore += 10
  }

  // Red Flag 3: Multiple hyphens (common in scam domains)
  const hyphenCount = (url.match(/-/g) || []).length
  if (hyphenCount >= 3) {
    redFlags.push({
      type: 'excessive_hyphens',
      description: `Domain has ${hyphenCount} hyphens (suspicious)`,
      confidence: 0.70
    })
    scamScore += 12
  }

  // Red Flag 4: Suspicious TLDs
  const suspiciousTLDs = ['.xyz', '.top', '.click', '.loan', '.win', '.bid']
  suspiciousTLDs.forEach(tld => {
    if (urlLower.endsWith(tld)) {
      redFlags.push({
        type: 'suspicious_tld',
        description: `Uses suspicious domain extension: ${tld}`,
        confidence: 0.80
      })
      scamScore += 20
    }
  })

  // Calculate final score (cap at 100)
  scamScore = Math.min(scamScore, 100)

  // Determine risk level
  let riskLevel
  if (scamScore >= 70) {
    riskLevel = 'high'
  } else if (scamScore >= 40) {
    riskLevel = 'medium'
  } else {
    riskLevel = 'low'
  }

  // Extract project name from URL
  const projectName = extractProjectName(url)

  return {
    projectName,
    scamScore,
    riskLevel,
    redFlags
  }
}

// Extract project name from URL
function extractProjectName(url) {
  try {
    const urlObj = new URL(url)
    // Get domain without www. and TLD
    let domain = urlObj.hostname.replace('www.', '')
    const parts = domain.split('.')
    // Return the main part (e.g., "example" from "example.com")
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
  } catch {
    return 'Unknown Project'
  }
}