// mockEventRepository — implementation som håller kalender-händelser i minnet
// Startar från mock-källorna (church + life) och konverterar dem till CalendarEvent
// Implementerar: EventRepository. Byts mot apiEventRepository när backend finns

import type { EventRepository } from "../../domain/repositories/eventRepository"
import type { CalendarEvent, NewEventData } from "../../domain/event"
import { churchEvents, lifeEvents } from "../events.mock"

// Konverterar de två mock-källorna till appens enhetliga CalendarEvent-format
// Datum blir Date-objekt (start = end eftersom det är endagsevent)
function buildInitial(): CalendarEvent[] {
  const church: CalendarEvent[] = churchEvents.map((event) => ({
    id: event.id,
    title: event.name,
    start: new Date(event.date),
    end: new Date(event.date),
    category: event.category,
  }))

  const life: CalendarEvent[] = lifeEvents.map((event) => ({
    id: event.id,
    title: event.title,
    start: new Date(event.date),
    end: new Date(event.date),
    category: event.category,
    notes: event.notes,
  }))

  return [...church, ...life]
}

// Kopia som kan ändras under sessionen (mock-källorna rörs inte)
let events: CalendarEvent[] = buildInitial()

// Bygger ett CalendarEvent från formulär-datan
function toCalendarEvent(id: string, data: NewEventData): CalendarEvent {
  return {
    id,
    title: data.title,
    start: new Date(data.date),
    end: new Date(data.date),
    category: data.category,
    notes: data.notes,
  }
}

export const mockEventRepository: EventRepository = {
  async getAll() {
    return [...events]
  },

  async add(data) {
    const created = toCalendarEvent(crypto.randomUUID(), data)
    events = [...events, created]
    return created
  },

  async update(id, data) {
    events = events.map((event) => (event.id === id ? toCalendarEvent(id, data) : event))
    const updated = events.find((event) => event.id === id)
    if (!updated) throw new Error("Event med id " + id + " saknas")
    return updated
  },

  async remove(id) {
    events = events.filter((event) => event.id !== id)
  },
}
