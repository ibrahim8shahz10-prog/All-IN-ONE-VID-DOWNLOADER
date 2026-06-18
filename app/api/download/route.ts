import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 })
    }

    // Detect platform
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')
    const isTikTok = url.includes('tiktok.com')
    const isFacebook = url.includes('facebook.com') || url.includes('fb.watch')
    const isInstagram = url.includes('instagram.com')
    const isTwitter = url.includes('twitter.com') || url.includes('x.com')

    let apiUrl = ''

    if (isYouTube) {
      apiUrl = `https://yt-download.org/api/button/mp4?url=${encodeURIComponent(url)}`
      return NextResponse.json({
        redirect: true,
        url: `https://yt1s.com/en/youtube-to-mp4?q=${encodeURIComponent(url)}`,
        message: 'Opening download page...'
      })
    }

    if (isTikTok) {
      const res = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      if (data.code === 0 && data.data?.play) {
        return NextResponse.json({
          url: data.data.play,
          filename: 'tiktok-video.mp4'
        })
      }
    }

    if (isFacebook || isInstagram || isTwitter) {
      return NextResponse.json({
        redirect: true,
        url: `https://snapvid.app/?url=${encodeURIComponent(url)}`,
      })
    }

    // Fallback — send to cobalt.tools directly
    return NextResponse.json({
      redirect: true,
      url: `https://cobalt.tools`,
    })

  } catch {
    return NextResponse.json({ error: 'Server error. Try again.' }, { status: 500 })
  }
}
