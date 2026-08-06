// useMemberSearch — hanterar sök och filter för medlemslistan
// Håller sök-text och kategori-filter i state
// Returnerar filtrerad lista och funktioner för att uppdatera filtren
//
// Används av: Members.tsx

import { useState, useMemo } from "react"
import type { Member, MemberCategory } from "../domain/member"

export type FilterCategory = MemberCategory | "all"

// Status-filter: alla, bara aktiva eller bara inaktiva
export type StatusFilter = "all" | "active" | "inactive"

// Filtrerar en medlemslista efter sök-text och vald kategori
// Tar emot members (hela listan) som argument
// Returnerar sök-state, filter-state och den filtrerade listan
export function useMemberSearch(members: Member[]) {
  const [searchText, setSearchText] = useState("")
  const [filter, setFilter] = useState<FilterCategory>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Medlemmar utan angiven status räknas som aktiva
      const memberStatus = member.status ?? "active"
      const matchesFilter = filter === "all" || member.category === filter
      const matchesStatus = statusFilter === "all" || memberStatus === statusFilter
      const matchesSearch = member.name.toLowerCase().includes(searchText.toLowerCase())
      return matchesFilter && matchesStatus && matchesSearch
    })
  }, [members, searchText, filter, statusFilter])

  return {
    searchText,
    setSearchText,
    filter,
    setFilter,
    statusFilter,
    setStatusFilter,
    filteredMembers,
  }
}
