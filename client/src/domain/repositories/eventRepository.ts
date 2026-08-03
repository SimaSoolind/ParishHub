// EventRepository — GRÄNSSNITT för prästens egna kalender-händelser
// UI:t vet INTE om datan kommer från mock eller databas — bara att metoderna finns
// (Koptiska högtider hämtas separat via useCopticCelebrations och ingår inte här)
// Implementeras av: mockEventRepository (nu), apiEventRepository (när backend finns)

import type { CalendarEvent, NewEventData } from "../event"

export interface EventRepository {
  getAll(): Promise<CalendarEvent[]>
  add(data: NewEventData): Promise<CalendarEvent>
  update(id: string, data: NewEventData): Promise<CalendarEvent>
  remove(id: string): Promise<void>
}
