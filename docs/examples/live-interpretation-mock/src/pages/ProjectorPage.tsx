// Projektorvy — fullskarm, ingen chrome, ingen nav
// Vecka 1: stub. Utokar i Vecka 3 med:
//   - Fullskarm mork olivsten-tema
//   - Cormorant Garamond for SV, Cairo for AR
//   - lang="ar" dir="rtl" for arabiska
//   - AAA-kontrast pa all text
//   - Fade-in animation pa nya segment
//
// Rutt: /projector/:sessionId
// Anvands av: App.tsx (utanfor Layout — kyrkans projektor-dator)

import { useParams } from "react-router-dom"

export function ProjectorPage() {
  const { sessionId } = useParams<{ sessionId: string }>()

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 p-8">
      <h1 className="text-6xl font-serif">Projektor</h1>
      <p className="text-stone-400 mt-4">Session: {sessionId}</p>
      <p className="text-stone-400">
        Denna sida byggs ut i Vecka 3 med mork olivsten-tema och AAA-kontrast.
      </p>
    </main>
  )
}
