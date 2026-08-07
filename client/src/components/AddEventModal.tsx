// AddEventModal — formulär för att skapa ELLER ändra ett event
// Prästen fyller i titel, datum, kategori och anteckningar
// Skickar värdena till föräldern via onSave-prop
// Om initialData skickas in öppnas formuläret förifyllt (redigeringsläge)
//
// Används av: Calendar.tsx

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ModalCloseButton } from "./ModalCloseButton"
import { FocusTrap } from "focus-trap-react"
import { lifeEventCategoryValues } from "../data/eventCategories"
import { newEventSchema } from "../schemas/eventSchema"
import { collectFieldErrors } from "../use-cases/formErrors"
import { Dropdown } from "./Dropdown"
import type { NewEventData } from "../domain/event"

interface Props {
  onSave: (event: NewEventData) => void
  onClose: () => void
  // Förifyllda värden — vid redigering, eller bara datum vid klick på en dag
  initialData?: NewEventData
  // Sant vid redigering — styr rubrik och knapptext
  isEdit?: boolean
}

// Ritar formuläret och håller fältens värden i state
// Tar emot onSave (spara-funktion) och onClose (stäng-funktion) som props
// Returnerar modalen som JSX
export function AddEventModal({ onSave, onClose, initialData, isEdit = false }: Props) {
  const { t } = useTranslation()

  // State för varje formulär-fält — förifylls vid redigering, annars tomt
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [date, setDate] = useState(initialData?.date ?? "")
  const [category, setCategory] = useState(initialData?.category ?? "baptism")
  const [notes, setNotes] = useState(initialData?.notes ?? "")

  // Håller felmeddelanden per fält från valideringen
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Escape stänger modalen — tangentbords-användare ska kunna stänga utan mus (WCAG)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Validerar med Zod innan spara, så ogiltig data aldrig skickas vidare till föräldern
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const result = newEventSchema.safeParse({
      title,
      date,
      category,
      notes: notes || undefined,
    })

    // Om valideringen misslyckas — visa felmeddelanden och avbryt
    if (!result.success) {
      setErrors(collectFieldErrors(result.error))
      return
    }

    // Skickar det validerade eventet till föräldern
    setErrors({})
    onSave(result.data)
  }

  return (
    // Backdrop — klick utanför stänger modalen
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
        <div
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="modal-panel max-w-md w-full p-6"
        >
          {/* Rubrik-rad med stäng-knapp */}
          <div className="flex items-start justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-bold text-strong">
              {isEdit ? t("eventForm.editTitle") : t("eventForm.addTitle")}
            </h2>
            <ModalCloseButton onClose={onClose} />
          </div>

          {/* Själva formuläret — onSubmit triggas vid Spara-klick */}
          <form onSubmit={handleSubmit}>
            {/* Titel-fält */}
            <div className="mb-4">
              <label className="field-label">{t("form.title")}</label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={t("eventForm.phTitle")}
                className="field"
              />
              {errors["title"] && <p className="field-error">{errors["title"]}</p>}
            </div>

            {/* Datum-fält */}
            <div className="mb-4">
              <label className="field-label">{t("form.date")}</label>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="field"
              />
              {errors["date"] && <p className="field-error">{errors["date"]}</p>}
            </div>

            {/* Kategori-dropdown */}
            <div className="mb-4">
              <label className="field-label">{t("form.category")}</label>
              <Dropdown
                value={category}
                onChange={setCategory}
                ariaLabel={t("form.category")}
                options={lifeEventCategoryValues.map((value) => ({
                  value,
                  label: t("eventCategory." + value),
                }))}
              />
            </div>

            {/* Anteckningar — valfritt fält */}
            <div className="mb-6">
              <label className="field-label">{t("form.notesOptional")}</label>
              <textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder={t("eventForm.phNotes")}
                rows={3}
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
                {isEdit ? t("form.saveEdit") : t("form.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FocusTrap>
  )
}
