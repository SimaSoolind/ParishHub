// mockServiceNoteRepository — implementation som håller noteringar i minnet
// Startar från mock-datan; ändringar sparas i den lokala listan under sessionen
// Implementerar: ServiceNoteRepository. Byts mot apiServiceNoteRepository när backend finns

import type { ServiceNoteRepository } from "../../domain/repositories/serviceNoteRepository"
import type { ServiceNote } from "../../domain/serviceNote"
import { mockServiceNotes } from "../serviceNotes.mock"

// Kopia av mock-datan som kan ändras under sessionen (originalet rörs inte)
let notes: ServiceNote[] = [...mockServiceNotes]

export const mockServiceNoteRepository: ServiceNoteRepository = {
  // Hämtar alla noteringar för en specifik gudstjänst
  async getByService(serviceId) {
    return notes.filter((note) => note.serviceId === serviceId)
  },

  // Skapar en ny notering med unikt id och tidsstämpel
  async add(data) {
    const created: ServiceNote = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    notes = [...notes, created]
    return created
  },

  // Tar bort en notering
  async remove(id) {
    notes = notes.filter((note) => note.id !== id)
  },
}
