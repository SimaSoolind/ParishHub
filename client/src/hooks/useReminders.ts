// useReminders — presentation-hook för manuella påminnelser
// Använder ReminderRepository, så komponenten slipper veta var datan kommer ifrån
// Returnerar påminnelserna + funktioner för att skapa, markera klar och ta bort
//
// Används av: ReminderCard

import { useState, useEffect } from "react"
import type { Reminder, NewReminderData } from "../domain/reminder"
import { mockReminderRepository as repository } from "../data/mock/mockReminderRepository"

// Ger påminnelserna och funktioner för att ändra dem, via repositoryt
// Tar inga argument
// Returnerar reminders, loading, addReminder, markDone och removeReminder
export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)

  // Hämtar påminnelserna när hooken används första gången
  useEffect(() => {
    repository.getAll().then((list) => {
      setReminders(list)
      setLoading(false)
    })
  }, [])

  // Skapar en ny påminnelse och läser om listan
  const addReminder = async (data: NewReminderData) => {
    await repository.add(data)
    setReminders(await repository.getAll())
  }

  // Markerar en påminnelse som klar och läser om listan
  const markDone = async (id: string) => {
    await repository.setDone(id, true)
    setReminders(await repository.getAll())
  }

  // Tar bort en påminnelse och läser om listan
  const removeReminder = async (id: string) => {
    await repository.remove(id)
    setReminders(await repository.getAll())
  }

  return { reminders, loading, addReminder, markDone, removeReminder }
}
