// mockReminderRepository — implementation som håller påminnelser i minnet
// Startar från mock-datan; ändringar sparas i den lokala listan under sessionen
// Implementerar: ReminderRepository. Byts mot apiReminderRepository när backend finns

import type { ReminderRepository } from "../../domain/repositories/reminderRepository"
import type { Reminder } from "../../domain/reminder"
import { mockReminders } from "../reminders.mock"

// Kopia av mock-datan som kan ändras under sessionen (originalet rörs inte)
let reminders: Reminder[] = [...mockReminders]

export const mockReminderRepository: ReminderRepository = {
  async getAll() {
    return [...reminders]
  },

  // Skapar en ny påminnelse (done = false och tidsstämpel sätts här)
  async add(data) {
    const created: Reminder = {
      ...data,
      id: crypto.randomUUID(),
      done: false,
      createdAt: new Date().toISOString(),
    }
    reminders = [...reminders, created]
    return created
  },

  // Markerar en påminnelse som klar eller aktiv igen
  async setDone(id, done) {
    reminders = reminders.map((reminder) => (reminder.id === id ? { ...reminder, done } : reminder))
    const updated = reminders.find((reminder) => reminder.id === id)
    if (!updated) throw new Error("Påminnelse med id " + id + " saknas")
    return updated
  },

  // Tar bort en påminnelse
  async remove(id) {
    reminders = reminders.filter((reminder) => reminder.id !== id)
  },
}
