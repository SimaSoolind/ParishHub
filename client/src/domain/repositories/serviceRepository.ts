// ServiceRepository — GRÄNSSNITT för gudstjänster och deras närvaro
// UI:t vet INTE om datan kommer från mock eller databas — bara att metoderna finns
// Implementeras av: mockServiceRepository (nu), apiServiceRepository (när backend finns)

import type { Service, NewServiceData, Attendance } from "../service"

export interface ServiceRepository {
  // Gudstjänster
  getAll(): Promise<Service[]>
  add(data: NewServiceData): Promise<Service>
  updateNote(id: string, note: string): Promise<Service>
  update(id: string, changes: Partial<NewServiceData>): Promise<Service>
  remove(id: string): Promise<void>

  // Närvaro
  getAttendance(): Promise<Attendance[]>
  saveAttendance(serviceId: string, records: Attendance[]): Promise<Attendance[]>
}
