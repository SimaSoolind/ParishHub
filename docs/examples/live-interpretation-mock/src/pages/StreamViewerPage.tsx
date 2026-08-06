// YouTube-vy — video + text bredvid
// Vecka 1: stub. Utokar i Vecka 4 med:
//   - YouTube-iframe pa vanster sida
//   - Live transkript-feed pa hoger sida
//   - Responsiv layout (mobil = staplad, desktop = sida vid sida)
//   - Ingen inloggning behovs (publik lank)
//
// Rutt: /watch/:sessionId
// Anvands av: App.tsx (utanfor Layout — publik distansvisning)

import { useParams } from "react-router-dom"

export function StreamViewerPage() {
  const { sessionId } = useParams<{ sessionId: string }>()

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-serif text-strong mb-4">
        Stream — {sessionId}
      </h1>
      <p className="text-soft">
        Denna sida byggs ut i Vecka 4 med YouTube-iframe + text bredvid.
      </p>
    </main>
  )
}
