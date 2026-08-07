// StreamingPanel — låter prästen koppla en YouTube-länk och visar en inbäddad spelare
// Del av Modul 2: "Streama live via YouTube". Länken sparas på gudstjänsten
//
// Används av: ServiceDetail
// Bygger på: toYouTubeEmbed (gör länk till embed-URL) och updateService (via onSave)

import { useState } from "react"
import { Video, Save } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { logError } from "../lib/errorHandler"
import type { Service, NewServiceData } from "../domain/service"
import { toYouTubeEmbed } from "../use-cases/youtube"

interface Props {
  service: Service
  onSave: (changes: Partial<NewServiceData>) => Promise<void>
}

// Ritar streaming-panelen: fält för YouTube-länk, spara-knapp och förhandsvisning
// Tar emot service (nuvarande länk) och onSave (sparar ändringen)
// Returnerar panelen som JSX
export function StreamingPanel({ service, onSave }: Props) {
  const { t } = useTranslation()

  // Fält-state, förifyllt med gudstjänstens sparade länk
  const [url, setUrl] = useState(service.streamUrl ?? "")

  // Felmeddelande som visas i komponenten (tomt = inget fel)
  const [error, setError] = useState("")

  // Embed-URL byggs från den SPARADE länken (null om den inte går att läsa)
  const embed = service.streamUrl ? toYouTubeEmbed(service.streamUrl) : null

  // Validerar och sparar länken (tomt fält blir undefined)
  // Kastar new Error om länken inte går att läsa som YouTube-länk
  const handleSave = async () => {
    try {
      const trimmed = url.trim()
      // Validering: en ifylld länk måste gå att läsa som YouTube-länk
      if (trimmed !== "" && toYouTubeEmbed(trimmed) === null) {
        throw new Error(t("streaming.invalid"))
      }
      await onSave({ streamUrl: trimmed || undefined })
      setError("")
      toast.success(t("common.saved"))
    } catch (err) {
      // Fångar både valideringsfel och oväntade fel; visar meddelandet i komponenten
      const message = err instanceof Error ? err.message : t("common.errorGeneric")
      setError(message)
      logError("StreamingPanel.handleSave", err)
      toast.error(message)
    }
  }

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Video size={18} className="text-accent" />
        <h2 className="text-sm font-bold text-accent">{t("streaming.title")}</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="stream-url" className="block text-sm text-soft mb-1">
            {t("streaming.urlLabel")}
          </label>
          <input
            id="stream-url"
            type="url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value)
              setError("")
            }}
            placeholder="https://youtu.be/..."
            className="field"
          />
          {error && <p className="field-error">{error}</p>}
        </div>
        <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2">
          <Save size={16} aria-hidden="true" />
          {t("streaming.save")}
        </button>

        {/* Förhandsvisning av den sparade länken */}
        {embed ? (
          <iframe
            src={embed}
            title={t("streaming.player", { title: service.title })}
            className="w-full aspect-video rounded-xl border-0 mt-2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : service.streamUrl ? (
          <p className="text-sm text-red-700 dark:text-red-400">{t("streaming.invalid")}</p>
        ) : (
          <p className="text-sm text-faint italic">{t("streaming.empty")}</p>
        )}
      </div>
    </div>
  )
}
