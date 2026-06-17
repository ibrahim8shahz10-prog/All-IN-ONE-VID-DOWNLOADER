import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url, quality } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 })
    }

    const isAudio = quality === 'audio'

    const qualityMap: Record<string, string> = {
      max: 'max',
      '1080': '1080',
      '720': '720',
      '480': '480',
      audio: 'max',
    }

    const cobaltRes = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        videoQuality: qualityMap[quality] || '1080',
        downloadMode: isAudio ? 'audio' : 'auto', // FIXED: 'auto' is used for standard video downloads instead of 'video'
        filenameStyle: 'pretty',
      }),
    })

    if (!cobaltRes.ok) {
      try {
        const errorData = await cobaltRes.json()
        return NextResponse.json(
          { error: errorData.text || `Cobalt API error (${cobaltRes.status})` },
          { status: cobaltRes.status }
        )
      } catch {
        return NextResponse.json(
          { error: `Cobalt error status: ${cobaltRes.status}` },
          { status: cobaltRes.status }
        )
      }
    }

    const data = await cobaltRes.json()

    if (data.status === 'redirect' || data.status === 'stream' || data.status === 'tunnel') {
      return NextResponse.json({
        url: data.url,
        filename: data.filename || 'media.mp4',
      })
    }

    if (data.status === 'picker') {
      return NextResponse.json({
        url: data.picker?.[0]?.url || null,
        filename: data.picker?.[0]?.filename || 'media.mp4',
      })
    }

    if (data.url) {
      return NextResponse.json({
        url: data.url,
        filename: data.filename || 'download.mp4',
      })
    }

    return NextResponse.json(
      { error: 'Unexpected response format from Cobalt.' },
      { status: 500 }
    )

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error processing the download request.' },
      { status: 500 }
    )
  }
}
