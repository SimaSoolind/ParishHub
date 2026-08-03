// useEvents — presentation-hook för prästens egna kalender-händelser
// Använder EventRepository, så sidan slipper veta var datan kommer ifrån
// Returnerar events + funktioner för att lägga till/ändra/ta bort
// (Koptiska högtider hämtas separat via useCopticCelebrations)
//
// Används av: Calendar.tsx

import { useState, useEffect } from "react"
import type { CalendarEvent, NewEventData } from "../domain/event"
import { mockEventRepository as repository } from "../data/mock/mockEventRepository"

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  // Hämtar händelserna när hooken används första gången
  useEffect(() => {
    repository.getAll().then((data) => {
      setEvents(data)
      setLoading(false)
    })
  }, [])

  // Lägger till ett event
  const addEvent = async (data: NewEventData) => {
    await repository.add(data)
    setEvents(await repository.getAll())
  }

  // Uppdaterar ett event med samma id
  const updateEvent = async (id: string, data: NewEventData) => {
    await repository.update(id, data)
    setEvents(await repository.getAll())
  }

  // Tar bort ett event
  const removeEvent = async (id: string) => {
    await repository.remove(id)
    setEvents(await repository.getAll())
  }

  return { events, loading, addEvent, updateEvent, removeEvent }
}
