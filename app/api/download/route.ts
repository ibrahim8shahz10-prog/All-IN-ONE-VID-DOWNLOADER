import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url, quality } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 })
    }

    // Map quality to Cobalt params
    const qualityMap: Record<string, string> = {
      max: '9000',
      '1080': '1080',
      '720': '720',
      '480': '480',
      audio: '9000',
    }

    const isAudio = quality === 'audio'

    const cobaltRes = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        vQuality: qualityMap[quality] || '9000',
        isAudioOnly: isAudio,
        filenamePattern: 'pretty',
        disableMetadata: false,
      }),
    })

    const data = await cobaltRes.json()

    if (data.status === 'error' || data.status === 'rate-limit') {
      return NextResponse.json(
        { error: data.text || 'Cobalt API error. Try again.' },
        { status: 500 }
      )
    }

    if (data.status === 'redirect' || data.status === 'stream') {
      return NextResponse.json({
        url: data.url,
        filename: data.filename || 'video.mp4',
      })
    }

    if (data.status === 'picker') {
      // Return first option for simplicity
      return NextResponse.json({
        url: data.picker[0]?.url,
        filename: 'video.mp4',
      })
    }

    return NextResponse.json({ error: 'Unexpected response from server.' }, { status: 500 })
  } catch {
    return NextResponse.json({ error: 'Server error. Try again later.' }, { status: 500 })
  }
}
