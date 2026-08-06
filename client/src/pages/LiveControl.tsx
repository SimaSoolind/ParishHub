// LiveControl — kontrollpanel för AI-tolkning live (URL "/live")
// Prästen startar/pausar/stoppar tolkningen och ser transkriptet växa fram
// En knapp öppnar den stora publika projektor-vyn i en ny flik
//
// Används av: App.tsx (route "live")
// Bygger på: useLiveSession (logik), TranscriptFeed, LiveStatusBadge

import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Play, Pause, Square, Monitor, Video, ArrowLeft } from "lucide-react"
import { useLiveSession } from "../hooks/useLiveSession"
import { TranscriptFeed } from "../components/TranscriptFeed"
import { LiveStatusBadge } from "../components/LiveStatusBadge"
import { LanguageDirectionSelector } from "../components/LanguageDirectionSelector"
import { LivePreparedLiturgy } from "../components/LivePreparedLiturgy"

// Ritar kontrollpanelen: rubrik, status, riktning, kontrollknappar och transkript
// Tar inga props (all logik ligger i useLiveSession)
// Returnerar sidan som JSX
export function LiveControl() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { status, direction, segments, start, pause, resume, stop, changeDirection, showBlock } =
    useLiveSession()

  return (
    <>
      {/* Tillbaka till föregående sida (t.ex. gudstjänsten man kom ifrån) */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-accent hover:underline mb-4"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t("live.back")}
      </button>

      <header className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-serif font-bold text-strong">{t("live.controlTitle")}</h1>
          <LiveStatusBadge status={status} />
        </div>
        <p className="text-soft">{t("live.controlSubtitle")}</p>
      </header>

      {/* Riktning — operatören byter när talaren växlar språk */}
      <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
        <h2 className="text-sm font-bold text-accent mb-3">{t("live.direction")}</h2>
        <LanguageDirectionSelector direction={direction} onChange={changeDirection} />
      </div>

      {/* Kontroller — vilka knappar som visas beror på läget */}
      <div className="surface border p-6 rounded-2xl shadow-sm mb-6 flex flex-wrap gap-3 items-center">
        {(status === "idle" || status === "ended") && (
          <button
            onClick={start}
            className="btn-primary px-5 py-2.5 inline-flex items-center gap-2"
          >
            <Play size={18} aria-hidden="true" />
            {status === "ended" ? t("live.startNew") : t("live.start")}
          </button>
        )}

        {status === "live" && (
          <button
            onClick={pause}
            className="btn-primary px-5 py-2.5 inline-flex items-center gap-2"
          >
            <Pause size={18} aria-hidden="true" />
            {t("live.pause")}
          </button>
        )}

        {status === "paused" && (
          <button
            onClick={resume}
            className="btn-primary px-5 py-2.5 inline-flex items-center gap-2"
          >
            <Play size={18} aria-hidden="true" />
            {t("live.resume")}
          </button>
        )}

        {(status === "live" || status === "paused") && (
          <button
            onClick={stop}
            className="btn-secondary text-strong px-5 py-2.5 inline-flex items-center gap-2"
          >
            <Square size={18} aria-hidden="true" />
            {t("live.stop")}
          </button>
        )}

        {/* Publik vyer öppnas i nya flikar så prästen behåller kontrollen */}
        <div className="flex flex-wrap gap-3 ml-auto">
          <Link
            to="/live/display"
            target="_blank"
            rel="noopener"
            className="btn-secondary text-accent px-5 py-2.5 inline-flex items-center gap-2"
          >
            <Monitor size={18} aria-hidden="true" />
            {t("live.openDisplay")}
          </Link>
          <Link
            to="/watch"
            target="_blank"
            rel="noopener"
            className="btn-secondary text-accent px-5 py-2.5 inline-flex items-center gap-2"
          >
            <Video size={18} aria-hidden="true" />
            {t("live.openWatch")}
          </Link>
        </div>
      </div>

      {/* Förberedd liturgi — visa fasta delar direkt på projektorn (utan AI) */}
      <LivePreparedLiturgy onShow={showBlock} />

      {/* Transkriptet (arabiska + svenska), senaste överst */}
      <div className="surface border p-6 rounded-2xl shadow-sm">
        <h2 className="text-sm font-bold text-accent mb-4">{t("live.transcript")}</h2>
        <TranscriptFeed segments={segments} emptyText={t("live.waiting")} />
      </div>
    </>
  )
}
