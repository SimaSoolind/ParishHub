// StreamViewer — publik YouTube-vy för AI-tolkning live (URL "/watch")
// Visar videon (platshållare tills backend ger riktig stream-URL) och
// översättnings-texten bredvid. Ligger utanför Layout (helskärm, ingen meny)
// Lyssnar på kontrollpanelen via BroadcastChannel
//
// Används av: App.tsx (route "/watch", utanför Layout)
// Bygger på: useLiveDisplay (lyssnar), TranscriptFeed, LiveStatusBadge

import { useTranslation } from "react-i18next"
import { Video } from "lucide-react"
import { useLiveDisplay } from "../hooks/useLiveDisplay"
import { TranscriptFeed } from "../components/TranscriptFeed"
import { LiveStatusBadge } from "../components/LiveStatusBadge"

// Ritar vyn: rubrik, video-platshållare och transkript-text bredvid
// Tar inga props (all data kommer via useLiveDisplay)
// Returnerar helskärms-vyn som JSX
export function StreamViewer() {
  const { t } = useTranslation()
  const { status, segments } = useLiveDisplay()

  return (
    <main className="min-h-screen bg-stone-950 text-stone-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-2xl font-serif font-bold">{t("live.watchTitle")}</h1>
          <LiveStatusBadge status={status} />
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          {/* Video — platshållare tills riktig YouTube-stream kopplas via backend */}
          <div className="aspect-video rounded-xl bg-black flex flex-col items-center justify-center text-stone-400 gap-3">
            <Video size={48} aria-hidden="true" />
            <p className="text-sm">{t("live.videoPlaceholder")}</p>
          </div>

          {/* Översättnings-texten bredvid (vit panel så texten blir läsbar) */}
          <div className="bg-white text-stone-900 rounded-xl p-4 max-h-[70vh] overflow-y-auto">
            <TranscriptFeed segments={segments} emptyText={t("live.waiting")} />
          </div>
        </div>
      </div>
    </main>
  )
}
