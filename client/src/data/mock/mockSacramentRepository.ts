// mockSacramentRepository — implementation som håller sakrament i minnet
// Startar från mock-datan; ändringar sparas i den lokala listan under sessionen
// Implementerar: SacramentRepository. Byts mot apiSacramentRepository när backend finns

import type { SacramentRepository } from "../../domain/repositories/sacramentRepository"
import type { Sacrament } from "../../domain/sacrament"
import { mockSacraments } from "../sacraments.mock"

// Kopia av mock-datan som kan ändras under sessionen (originalet rörs inte)
let sacraments: Sacrament[] = [...mockSacraments]

export const mockSacramentRepository: SacramentRepository = {
  // Hämtar alla sakrament (för översiktssidan)
  async getAll() {
    return [...sacraments]
  },

  // Hämtar alla sakrament för en specifik medlem
  async getByMember(memberId) {
    return sacraments.filter((sacrament) => sacrament.memberId === memberId)
  },

  // Skapar ett nytt sakrament med unikt id
  async add(data) {
    const created: Sacrament = { ...data, id: crypto.randomUUID() }
    sacraments = [...sacraments, created]
    return created
  },

  // Uppdaterar valda fält på ett sakrament
  async update(id, changes) {
    sacraments = sacraments.map((sacrament) =>
      sacrament.id === id ? { ...sacrament, ...changes } : sacrament
    )
    const updated = sacraments.find((sacrament) => sacrament.id === id)
    if (!updated) throw new Error("Sakrament med id " + id + " saknas")
    return updated
  },

  // Tar bort ett sakrament
  async remove(id) {
    sacraments = sacraments.filter((sacrament) => sacrament.id !== id)
  },
}
