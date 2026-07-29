// useMemberSearch — hanterar sök och filter för medlemslistan
// Håller sök-text och kategori-filter i state
// Returnerar filtrerad lista och funktioner för att uppdatera filtren
//
// Används av: Members.tsx

import { useState, useMemo } from "react"
import type { Member, MemberCategory } from "../types/member"

export type FilterCategory = MemberCategory | "all"

// Filtrerar en medlemslista efter sök-text och vald kategori
// Tar emot members (hela listan) som argument
// Returnerar sök-state, filter-state och den filtrerade listan
export function useMemberSearch(members: Member[]) {
  const [searchText, setSearchText] = useState("")
  const [filter, setFilter] = useState<FilterCategory>("all")

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesFilter = filter === "all" || member.category === filter
      const matchesSearch = member.name
        .toLowerCase()
        .includes(searchText.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [members, searchText, filter])

  return {
    searchText,
    setSearchText,
    filter,
    setFilter,
    filteredMembers
  }
}