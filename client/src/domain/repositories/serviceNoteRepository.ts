// ServiceNoteRepository — GRÄNSSNITT för gudstjänst-noteringar
// UI:t vet INTE om datan kommer från mock eller databas — bara att metoderna finns
// Implementeras av: mockServiceNoteRepository (nu), apiServiceNoteRepository (när backend finns)

import type { ServiceNote, NewServiceNoteData } from "../serviceNote"

export interface ServiceNoteRepository {
  getByService(serviceId: string): Promise<ServiceNote[]>
  add(data: NewServiceNoteData): Promise<ServiceNote>
  remove(id: string): Promise<void>
}
