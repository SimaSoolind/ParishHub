// SermonModal — formulär för att skapa eller redigera en predikan
// Fyller i metadata: titel, datum, högtid, kyrka, bibeltext, media-länk och innehåll
// Skickar värdena till föräldern via onSave-prop; validerar med Zod
//
// Används av: Sermons-sidan

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { FocusTrap } from "focus-trap-react"
import { ModalCloseButton } from "./ModalCloseButton"
import { FormField } from "./FormField"
import type { Sermon, NewSermonData } from "../domain/sermon"
import { newSermonSchema } from "../schemas/sermonSchema"
import { collectFieldErrors } from "../use-cases/formErrors"

interface Props {
  sermon: Sermon | null // Finns vid redigering, null vid ny predikan
  onSave: (data: NewSermonData) => void
  onClose: () => void
}

// Dagens datum i ISO-format (YYYY-MM-DD) — standardvärde för nya predikningar
// slice ger en garanterad sträng (till skillnad från split()[0] som kan bli undefined)
const today = new Date().toISOString().slice(0, 10)

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
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Validerar med Zod och skickar vidare bara om allt är korrekt
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

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
      setErrors(collectFieldErrors(result.error))
      return
    }

    setErrors({})
    onSave(result.data)
  }

  return (
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        <div
          onClick={(event) => event.stopPropagation()}
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
            <FormField
              className="mb-4"
              label={t("form.title")}
              value={title}
              onChange={setTitle}
              error={errors["title"]}
              maxLength={100}
            />

            {/* Datum + högtid bredvid varandra */}
            <div className="flex gap-3 mb-4">
              <FormField
                className="flex-1"
                label={t("form.date")}
                value={date}
                onChange={setDate}
                error={errors["date"]}
                type="date"
              />
              <FormField
                className="flex-1"
                label={t("sermonForm.feast")}
                value={feast}
                onChange={setFeast}
                maxLength={100}
                placeholder={t("sermonForm.feastPh")}
              />
            </div>

            {/* Bibeltext + kyrka bredvid varandra */}
            <div className="flex gap-3 mb-4">
              <FormField
                className="flex-1"
                label={t("sermonForm.bibleText")}
                value={bibleText}
                onChange={setBibleText}
                maxLength={200}
                placeholder={t("sermonForm.biblePh")}
              />
              <FormField
                className="flex-1"
                label={t("sermonForm.church")}
                value={church}
                onChange={setChurch}
                maxLength={100}
              />
            </div>

            {/* Media-länk (fil-uppladdning kräver backend) */}
            <FormField
              className="mb-4"
              label={t("sermonForm.mediaUrl")}
              value={mediaUrl}
              onChange={setMediaUrl}
              type="url"
              maxLength={500}
              placeholder="https://..."
            />

            {/* Innehåll — transkription eller anteckningar */}
            <div className="mb-6">
              <label className="field-label">{t("sermonForm.content")}</label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
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
