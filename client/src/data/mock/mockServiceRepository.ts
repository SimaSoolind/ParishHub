// mockServiceRepository — implementation som håller gudstjänster + närvaro i minnet
// Startar från mock-datan; ändringar sparas i de lokala listorna
// Implementerar: ServiceRepository. Byts mot apiServiceRepository när backend finns

import type { ServiceRepository } from "../../domain/repositories/serviceRepository"
import type { Service, Attendance } from "../../domain/service"
import { mockServices, mockAttendance } from "../services.mock"

// Kopior av mock-datan som kan ändras under sessionen (originalet rörs inte)
let services: Service[] = [...mockServices]
let attendance: Attendance[] = [...mockAttendance]

export const mockServiceRepository: ServiceRepository = {
  async getAll() {
    return [...services]
  },

  // Skapar en ny gudstjänst med unikt id
  async add(data) {
    const created: Service = { ...data, id: crypto.randomUUID() }
    services = [...services, created]
    return created
  },

  // Sätter (eller nollställer) anteckningen på en gudstjänst
  async updateNote(id, note) {
    services = services.map((s) => (s.id === id ? { ...s, notes: note.trim() || undefined } : s))
    const updated = services.find((s) => s.id === id)
    if (!updated) throw new Error("Gudstjänst med id " + id + " saknas")
    return updated
  },

  // Tar bort en gudstjänst och dess tillhörande närvaro-poster (ingen rest lämnas kvar)
  async remove(id) {
    services = services.filter((s) => s.id !== id)
    attendance = attendance.filter((a) => a.serviceId !== id)
  },

  async getAttendance() {
    return [...attendance]
  },

  // Ersätter all närvaro för en gudstjänst med de nya posterna
  async saveAttendance(serviceId, records) {
    attendance = [...attendance.filter((a) => a.serviceId !== serviceId), ...records]
    return [...attendance]
  },
}
