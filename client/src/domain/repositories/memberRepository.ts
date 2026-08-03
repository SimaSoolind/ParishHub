// MemberRepository — GRÄNSSNITT (kontrakt) för att hämta och ändra medlemmar
// UI:t vet INTE om datan kommer från mock-filer eller en databas — bara att
// dessa metoder finns. Det gör att datakällan kan bytas utan att röra sidorna.
//
// Implementeras av: mockMemberRepository (nu), apiMemberRepository (när backend finns)

import type { Member, NewMemberData } from "../member"

export interface MemberRepository {
  // Hämtar alla medlemmar
  getAll(): Promise<Member[]>
  // Lägger till en ny medlem och returnerar den skapade (med id)
  add(data: NewMemberData): Promise<Member>
  // Uppdaterar valda fält på en medlem och returnerar den uppdaterade
  update(id: string, changes: Partial<NewMemberData>): Promise<Member>
  // Tar bort en medlem med angivet id
  remove(id: string): Promise<void>
}
