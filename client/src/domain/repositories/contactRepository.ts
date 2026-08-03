// ContactRepository — GRÄNSSNITT för att hämta kontaktlistan (read-only)
// UI:t vet inte om datan kommer från mock eller databas — bara att metoden finns
// Implementeras av: mockContactRepository (nu), apiContactRepository (när backend finns)

import type { Contact } from "../contact"

export interface ContactRepository {
  getAll(): Promise<Contact[]>
}
