// EventModal — pop-up som visar detaljer om ett event
// Öppnas när användaren klickar på ett event i kalendern
// Stängs genom att klicka utanför eller på Stäng-knappen
//
// Används av: Calendar.tsx

import { X, Trash2, Pencil } from "lucide-react"
import { categoryLabels } from "../data/eventCategories"

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
  const categoryLabel = categoryLabels[event.category] || event.category

  return (
    // Backdrop — mörkt lager över hela skärmen
    // Klick på backdrop stänger modalen
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      {/* Själva modalen — stopPropagation stoppar klick från att nå backdrop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        {/* Rubrik-rad med stäng-knapp */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-800">{event.title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100"
            aria-label="Stäng"
          >
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        {/* Datum */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-stone-400 uppercase">Datum</div>
          <div className="text-stone-800">{formatDate(event.start)}</div>
        </div>

        {/* Kategori */}
        <div className="mb-3">
          <div className="text-xs font-semibold text-stone-400 uppercase">Kategori</div>
          <div className="text-stone-800">{categoryLabel}</div>
        </div>

        {/* Anteckningar visas endast om de finns */}
        {event.notes && (
          <div className="mb-3">
            <div className="text-xs font-semibold text-stone-400 uppercase">Anteckningar</div>
            <div className="text-stone-800">{event.notes}</div>
          </div>
        )}

        {/* Skrivskyddade event (koptiska högtider) kan inte ändras */}
        {event.isReadOnly ? (
          <p className="text-xs text-stone-400 italic mt-5">
            Från den koptiska kyrkokalendern
          </p>
        ) : (
          <div className="flex gap-2 mt-5">
            <button
              onClick={onDelete}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 rounded-xl font-semibold text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Radera
            </button>
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-900"
            >
              <Pencil size={16} />
              Redigera
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
