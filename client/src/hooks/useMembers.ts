// useMembers — presentation-hook som hämtar och hanterar medlemmar
// Använder MemberRepository, så komponenten slipper veta VAR datan kommer ifrån
// Returnerar klar data (members) + funktioner för att lägga till/ändra/ta bort
//
// Används av: Members.tsx

import { useState, useEffect } from "react"
import type { Member, NewMemberData } from "../domain/member"
import { mockMemberRepository as repository } from "../data/mock/mockMemberRepository"

// Ger medlemslistan och funktioner för att ändra den, via repositoryt
// Tar inga argument
// Returnerar members, loading och funktionerna add/update/remove
export function useMembers() {
  // Medlemmarna som visas — fylls när hämtningen är klar
  const [members, setMembers] = useState<Member[]>([])

  // Sant tills första hämtningen är klar
  const [loading, setLoading] = useState(true)

  // Hämtar alla medlemmar när hooken används första gången
  useEffect(() => {
    repository.getAll().then((data) => {
      setMembers(data)
      setLoading(false)
    })
  }, [])

  // Lägger till en medlem och läser om listan från repositoryt
  const addMember = async (data: NewMemberData) => {
    await repository.add(data)
    setMembers(await repository.getAll())
  }

  // Uppdaterar valda fält på en medlem (t.ex. hela formuläret eller bara familyId)
  const updateMember = async (id: string, changes: Partial<NewMemberData>) => {
    await repository.update(id, changes)
    setMembers(await repository.getAll())
  }

  // Tar bort en medlem
  const removeMember = async (id: string) => {
    await repository.remove(id)
    setMembers(await repository.getAll())
  }

  return { members, loading, addMember, updateMember, removeMember }
}
