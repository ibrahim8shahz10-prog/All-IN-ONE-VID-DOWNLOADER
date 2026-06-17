import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url, quality } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 })
    }

    const isAudio = quality === 'audio'

    // Try multiple public Cobalt instances
    const instances = [
      'https://api.cobalt.tools',
      'https://cobalt.api.xunn.at',
      'https://cobalt.urdailyneeds.com',
    ]

    let data = null
    let success = false

    for (const instance of instances) {
      try {
        const res = await fetch(`${instance}/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            url,
            videoQuality: quality === 'max' ? 'max' : quality,
            downloadMode: isAudio ? 'audio' : 'auto',
            audioFormat: 'mp3',
            filenameStyle: 'pretty',
          }),
        })

        if (res.ok) {
          data = await res.json()
          if (data.status !== 'error') {
            success = true
            break
          }
        }
      } catch {
        continue
      }
    }

    if (!success || !data) {
      return NextResponse.json(
        { error: 'All servers busy. Try again in a moment.' },
        { status: 500 }
      )
    }

    if (data.status === 'redirect' || data.status === 'tunnel') {
      return NextResponse.json({ url: data.url, filename: data.filename || 'video.mp4' })
    }

    if (data.status === 'picker') {
      return NextResponse.json({ url: data.picker[0]?.url, filename: 'video.mp4' })
    }

    return NextResponse.json(
      { error: 'Could not process this URL. Try another.' },
      { status: 500 }
    )

  } catch {
    return NextResponse.json({ error: 'Server error. Try again.' }, { status: 500 })
  }
}
