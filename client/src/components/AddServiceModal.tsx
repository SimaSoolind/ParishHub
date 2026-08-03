// AddServiceModal — formulär för att skapa en ny gudstjänst
// Prästen fyller i titel, datum, starttid och anteckningar
// Skickar värdena till föräldern via onSave-prop
//
// Används av: Services.tsx

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { FocusTrap } from "focus-trap-react"
import type { NewServiceData } from "../domain/service"
import { newServiceSchema } from "../schemas/serviceSchema"

interface Props {
  onSave: (service: NewServiceData) => void
  onClose: () => void
}

// Dagens datum i ISO-format (YYYY-MM-DD) — används som standardvärde
// Sätts dynamiskt istället för ett låst datum
const today = new Date().toISOString().split("T")[0]

// Id:n för snabbval-titlar — texten översätts via t("serviceForm.presets.<id>")
// Fritext-fältet under används för egna namn (t.ex. Fasta eller Jul)
const presetTitleIds = ["main", "service", "sunday", "liturgy"] as const

// Ritar formuläret och håller fältens värden i state
// Tar emot onSave (spara) och onClose (stäng)
// Returnerar modalen som JSX
export function AddServiceModal({ onSave, onClose }: Props) {
  const { t } = useTranslation()

  // State för varje fält — titel tom, datum = idag, starttid som förslag
  const [title, setTitle] = useState("")
  const [date, setDate] = useState(today)
  const [startTime, setStartTime] = useState("10:00")
  const [endTime, setEndTime] = useState("")
  const [notes, setNotes] = useState("")

  // Håller felmeddelanden per fält från valideringen
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Stänger modalen när Escape trycks (tillgänglighet)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Körs när formuläret skickas
  // Validerar med Zod och skickar vidare bara om allt är korrekt
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = newServiceSchema.safeParse({
      title,
      date,
      startTime,
      endTime: endTime || undefined,
      notes: notes || undefined,
    })

    // Om valideringen misslyckas — samla felmeddelanden per fält och avbryt
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
    // Backdrop — klick utanför stänger modalen
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="modal-panel max-w-md w-full p-6"
        >
          {/* Rubrik-rad med stäng-knapp */}
          <div className="flex items-start justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-bold text-strong">
              {t("serviceForm.title")}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full row-hover"
              aria-label={t("form.close")}
            >
              <X size={20} className="text-faint" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Titel — snabbval-knappar + fritext för eget namn (maxLength 100) */}
            <div className="mb-4">
              <label className="field-label">{t("form.title")}</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {presetTitleIds.map((id) => {
                  const preset = t("serviceForm.presets." + id)
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setTitle(preset)}
                      className={
                        "px-3 py-1 rounded-full text-xs font-semibold border " +
                        (title === preset
                          ? "bg-amber-800 text-white border-amber-800"
                          : "bg-white text-stone-600 border-stone-200 hover:border-amber-800 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600")
                      }
                    >
                      {preset}
                    </button>
                  )
                })}
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                placeholder={t("serviceForm.phTitle")}
                className="field"
              />
              {errors["title"] && <p className="field-error">{errors["title"]}</p>}
            </div>

            {/* Datum */}
            <div className="mb-4">
              <label className="field-label">{t("form.date")}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="field"
              />
              {errors["date"] && <p className="field-error">{errors["date"]}</p>}
            </div>

            {/* Starttid och sluttid bredvid varandra */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="field-label">{t("serviceForm.startTime")}</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="field"
                />
                {errors["startTime"] && <p className="field-error">{errors["startTime"]}</p>}
              </div>
              <div className="flex-1">
                <label className="field-label">{t("serviceForm.endTime")}</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="field"
                />
              </div>
            </div>

            {/* Anteckningar — valfritt fält (maxLength 500) */}
            <div className="mb-6">
              <label className="field-label">{t("form.notesOptional")}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={500}
                rows={2}
                placeholder={t("serviceForm.phNotes")}
                className="field resize-none"
              />
            </div>

            {/* Knappar */}
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
