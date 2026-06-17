import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MODSXTOOLS DOWNLOADER',
  description: 'Download videos from YouTube, TikTok, Facebook, Instagram, Twitter & more in max quality',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
