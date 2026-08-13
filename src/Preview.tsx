import { useEffect, useState, type SyntheticEvent } from 'react'
import { previewSrc } from './data'

interface PreviewProps {
  url: string
  className?: string
}

// Unified capture width so node cards and the detail card share the same mShots cache entry.
const CAPTURE_WIDTH = 800

// mShots serves a placeholder image while it queues a capture (~5–15s on first hit).
// The retry keeps refetching until the real screenshot lands. Real gov.uk pages come back
// noticeably taller than wide, so we use aspect ratio to detect a real capture and stop.
export function Preview({ url, className }: PreviewProps) {
  const [attempt, setAttempt] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded || attempt >= 5) return
    const delays = [3000, 4000, 5000, 7000, 9000]
    const timer = window.setTimeout(() => setAttempt((a) => a + 1), delays[attempt])
    return () => window.clearTimeout(timer)
  }, [attempt, loaded])

  const base = previewSrc(url, CAPTURE_WIDTH)
  const src = attempt === 0 ? base : `${base}&r=${attempt}`

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget
    // A real gov.uk page capture at width W is significantly taller than wide.
    // mShots' placeholder is roughly square, so this reliably distinguishes them.
    if (img.naturalHeight >= img.naturalWidth * 1.2) {
      setLoaded(true)
    }
  }

  return (
    <img
      className={className}
      src={src}
      alt=""
      draggable={false}
      onLoad={handleLoad}
    />
  )
}
