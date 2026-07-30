// AddServiceModal — formulär för att skapa en ny gudstjänst
// Prästen fyller i titel, datum, starttid och anteckningar
// Skickar värdena till föräldern via onSave-prop
//
// Används av: Services.tsx

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { NewServiceData } from "../types/service"
import { newServiceSchema } from "../schemas/serviceSchema"

interface Props {
  onSave: (service: NewServiceData) => void
  onClose: () => void
}

// Dagens datum i ISO-format (YYYY-MM-DD) — används som standardvärde
// Sätts dynamiskt istället för ett låst datum
const today = new Date().toISOString().split("T")[0]

// Förslag på titlar prästen kan välja snabbt
// Fritext-fältet under används för egna namn (t.ex. Fasta eller Jul)
const presetTitles = [
  "Huvudgudstjänst",
  "Gudstjänst",
  "Söndagsgudstjänst",
  "Den heliga liturgin",
]

// Ritar formuläret och håller fältens värden i state
// Tar emot onSave (spara) och onClose (stäng)
// Returnerar modalen som JSX
export function AddServiceModal({ onSave, onClose }: Props) {
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
          <h2 className="text-xl font-bold text-stone-800">Ny gudstjänst</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100"
            aria-label="Stäng"
          >
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Titel — snabbval-knappar + fritext för eget namn (maxLength 100) */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Titel
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {presetTitles.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setTitle(preset)}
                  className={
                    "px-3 py-1 rounded-full text-xs font-semibold border " +
                    (title === preset
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-white text-stone-600 border-stone-200 hover:border-amber-800")
                  }
                >
                  {preset}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              placeholder="Eller skriv eget, t.ex. Fasta eller Jul"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Datum */}
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

          {/* Starttid och sluttid bredvid varandra */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
                Starttid
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
              />
              {errors.startTime && (
                <p className="text-xs text-red-600 mt-1">{errors.startTime}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
                Sluttid (frivilligt)
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Anteckningar — valfritt fält (maxLength 500) */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Anteckningar (frivilligt)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="T.ex. Predikan om barmhärtighet"
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
              Spara
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
