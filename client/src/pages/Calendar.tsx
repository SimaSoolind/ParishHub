// Calendar — kyrko-kalender med dag/vecka/månad-vy
// Klick på ett event öppnar EventModal med detaljer
// Klick på "Ny händelse" öppnar AddEventModal (formulär)
//
// Används av: App.tsx (sidan för URL "/kalender")
// Bygger på: react-big-calendar, useEvents (egna event) och useCopticCelebrations (högtider)
// Data: egna event via useEvents — sidan vet inte om det är mock eller databas

import { useState } from "react"
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from "react-big-calendar"
import type { View, SlotInfo } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { sv } from "date-fns/locale"
import { RefreshCw, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { EventModal } from "../components/EventModal"
import type { ModalEvent } from "../components/EventModal"
import { AddEventModal } from "../components/AddEventModal"
import { CalendarToolbar } from "../components/CalendarToolbar"
import { useEvents } from "../hooks/useEvents"
import { useCopticCelebrations } from "../hooks/useCopticCelebrations"
import type { CalendarEvent, NewEventData } from "../domain/event"

// Localizer med date-fns för datum-hantering på svenska
const locales = { sv: sv }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

// Ritar kalendern och sköter events, vald vy, datum och modaler
// Tar inga props
// Returnerar sidan som JSX
export function Calendar() {
  const { t } = useTranslation()

  // Egna event och CRUD-funktioner kommer från hooken (via repositoryt)
  const { events, addEvent, updateEvent, removeEvent } = useEvents()

  // Kalender-knappar i valt språk (react-big-calendar messages)
  const messages = {
    today: t("calendar.today"),
    previous: t("calendar.previous"),
    next: t("calendar.next"),
    month: t("calendar.month"),
    week: t("calendar.week"),
    day: t("calendar.day"),
    agenda: t("calendar.agenda"),
    date: t("calendar.date"),
    time: t("calendar.time"),
    event: t("calendar.event"),
    noEventsInRange: t("calendar.noEventsInRange"),
  }

  // Det valda eventet — null om inget är valt (styr detalj-modalen)
  const [selectedEvent, setSelectedEvent] = useState<ModalEvent | null>(null)

  // Styr kalender-vy och datum (controlled component)
  const [view, setView] = useState<View>(Views.MONTH)
  const [date, setDate] = useState(new Date())

  // Styr om Ny-händelse-modalen är öppen
  const [addModalOpen, setAddModalOpen] = useState(false)

  // Håller eventet som redigeras — null när inget redigeras
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)

  // Körs när prästen sparar ett nytt event — repositoryt skapar id:t
  const handleAddEvent = (newEvent: NewEventData) => {
    addEvent(newEvent)
    setAddModalOpen(false)
    toast.success(t("common.added"))
  }

  // Körs när prästen klickar på en dag i kalendern
  // Byter till dag-vyn och visar den valda dagens schema
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setDate(slotInfo.start)
    setView(Views.DAY)
  }

  // Körs när prästen sparar en ändring — uppdaterar eventet med samma id
  const handleUpdateEvent = (updated: NewEventData) => {
    if (!editingEvent) return
    updateEvent(editingEvent.id, updated)
    setEditingEvent(null)
    toast.success(t("common.updated"))
  }

  // Tar bort eventet med angivet id
  const handleDeleteEvent = (id: string) => {
    removeEvent(id)
    setSelectedEvent(null)
    toast.success(t("common.removed"))
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
  // Bara egna event hanteras via repositoryt — högtiderna kommer från API:et
  const shownEvents = [...events, ...copticEvents]

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold text-strong mb-2">{t("calendar.title")}</h1>
        <p className="text-soft mb-6">{t("calendar.subtitle")}</p>
      </header>

      {/* Knappar för framtida synk + skapa nytt event */}
      <section aria-label={t("a11y.toolbar")} className="flex gap-2 mb-6 flex-wrap">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 text-stone-600 text-sm font-semibold hover:border-amber-800 dark:bg-stone-800 dark:border-stone-600 dark:text-stone-300 dark:hover:border-amber-500">
          <RefreshCw size={16} />
          {t("calendar.syncGoogle")}
        </button>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900"
        >
          <Plus size={16} />
          {t("calendar.newEvent")}
        </button>
      </section>

      {/* Själva kalendern */}
      <div className="surface border p-4 rounded-2xl shadow-sm" style={{ height: 600 }}>
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
        <AddEventModal onSave={handleAddEvent} onClose={() => setAddModalOpen(false)} />
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
    </>
  )
}
