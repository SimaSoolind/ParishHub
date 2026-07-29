// Calendar — kyrko-kalender med dag/vecka/månad-vy
// Klick på ett event öppnar EventModal med detaljer
// Klick på "Ny händelse" öppnar AddEventModal (formulär)
//
// Används av: App.tsx (sidan för URL "/kalender")
// Bygger på: react-big-calendar, EventModal och AddEventModal
// Data: startar från events.mock, ligger sedan i state så nya kan läggas till

import { useState } from "react"
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from "react-big-calendar"
import type { View, SlotInfo } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { sv } from "date-fns/locale"
import { RefreshCw, Plus } from "lucide-react"
import { churchEvents, lifeEvents } from "../data/events.mock"
import { EventModal } from "../components/EventModal"
import type { ModalEvent } from "../components/EventModal"
import { AddEventModal } from "../components/AddEventModal"
import type { NewEventData } from "../components/AddEventModal"
import { useCopticCelebrations } from "../hooks/useCopticCelebrations"
import { CalendarToolbar } from "../components/CalendarToolbar"

// Localizer med date-fns för datum-hantering på svenska
const locales = { sv: sv }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Beskriver formen för ett event som visas i kalendern
interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  category: string
  notes?: string
  // Sant för koptiska högtider — dessa kan inte ändras eller raderas
  isReadOnly?: boolean
}

// Bygger startlistan med events från mockdatan
// Konverterar church- och life-events till kalenderns format
// Tar inga argument och returnerar en lista med CalendarEvent
function buildInitialEvents(): CalendarEvent[] {
  const church = churchEvents.map((event) => ({
    id: event.id,
    title: event.name,
    start: new Date(event.date),
    end: new Date(event.date),
    category: event.category,
    notes: undefined,
  }))

  const life = lifeEvents.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.date),
    end: new Date(event.date),
    category: event.category,
    notes: event.notes,
  }))

  return [...church, ...life]
}

// Kalender-knappar översatta till svenska
const messages = {
  today: "Idag",
  previous: "Föregående",
  next: "Nästa",
  month: "Månad",
  week: "Vecka",
  day: "Dag",
  agenda: "Agenda",
  date: "Datum",
  time: "Tid",
  event: "Händelse",
  noEventsInRange: "Inga händelser under denna period.",
}

// Ritar kalendern och sköter events, vald vy, datum och modaler
// Tar inga props
// Returnerar sidan som JSX
export function Calendar() {
  // Hela listan med events — ligger i state så nya kan läggas till
  const [events, setEvents] = useState<CalendarEvent[]>(buildInitialEvents)

  // Det valda eventet — null om inget är valt (styr detalj-modalen)
  const [selectedEvent, setSelectedEvent] = useState<ModalEvent | null>(null)

  // Styr kalender-vy och datum (controlled component)
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState(new Date())

  // Styr om Ny-händelse-modalen är öppen
  const [addModalOpen, setAddModalOpen] = useState(false)

  // Håller eventet som redigeras — null när inget redigeras
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  // Körs när prästen sparar ett nytt event från formuläret
  // Skapar ett CalendarEvent och lägger till det i listan
  const handleAddEvent = (newEvent: NewEventData) => {
    const eventToAdd: CalendarEvent = {
      id: "e" + Date.now(),
      title: newEvent.title,
      start: new Date(newEvent.date),
      end: new Date(newEvent.date),
      category: newEvent.category,
      notes: newEvent.notes,
    }

    // Skapar en NY array med gamla events + det nya (immutable update)
    setEvents((prev) => [...prev, eventToAdd])
    setAddModalOpen(false)
  }

  // Körs när prästen klickar på en dag i kalendern
  // Byter till dag-vyn och visar den valda dagens schema
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setDate(slotInfo.start)
    setView(Views.DAY)
  }

  // Körs när prästen sparar en ändring av ett befintligt event
  // Ersätter eventet med samma id med de nya värdena
  const handleUpdateEvent = (updated: NewEventData) => {
    if (!editingEvent) return

    setEvents((prev) =>
      prev.map((event) =>
        event.id === editingEvent.id
          ? {
              ...event,
              title: updated.title,
              start: new Date(updated.date),
              end: new Date(updated.date),
              category: updated.category,
              notes: updated.notes,
            }
          : event
      )
    )
    setEditingEvent(null)
  }

  // Tar bort eventet med angivet id ur listan
  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id))
    setSelectedEvent(null)
  }

  // Öppnar redigeringsformuläret förifyllt med det valda eventet
  const handleStartEdit = () => {
    if (!selectedEvent) return

    const fullEvent = events.find((event) => event.id === selectedEvent.id)
    if (fullEvent) setEditingEvent(fullEvent)
    setSelectedEvent(null)
  }

  // Hämtar koptiska högtider från API:et (skrivskyddade)
  const copticEvents = useCopticCelebrations()

  // Slår ihop egna event med de koptiska högtiderna för visning
  // Bara egna event ligger i state — högtiderna kommer från API:et
  const shownEvents = [...events, ...copticEvents]

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">
        Kyrklig kalender
      </h1>
      <p className="text-stone-600 mb-6">
        Koptisk-ortodox + församlings-händelser
      </p>

      {/* Knappar för framtida synk + skapa nytt event */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-600 text-sm font-semibold hover:border-amber-800">
          <RefreshCw size={16} />
          Synka Google Calendar
        </button>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900"
        >
          <Plus size={16} />
          Ny händelse
        </button>
      </div>

      {/* Själva kalendern */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-200" style={{ height: 600 }}>
        <BigCalendar
          localizer={localizer}
          events={shownEvents}
          startAccessor="start"
          endAccessor="end"
          messages={messages}
          culture="sv"
          views={["month", "week", "day", "agenda"]}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event: ModalEvent) => setSelectedEvent(event)}
          components={{ toolbar: CalendarToolbar }}
          // eventPropGetter körs för varje event och bestämmer dess utseende
          // Koptiska högtider (isReadOnly) får kopparfärg, egna event standardfärg
          eventPropGetter={(event: CalendarEvent) =>
            event.isReadOnly
              ? { style: { backgroundColor: "#C4956A", borderColor: "#C4956A" } }
              : {}
          }
        />
      </div>

      {/* Detalj-modal visas när ett event är valt */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={handleStartEdit}
          onDelete={() => handleDeleteEvent(selectedEvent.id)}
        />
      )}

      {/* Ny-händelse-modal visas när Ny-knappen klickats */}
      {addModalOpen && (
        <AddEventModal
          onSave={handleAddEvent}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {/* Ändra-modal visas när ett event redigeras — förifylld med värdena */}
      {editingEvent && (
        <AddEventModal
          isEdit
          initialData={{
            title: editingEvent.title,
            date: format(editingEvent.start, "yyyy-MM-dd"),
            category: editingEvent.category,
            notes: editingEvent.notes,
          }}
          onSave={handleUpdateEvent}
          onClose={() => setEditingEvent(null)}
        />
      )}
    </div>
  )
}
