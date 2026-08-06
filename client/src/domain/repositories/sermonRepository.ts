// SermonRepository — GRÄNSSNITT för predikningar
// UI:t vet INTE om datan kommer från mock eller databas — bara att metoderna finns
// Implementeras av: mockSermonRepository (nu), apiSermonRepository (när backend finns)

import type { Sermon, NewSermonData } from "../sermon"

export interface SermonRepository {
  getAll(): Promise<Sermon[]>
  add(data: NewSermonData): Promise<Sermon>
  update(id: string, changes: Partial<NewSermonData>): Promise<Sermon>
  remove(id: string): Promise<void>
}
