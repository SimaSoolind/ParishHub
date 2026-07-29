// AddEventModal — formulär för att skapa ELLER ändra ett event
// Prästen fyller i titel, datum, kategori och anteckningar
// Skickar värdena till föräldern via onSave-prop
// Om initialData skickas in öppnas formuläret förifyllt (redigeringsläge)
//
// Används av: Calendar.tsx

import { useState } from "react"
import { z } from "zod"
import { X } from "lucide-react"
import { lifeEventCategoryOptions } from "../data/eventCategories"

// Beskriver formen för ett nytt event som skickas till föräldern
export interface NewEventData {
  title: string
  date: string
  category: string
  notes?: string
}

interface Props {
  onSave: (event: NewEventData) => void
  onClose: () => void
  // Förifyllda värden — vid redigering, eller bara datum vid klick på en dag
  initialData?: NewEventData
  // Sant vid redigering — styr rubrik och knapptext
  isEdit?: boolean
}

// Zod-schema som validerar formuläret innan sparning
// Titel och datum är obligatoriska, anteckningar är frivilligt
const newEventSchema = z.object({
  title: z.string().trim().min(1, "Titel krävs"),
  date: z.string().min(1, "Datum krävs"),
  category: z.string(),
  notes: z.string().optional(),
})

// Ritar formuläret och håller fältens värden i state
// Tar emot onSave (spara-funktion) och onClose (stäng-funktion) som props
// Returnerar modalen som JSX
export function AddEventModal({ onSave, onClose, initialData, isEdit = false }: Props) {
  // State för varje formulär-fält — förifylls vid redigering, annars tomt
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [date, setDate] = useState(initialData?.date ?? "")
  const [category, setCategory] = useState(initialData?.category ?? "baptism")
  const [notes, setNotes] = useState(initialData?.notes ?? "")

  // Håller felmeddelanden per fält från valideringen
  const [errors, setErrors] = useState<{ title?: string; date?: string }>({})

  // Körs när formuläret skickas
  // Validerar med Zod och skickar vidare bara om allt är korrekt
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = newEventSchema.safeParse({
      title,
      date,
      category,
      notes: notes || undefined,
    })

    // Om valideringen misslyckas — visa felmeddelanden och avbryt
    if (!result.success) {
      const fieldErrors: { title?: string; date?: string } = {}
      for (const issue of result.error.issues) {
        if (issue.path[0] === "title") fieldErrors.title = issue.message
        if (issue.path[0] === "date") fieldErrors.date = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    // Skickar det validerade eventet till föräldern
    setErrors({})
    onSave(result.data)
  }

  return (
    // Backdrop — klick utanför stänger modalen
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
      >
        {/* Rubrik-rad med stäng-knapp */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-800">
            {isEdit ? "Redigera händelse" : "Ny händelse"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100"
            aria-label="Stäng"
          >
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        {/* Själva formuläret — onSubmit triggas vid Spara-klick */}
        <form onSubmit={handleSubmit}>
          {/* Titel-fält */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Titel
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="T.ex. Dop — Familjen Svensson"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Datum-fält */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Datum
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
            />
            {errors.date && (
              <p className="text-xs text-red-600 mt-1">{errors.date}</p>
            )}
          </div>

          {/* Kategori-dropdown */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
            >
              {lifeEventCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Anteckningar — valfritt fält */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Anteckningar (frivilligt)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="T.ex. Ta med bibel och bön"
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none resize-none"
            />
          </div>

          {/* Knappar */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-stone-200 rounded-xl font-semibold text-stone-600 hover:bg-stone-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-900"
            >
              {isEdit ? "Spara ändring" : "Spara"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
