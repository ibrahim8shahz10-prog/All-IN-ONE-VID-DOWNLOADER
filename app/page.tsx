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
        // Open external download page
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
