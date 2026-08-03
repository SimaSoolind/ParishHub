// BirthdayRepository — GRÄNSSNITT för att hämta födelsedagar (read-only)
// UI:t vet inte om datan kommer från mock eller databas — bara att metoden finns
// Implementeras av: mockBirthdayRepository (nu), apiBirthdayRepository (när backend finns)

import type { Birthday } from "../birthday"

export interface BirthdayRepository {
  getAll(): Promise<Birthday[]>
}
