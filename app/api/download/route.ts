import { NextRequest, NextResponse } from 'next/server'

const COBALT_INSTANCE =
  process.env.COBALT_INSTANCE || 'https://api.cobalt.tools'

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

    const cobaltRes = await fetch(`${COBALT_INSTANCE}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        url: url,
        videoQuality: qualityMap[quality] || 'max',
        downloadMode: isAudio ? 'audio' : 'auto',
        audioFormat: 'mp3',
        filenameStyle: 'pretty',
      }),
    })

    const data = await cobaltRes.json()

    if (!cobaltRes.ok || data.status === 'error') {
      return NextResponse.json(
        { error: data.error?.code || 'Could not fetch video. Check the URL.' },
        { status: 500 }
      )
    }

    if (data.status === 'redirect' || data.status === 'tunnel') {
      return NextResponse.json({
        url: data.url,
        filename: data.filename || 'video.mp4',
      })
    }

    if (data.status === 'picker') {
      return NextResponse.json({
        url: data.picker[0]?.url,
        filename: 'video.mp4',
      })
    }

    return NextResponse.json(
      { error: 'Unexpected response. Try a different URL.' },
      { status: 500 }
    )
  } catch {
    return NextResponse.json(
      { error: 'Server error. Try again later.' },
      { status: 500 }
    )
  }
}
