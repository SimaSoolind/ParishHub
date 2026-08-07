// mockSermonRepository — implementation som håller predikningar i minnet
// Startar från mock-datan; ändringar sparas i den lokala listan under sessionen
// Implementerar: SermonRepository. Byts mot apiSermonRepository när backend finns

import type { SermonRepository } from "../../domain/repositories/sermonRepository"
import type { Sermon } from "../../domain/sermon"
import { mockSermons } from "../sermons.mock"

// Kopia av mock-datan som kan ändras under sessionen (originalet rörs inte)
let sermons: Sermon[] = [...mockSermons]

export const mockSermonRepository: SermonRepository = {
  async getAll() {
    return [...sermons]
  },

  // Skapar en ny predikan med unikt id
  async add(data) {
    const created: Sermon = { ...data, id: crypto.randomUUID() }
    sermons = [...sermons, created]
    return created
  },

  // Uppdaterar valda fält på en predikan
  async update(id, changes) {
    sermons = sermons.map((sermon) => (sermon.id === id ? { ...sermon, ...changes } : sermon))
    const updated = sermons.find((sermon) => sermon.id === id)
    if (!updated) throw new Error("Predikan med id " + id + " saknas")
    return updated
  },

  // Tar bort en predikan
  async remove(id) {
    sermons = sermons.filter((sermon) => sermon.id !== id)
  },
}
