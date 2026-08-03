// mockMemberRepository — implementation som håller medlemmarna i minnet
// Startar från mock-datan; add/update/remove ändrar den lokala listan
// Metoderna är async (Promise) så samma kod fungerar när en riktig databas kommer
//
// Implementerar: MemberRepository. Byts mot apiMemberRepository när backend finns

import type { MemberRepository } from "../../domain/repositories/memberRepository"
import type { Member } from "../../domain/member"
import { mockMembers } from "../members.mock"

// Kopia av mock-datan som kan ändras under sessionen (originalet rörs inte)
let members: Member[] = [...mockMembers]

export const mockMemberRepository: MemberRepository = {
  // Returnerar en kopia av listan så ingen ändrar den utifrån av misstag
  async getAll() {
    return [...members]
  },

  // Skapar en ny medlem med unikt id och lägger till den
  async add(data) {
    const created: Member = { ...data, id: crypto.randomUUID() }
    members = [...members, created]
    return created
  },

  // Slår ihop de nya värdena med den befintliga medlemmen (samma id)
  async update(id, changes) {
    members = members.map((member) => (member.id === id ? { ...member, ...changes } : member))
    const updated = members.find((member) => member.id === id)
    if (!updated) throw new Error("Medlem med id " + id + " saknas")
    return updated
  },

  // Filtrerar bort medlemmen med angivet id
  async remove(id) {
    members = members.filter((member) => member.id !== id)
  },
}
