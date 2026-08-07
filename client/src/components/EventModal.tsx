// EventModal — pop-up som visar detaljer om ett event
// Öppnas när användaren klickar på ett event i kalendern
// Stängs genom att klicka utanför eller på Stäng-knappen
//
// Används av: Calendar.tsx

import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ModalCloseButton } from "./ModalCloseButton"
import { DeleteEditActions } from "./DeleteEditActions"
import { FocusTrap } from "focus-trap-react"
import { formatLongDate } from "../utils/dateUtils"
import { gregorianToJulian } from "../utils/calendarConvert"
import { useCalendarSystem } from "../hooks/useCalendarSystem"

// Definierar vad ett event ska innehålla för att visas i modalen
// Union type — antingen ChurchEvent eller LifeEvent i react-big-calendar-format
export interface ModalEvent {
  id: string
  title: string
  start: Date
  category: string
  notes?: string | undefined
  // Sant för koptiska högtider — de kan inte ändras eller raderas
  isReadOnly?: boolean
}

interface Props {
  event: ModalEvent
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

// Ritar modalen med eventets titel, datum, kategori och anteckningar
// Tar emot event, onClose (stäng), onEdit (öppna redigering) och onDelete (ta bort)
// Returnerar modalen som JSX
export function EventModal({ event, onClose, onEdit, onDelete }: Props) {
  const { t } = useTranslation()

  // Vald kalender (gregoriansk/juliansk) styr om juliansk motsvarighet visas
  const { system: calendarSystem } = useCalendarSystem()

  // Kategori-texten i valt språk — faller tillbaka till råvärdet om nyckeln saknas
  const categoryLabel = t("eventCategory." + event.category, { defaultValue: event.category })

  // Läs-endast-text beror på källa: koptiska högtider vs synkade händelser (gudstjänst/sakrament)
  const readonlyMessageKey =
    event.category === "feast" || event.category === "fast"
      ? "calendar.fromCopticCalendar"
      : "calendar.readonlySynced"

  // Escape stänger modalen — tangentbords-användare ska kunna stänga utan mus (WCAG)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    // Backdrop — mörkt lager över hela skärmen
    // Klick på backdrop stänger modalen
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        {/* Själva modalen — stopPropagation stoppar klick från att nå backdrop */}
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
              {event.title}
            </h2>
            <ModalCloseButton onClose={onClose} />
          </div>

          {/* Datum */}
          <div className="mb-3">
            <div className="text-xs font-semibold text-faint uppercase">{t("form.date")}</div>
            <div className="text-strong">{formatLongDate(event.start)}</div>
            {/* Juliansk motsvarighet visas bara när juliansk kalender är vald */}
            {calendarSystem === "julian" && (
              <div className="text-xs text-faint mt-0.5">
                {t("calendar.julianLabel", {
                  date: formatLongDate(gregorianToJulian(event.start)),
                })}
              </div>
            )}
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
            <p className="text-xs text-faint italic mt-5">{t(readonlyMessageKey)}</p>
          ) : (
            <DeleteEditActions name={event.title} onDelete={onDelete} onEdit={onEdit} />
          )}
        </div>
      </div>
    </FocusTrap>
  )
}
