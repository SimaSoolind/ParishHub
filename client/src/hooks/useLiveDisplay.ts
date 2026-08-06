// useLiveDisplay — presentation-hook för projektor-vyn (AI-tolkning live)
// Lyssnar på segment/status som kontrollpanelen sänder och samlar dem
//
// Används av: LiveDisplay

import { useState, useEffect } from "react"
import type { LiveStatus, TranscriptSegment } from "../domain/liveSession"
import { upsertSegment, latestSegment } from "../use-cases/liveSession"
import { subscribeLive } from "../lib/liveChannel"

// Ger status och segment som strömmar in från kontrollpanelen
// Tar inga argument
// Returnerar { status, segments, latest }
export function useLiveDisplay() {
  const [status, setStatus] = useState<LiveStatus>("idle")
  const [segments, setSegments] = useState<TranscriptSegment[]>([])

  // Prenumererar på live-kanalen medan vyn är öppen
  useEffect(() => {
    const unsubscribe = subscribeLive((message) => {
      if (message.type === "segment") {
        setSegments((prev) => upsertSegment(prev, message.segment))
        // Segment kommer bara medan sessionen är igång, så läget är "live"
        // (fångar även upp en flik som öppnats mitt i en session)
        setStatus("live")
      } else {
        setStatus(message.status)
      }
    })
    return unsubscribe
  }, [])

  return { status, segments, latest: latestSegment(segments) }
}
