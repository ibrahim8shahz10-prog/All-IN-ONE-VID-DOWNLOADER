'use client'

import { useState } from 'react'

const PLATFORMS = [
  { name: 'YouTube', icon: '▶', color: '#FF0000' },
  { name: 'TikTok', icon: '♪', color: '#00f2ea' },
  { name: 'Facebook', icon: 'f', color: '#1877F2' },
  { name: 'Instagram', icon: '◎', color: '#E1306C' },
  { name: 'Twitter/X', icon: '✕', color: '#ffffff' },
  { name: 'Snapchat', icon: '👻', color: '#FFFC00' },
  { name: 'Vimeo', icon: '◈', color: '#1ab7ea' },
  { name: '+ More', icon: '∞', color: '#00FF88' },
]

type Quality = 'max' | '1080' | '720' | '480' | 'audio'

export default function Home() {
  const [url, setUrl] = useState('')
  const [quality, setQuality] = useState<Quality>('max')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null)
  const [error, setError] = useState('')

  const handleDownload = async () => {
    if (!url.trim()) {
      setError('Paste a video URL first.')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), quality }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error || 'Download failed. Check the URL and try again.')
      } else {
        setResult({ url: data.url, filename: data.filename || 'video.mp4' })
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-dark flex flex-col items-center px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.4em] text-gray-500 mb-2">BY MODSXTOOLS</p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter glow-text" style={{ color: '#00FF88' }}>
          VIDEO<br />DOWNLOADER
        </h1>
        <p className="text-gray-400 mt-3 text-sm">Max quality. All platforms. No limits.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-xl">
        {PLATFORMS.map((p) => (
          <span key={p.name} className="platform-badge">
            <span style={{ color: p.color }}>{p.icon}</span> {p.name}
          </span>
        ))}
      </div>

      <div className="w-full max-w-xl bg-card border border-border rounded-2xl p-6">
        <label className="text-xs text-gray-500 tracking-widest uppercase mb-2 block">Video URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full bg-dark border pulse-border rounded-xl px-4 py-3 text-white text-sm outline-none mb-4 placeholder-gray-600"
          style={{ borderColor: '#00FF88' }}
          onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
        />

        <label className="text-xs text-gray-500 tracking-widest uppercase mb-2 block">Quality</label>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {(['max', '1080', '720', '480', 'audio'] as Quality[]).map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                quality === q
                  ? 'bg-brand text-black border-brand'
                  : 'bg-dark border-border text-gray-400 hover:border-gray-500'
              }`}
            >
              {q === 'max' ? 'MAX' : q === 'audio' ? 'MP3' : q + 'p'}
            </button>
          ))}
        </div>

        <button
          onClick={handleDownload}
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-black text-lg tracking-wider transition-all glow"
          style={{ backgroundColor: loading ? '#00aa55' : '#00FF88' }}
        >
          {loading ? '⏳ FETCHING...' : '⬇ DOWNLOAD'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-950 border border-red-800 rounded-xl text-red-400 text-sm">
            ⚠ {error}
          </div>
        )}

        {result && (
          <div className="mt-4 p-4 bg-green-950 border border-green-800 rounded-xl">
            <p className="text-green-400 text-sm font-bold mb-3">✓ READY TO DOWNLOAD</p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              download={result.filename}
              className="block w-full text-center py-3 rounded-xl font-bold text-black text-sm"
              style={{ backgroundColor: '#00FF88' }}
            >
              ⬇ SAVE VIDEO
            </a>
          </div>
        )}
      </div>

      <div className="w-full max-w-xl mt-8 p-5 bg-card border border-border rounded-2xl">
        <h2 className="text-xs tracking-widest text-gray-500 uppercase mb-3">How to use</h2>
        <div className="space-y-2 text-sm text-gray-400">
          <p><span className="text-brand">01</span> — Copy the video URL from any platform</p>
          <p><span className="text-brand">02</span> — Paste it above and pick quality</p>
          <p><span className="text-brand">03</span> — Hit Download and save your file</p>
        </div>
      </div>

      <p className="mt-10 text-xs text-gray-700 tracking-widest">
        MODSXTOOLS DOWNLOADER — FOR PERSONAL USE ONLY
      </p>
    </main>
  )
}
