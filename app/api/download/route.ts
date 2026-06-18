import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { url, quality } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'No URL provided.' }, { status: 400 })
    }

    const isTikTok = url.includes('tiktok.com')
    const isYouTube = url.includes('youtube.com') || url.includes('youtu.be')
    const isFacebook = url.includes('facebook.com') || url.includes('fb.watch')
    const isInstagram = url.includes('instagram.com')
    const isTwitter = url.includes('twitter.com') || url.includes('x.com')
    const isSnapchat = url.includes('snapchat.com')

    // TikTok — direct API, works from server
    if (isTikTok) {
      const res = await fetch(`https://tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`)
      const data = await res.json()
      if (data.code === 0 && data.data?.hdplay) {
        return NextResponse.json({ url: data.data.hdplay, filename: 'tiktok-video.mp4' })
      }
      if (data.code === 0 && data.data?.play) {
        return NextResponse.json({ url: data.data.play, filename: 'tiktok-video.mp4' })
      }
    }

    // YouTube — redirect to y2mate
    if (isYouTube) {
      const encoded = encodeURIComponent(url)
      return NextResponse.json({
        redirect: true,
        url: `https://www.y2mate.com/youtube/${encoded}`,
      })
    }

    // Facebook — redirect to fdownloader
    if (isFacebook) {
      return NextResponse.json({
        redirect: true,
        url: `https://fdownloader.net/?url=${encodeURIComponent(url)}`,
      })
    }

    // Instagram — redirect to instafinsta
    if (isInstagram) {
      return NextResponse.json({
        redirect: true,
        url: `https://instafinsta.com/?url=${encodeURIComponent(url)}`,
      })
    }

    // Twitter/X
    if (isTwitter) {
      return NextResponse.json({
        redirect: true,
        url: `https://twittervideodownloader.com/?url=${encodeURIComponent(url)}`,
      })
    }

    // Snapchat
    if (isSnapchat) {
      return NextResponse.json({
        redirect: true,
        url: `https://snapdownloader.com/?url=${encodeURIComponent(url)}`,
      })
    }

    // Default fallback
    return NextResponse.json({
      redirect: true,
      url: `https://cobalt.tools`,
    })

  } catch {
    return NextResponse.json({ error: 'Server error. Try again.' }, { status: 500 })
  }
}
