// SermonModal — formulär för att skapa eller redigera en predikan
// Fyller i metadata: titel, datum, högtid, kyrka, bibeltext, media-länk och innehåll
// Skickar värdena till föräldern via onSave-prop; validerar med Zod
//
// Används av: Sermons-sidan

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { FocusTrap } from "focus-trap-react"
import { ModalCloseButton } from "./ModalCloseButton"
import type { Sermon, NewSermonData } from "../domain/sermon"
import { newSermonSchema } from "../schemas/sermonSchema"

interface Props {
  sermon: Sermon | null // Finns vid redigering, null vid ny predikan
  onSave: (data: NewSermonData) => void
  onClose: () => void
}

// Dagens datum i ISO-format (YYYY-MM-DD) — standardvärde för nya predikningar
const today = new Date().toISOString().split("T")[0]

// Ritar formuläret och håller fältens värden i state
// Tar emot sermon (för redigering), onSave och onClose
// Returnerar modalen som JSX
export function SermonModal({ sermon, onSave, onClose }: Props) {
  const { t } = useTranslation()

  // Fält förifylls med predikans värden vid redigering, annars tomma
  const [title, setTitle] = useState(sermon?.title ?? "")
  const [date, setDate] = useState(sermon?.date ?? today)
  const [feast, setFeast] = useState(sermon?.feast ?? "")
  const [church, setChurch] = useState(sermon?.church ?? "")
  const [bibleText, setBibleText] = useState(sermon?.bibleText ?? "")
  const [mediaUrl, setMediaUrl] = useState(sermon?.mediaUrl ?? "")
  const [content, setContent] = useState(sermon?.content ?? "")

  // Felmeddelanden per fält från valideringen
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Stänger modalen när Escape trycks (tillgänglighet)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Validerar med Zod och skickar vidare bara om allt är korrekt
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = newSermonSchema.safeParse({
      title,
      date,
      bibleText: bibleText || undefined,
      feast: feast || undefined,
      church: church || undefined,
      mediaUrl: mediaUrl || undefined,
      content: content || undefined,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = String(issue.path[0])
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    onSave(result.data)
  }

  return (
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="modal-panel max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-bold text-strong">
              {sermon ? t("sermonForm.editTitle") : t("sermonForm.newTitle")}
            </h2>
            <ModalCloseButton onClose={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Titel */}
            <div className="mb-4">
              <label className="field-label">{t("form.title")}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                className="field"
              />
              {errors["title"] && <p className="field-error">{errors["title"]}</p>}
            </div>

            {/* Datum + högtid bredvid varandra */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="field-label">{t("form.date")}</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="field"
                />
                {errors["date"] && <p className="field-error">{errors["date"]}</p>}
              </div>
              <div className="flex-1">
                <label className="field-label">{t("sermonForm.feast")}</label>
                <input
                  type="text"
                  value={feast}
                  onChange={(e) => setFeast(e.target.value)}
                  maxLength={100}
                  placeholder={t("sermonForm.feastPh")}
                  className="field"
                />
              </div>
            </div>

            {/* Bibeltext + kyrka */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="field-label">{t("sermonForm.bibleText")}</label>
                <input
                  type="text"
                  value={bibleText}
                  onChange={(e) => setBibleText(e.target.value)}
                  maxLength={200}
                  placeholder={t("sermonForm.biblePh")}
                  className="field"
                />
              </div>
              <div className="flex-1">
                <label className="field-label">{t("sermonForm.church")}</label>
                <input
                  type="text"
                  value={church}
                  onChange={(e) => setChurch(e.target.value)}
                  maxLength={100}
                  className="field"
                />
              </div>
            </div>

            {/* Media-länk (fil-uppladdning kräver backend) */}
            <div className="mb-4">
              <label className="field-label">{t("sermonForm.mediaUrl")}</label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                maxLength={500}
                placeholder="https://..."
                className="field"
              />
            </div>

            {/* Innehåll — transkription eller anteckningar */}
            <div className="mb-6">
              <label className="field-label">{t("sermonForm.content")}</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={10000}
                rows={5}
                placeholder={t("sermonForm.contentPh")}
                className="field"
              />
              {/* AI-transkription kräver backend — noteras som nästa steg */}
              <p className="text-xs text-faint mt-1">{t("sermonForm.aiHint")}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 btn-secondary text-soft"
              >
                {t("form.cancel")}
              </button>
              <button type="submit" className="flex-1 px-4 py-2 btn-primary">
                {t("form.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FocusTrap>
  )
}
