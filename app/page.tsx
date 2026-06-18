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
        setError(data.error || 'Download failed. Check the URL.')
      } else if (data.redirect) {
        window.open(data.url, '_blank')
        setResult({ url: data.url, filename: 'video.mp4' })
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
    <main className="min-h-screen flex flex-col items-center px-4 py-12" style={{ backgroundColor: '#0A0A0A' }}>

      <div className="text-center mb-10">
        <p style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#555', marginBottom: '8px' }}>BY MODSXTOOLS</p>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#00FF88', lineHeight: 1.1, textShadow: '0 0 20px rgba(0,255,136,0.6)' }}>
          VIDEO<br />DOWNLOADER
        </h1>
        <p style={{ color: '#666', marginTop: '12px', fontSize: '14px' }}>Max quality. All platforms. No limits.</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '32px', maxWidth: '480px' }}>
        {PLATFORMS.map((p) => (
          <span key={p.name} style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: '#888' }}>
            <span style={{ color: p.color }}>{p.icon}</span> {p.name}
          </span>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: '480px', background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px', padding: '24px' }}>

        <label style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', display: 'block', marginBottom: '8px' }}>VIDEO URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
          style={{
            width: '100%',
            background: '#0A0A0A',
            border: '2px solid #00FF88',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            marginBottom: '16px',
            boxSizing: 'border-box',
            fontFamily: 'Courier New, monospace',
          }}
        />

        <label style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', display: 'block', marginBottom: '8px' }}>QUALITY</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
          {(['max', '1080', '720', '480', 'audio'] as Quality[]).map((q) => (
            <button
              key={q}
              onClick={() => setQuality(q)}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                border: quality === q ? '2px solid #00FF88' : '2px solid #222',
                background: quality === q ? '#00FF88' : '#0A0A0A',
                color: quality === q ? '#000' : '#666',
                cursor: 'pointer',
                fontFamily: 'Courier New, monospace',
              }}
            >
              {q === 'max' ? 'MAX' : q === 'audio' ? 'MP3' : q + 'p'}
            </button>
          ))}
        </div>

        <button
          onClick={handleDownload}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '18px',
            border: 'none',
            background: loading ? '#00aa55' : '#00FF88',
            color: '#000',
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.1em',
            fontFamily: 'Courier New, monospace',
            boxShadow: '0 0 20px rgba(0,255,136,0.3)',
          }}
        >
          {loading ? '⏳ FETCHING...' : '⬇ DOWNLOAD'}
        </button>

        {error && (
          <div style={{ marginTop: '16px', padding: '12px 16px', background: '#2a0a0a', border: '1px solid #5a1a1a', borderRadius: '12px', color: '#ff6b6b', fontSize: '14px' }}>
            ⚠ {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#0a2a1a', border: '1px solid #1a5a2a', borderRadius: '12px' }}>
            <p style={{ color: '#00FF88', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px' }}>✓ READY TO DOWNLOAD</p>
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'center',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 'bold',
                background: '#00FF88',
                color: '#000',
                textDecoration: 'none',
                fontSize: '14px',
                fontFamily: 'Courier New, monospace',
              }}
            >
              ⬇ SAVE VIDEO
            </a>
          </div>
        )}
      </div>

      <div style={{ width: '100%', maxWidth: '480px', marginTop: '24px', padding: '20px', background: '#111', border: '1px solid #1f1f1f', borderRadius: '16px' }}>
        <p style={{ fontSize: '11px', color: '#555', letterSpacing: '0.2em', marginBottom: '12px' }}>HOW TO USE</p>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}><span style={{ color: '#00FF88' }}>01</span> — Copy the video URL from any platform</p>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}><span style={{ color: '#00FF88' }}>02</span> — Paste it above and pick quality</p>
        <p style={{ fontSize: '14px', color: '#666' }}><span style={{ color: '#00FF88' }}>03</span> — Hit Download and save your file</p>
      </div>

      <p style={{ marginTop: '40px', fontSize: '11px', color: '#333', letterSpacing: '0.3em' }}>
        MODSXTOOLS DOWNLOADER — FOR PERSONAL USE ONLY
      </p>

    </main>
  )
}
