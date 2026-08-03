// EventModal — pop-up som visar detaljer om ett event
// Öppnas när användaren klickar på ett event i kalendern
// Stängs genom att klicka utanför eller på Stäng-knappen
//
// Används av: Calendar.tsx

import { useEffect, useState } from "react"
import { X, Trash2, Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"

// Definierar vad ett event ska innehålla för att visas i modalen
// Union type — antingen ChurchEvent eller LifeEvent i react-big-calendar-format
export interface ModalEvent {
  id: string
  title: string
  start: Date
  category: string
  notes?: string
  // Sant för koptiska högtider — de kan inte ändras eller raderas
  isReadOnly?: boolean
}

interface Props {
  event: ModalEvent
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

// Formaterar datum till svenskt läsbart format
// Exempel: "Söndag 22 juni 2026"
function formatDate(date: Date): string {
  const formatted = date.toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

// Ritar modalen med eventets titel, datum, kategori och anteckningar
// Tar emot event, onClose (stäng), onEdit (öppna redigering) och onDelete (ta bort)
// Returnerar modalen som JSX
export function EventModal({ event, onClose, onEdit, onDelete }: Props) {
  const { t } = useTranslation()

  // Kategori-texten i valt språk — faller tillbaka till råvärdet om nyckeln saknas
  const categoryLabel = t("eventCategory." + event.category, { defaultValue: event.category })

  // Sant när prästen klickat Radera och ska bekräfta borttagningen
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Stänger modalen när Escape trycks (tillgänglighet)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    // Backdrop — mörkt lager över hela skärmen
    // Klick på backdrop stänger modalen
    <div onClick={onClose} className="modal-backdrop">
      {/* Själva modalen — stopPropagation stoppar klick från att nå backdrop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-panel max-w-md w-full p-6"
      >
        {/* Rubrik-rad med stäng-knapp */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-strong">{event.title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full row-hover"
            aria-label={t("form.close")}
          >
            <X size={20} className="text-faint" />
          </button>
        </div>

        {/* Datum */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-faint uppercase">{t("form.date")}</div>
          <div className="text-strong">{formatDate(event.start)}</div>
        </div>

        {/* Kategori */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-faint uppercase">{t("form.category")}</div>
          <div className="text-strong">{categoryLabel}</div>
        </div>

        {/* Anteckningar visas endast om de finns */}
        {event.notes && (
          <div className="mb-3">
            <div className="text-xs font-semibold text-faint uppercase">{t("profile.notes")}</div>
            <div className="text-strong">{event.notes}</div>
          </div>
        )}

        {/* Skrivskyddade event (koptiska högtider) kan inte ändras */}
        {event.isReadOnly ? (
          <p className="text-xs text-faint italic mt-5">
            {t("calendar.fromCopticCalendar")}
          </p>
        ) : confirmingDelete ? (
          <div className="mt-5">
            <p className="text-sm text-soft mb-3">
              {t("profile.deleteQ", { name: event.title })}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 px-4 py-2 btn-secondary text-soft"
              >
                {t("form.cancel")}
              </button>
              <button
                onClick={onDelete}
                className="flex-1 px-4 py-2 bg-red-700 text-white rounded-xl font-semibold hover:bg-red-800"
              >
                {t("profile.confirmDelete")}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setConfirmingDelete(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 rounded-xl font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
            >
              <Trash2 size={16} />
              {t("profile.delete")}
            </button>
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 btn-primary"
            >
              <Pencil size={16} />
              {t("profile.edit")}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
