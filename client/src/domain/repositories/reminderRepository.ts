// ReminderRepository — GRÄNSSNITT för manuella påminnelser
// UI:t vet INTE om datan kommer från mock eller databas — bara att metoderna finns
// Implementeras av: mockReminderRepository (nu), apiReminderRepository (när backend finns)

import type { Reminder, NewReminderData } from "../reminder"

export interface ReminderRepository {
  getAll(): Promise<Reminder[]>
  add(data: NewReminderData): Promise<Reminder>
  setDone(id: string, done: boolean): Promise<Reminder>
  remove(id: string): Promise<void>
}
