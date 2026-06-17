const handleDownload = async () => {
  if (!url.trim()) {
    setError('Paste a video URL first.')
    return
  }
  // Redirect to cobalt.tools with URL pre-filled
  window.open(
    `https://cobalt.tools/#${encodeURIComponent(url.trim())}`,
    '_blank'
  )
}
