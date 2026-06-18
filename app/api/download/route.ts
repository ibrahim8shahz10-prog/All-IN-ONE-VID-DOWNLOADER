import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()
    if (!url) return NextResponse.json({ error: 'No URL provided.' }, { status: 400 })

    const isTikTok = url.includes('tiktok.com')

    // TikTok — only platform with free working direct API
    if (isTikTok) {
      const res = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`)
      const data = await res.json()
      if (data.code === 0 && data.data?.hdplay) {
        return NextResponse.json({ url: data.data.hdplay, filename: 'tiktok.mp4' })
      }
      if (data.code === 0 && data.data?.play) {
        return NextResponse.json({ url: data.data.play, filename: 'tiktok.mp4' })
      }
    }

    // All other platforms — send to cobalt.tools (best maintained free tool)
    return NextResponse.json({
      redirect: true,
      url: `https://cobalt.tools`,
      message: 'Opening cobalt.tools — paste your URL there to download.'
    })

  } catch {
    return NextResponse.json({ error: 'Server error. Try again.' }, { status: 500 })
  }
}
