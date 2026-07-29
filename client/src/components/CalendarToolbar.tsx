// CalendarToolbar — egen verktygsrad för kalendern
// Ersätter react-big-calendars text-baserade navigering med tydliga pil-knappar
// Visar även vilken period som visas och knappar för att byta vy
//
// Används av: Calendar.tsx

import { ChevronLeft, ChevronRight } from "lucide-react"
import type { NavigateAction, View } from "react-big-calendar"

// Kopplar vy-namn till svensk knapptext
const viewLabels: Record<string, string> = {
  month: "Månad",
  week: "Vecka",
  day: "Dag",
  agenda: "Agenda",
}

// Props som react-big-calendar skickar till verktygsraden
// Egen typ istället för ToolbarProps så den inte krockar med event-typen
// views typas som unknown eftersom bibliotekets typ inte matchar det som
// faktiskt skickas (en array av vy-namn) — narras därför i runtime nedan
interface Props {
  label: string
  view: View
  views: unknown
  onNavigate: (action: NavigateAction) => void
  onView: (view: View) => void
}

// Ritar verktygsraden ovanför kalendern
// Tar emot label, onNavigate, onView, view och views från react-big-calendar
// Returnerar raden som JSX
export function CalendarToolbar({ label, onNavigate, onView, view, views }: Props) {
  // Listan med tillgängliga vyer (month, week, day, agenda)
  const viewNames: View[] = Array.isArray(views) ? views : []

  return (
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      {/* Navigering: föregående, idag, nästa */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onNavigate("PREV")}
          aria-label="Föregående"
          className="p-2 rounded-full hover:bg-stone-100 text-stone-600"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => onNavigate("TODAY")}
          className="px-3 py-1 rounded-full text-sm font-semibold text-stone-600 hover:bg-stone-100"
        >
          Idag
        </button>
        <button
          onClick={() => onNavigate("NEXT")}
          aria-label="Nästa"
          className="p-2 rounded-full hover:bg-stone-100 text-stone-600"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Aktuell period, t.ex. "juli 2026" */}
      <span className="font-semibold text-stone-800">{label}</span>

      {/* Vy-växlare: Månad / Vecka / Dag / Agenda */}
      <div className="flex items-center gap-1">
        {viewNames.map((name) => (
          <button
            key={name}
            onClick={() => onView(name)}
            className={
              "px-3 py-1 rounded-full text-sm font-semibold " +
              (view === name
                ? "bg-amber-800 text-white"
                : "text-stone-600 hover:bg-stone-100")
            }
          >
            {viewLabels[name] ?? name}
          </button>
        ))}
      </div>
    </div>
  )
}
