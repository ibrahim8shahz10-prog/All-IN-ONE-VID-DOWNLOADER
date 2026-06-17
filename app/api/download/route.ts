import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url, quality } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 })
    }

    const isAudio = quality === 'audio'

    // Modern Cobalt API accepts these specific videoQuality strings
    const qualityMap: Record<string, string> = {
      max: 'max',
      '1080': '1080',
      '720': '720',
      '480': '480',
      audio: 'max',
    }

    // Modern API uses the root path '/' instead of the deprecated '/api/json'
    // Update the base URL below if you are using a specific custom/self-hosted instance
    const cobaltRes = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        videoQuality: qualityMap[quality] || '1080',
        downloadMode: isAudio ? 'audio' : 'video',
        filenamePattern: 'pretty',
      }),
    })

    // Handle standard HTTP error statuses returned by modern Cobalt instances
    if (!cobaltRes.ok) {
      try {
        const errorData = await cobaltRes.json()
        return NextResponse.json(
          { error: errorData.text || `Cobalt API error (${cobaltRes.status})` },
          { status: cobaltRes.status }
        )
      } catch {
        return NextResponse.json(
          { error: `Cobalt service returned an error status: ${cobaltRes.status}` },
          { status: 500 }
        )
      }
    }

    const data = await cobaltRes.json()

    // Handle generic status types ('redirect', 'stream', 'tunnel') 
    // where a direct url is provided in the top-level response
    if (data.status === 'redirect' || data.status === 'stream' || data.status === 'tunnel') {
      return NextResponse.json({
        url: data.url,
        filename: data.filename || 'media.mp4',
      })
    }

    // Handle 'picker' status type (e.g., multiple images/videos from TikTok or gallery posts)
    if (data.status === 'picker') {
      return NextResponse.json({
        url: data.picker?.[0]?.url || null,
        filename: data.picker?.[0]?.filename || 'media.mp4',
        picker: data.picker, // Forward all items if the frontend wants to display a gallery selector
      })
    }

    // Handle direct status fallbacks if 'status' isn't explicitly mapped but a url is returned
    if (data.url) {
      return NextResponse.json({
        url: data.url,
        filename: data.filename || 'download.mp4',
      })
    }

    return NextResponse.json(
      { error: 'Unexpected response format from Cobalt. Try another URL.' },
      { status: 500 }
    )

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error processing the download request.' },
      { status: 500 }
    )
  }
}
