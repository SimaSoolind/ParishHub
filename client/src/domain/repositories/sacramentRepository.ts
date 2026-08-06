// SacramentRepository — GRÄNSSNITT för sakrament
// UI:t vet INTE om datan kommer från mock eller databas — bara att metoderna finns
// Implementeras av: mockSacramentRepository (nu), apiSacramentRepository (när backend finns)

import type { Sacrament, NewSacramentData } from "../sacrament"

export interface SacramentRepository {
  getAll(): Promise<Sacrament[]>
  getByMember(memberId: string): Promise<Sacrament[]>
  add(data: NewSacramentData): Promise<Sacrament>
  update(id: string, changes: Partial<NewSacramentData>): Promise<Sacrament>
  remove(id: string): Promise<void>
}
