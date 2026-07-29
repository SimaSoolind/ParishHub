// Members — visar hela medlemsregistret
// Innehåller sök-fält och kategori-filter
//
// Används av: App.tsx (sidan för URL "/medlemmar")
// Bygger på: useMemberSearch (logik) och MemberCard (visning)
// Data: mockMembers (byts mot backend senare)

import { Search } from "lucide-react"
import { MemberCard } from "../components/MemberCard"
import { useMemberSearch } from "../hooks/useMemberSearch"
import type { FilterCategory } from "../hooks/useMemberSearch"
import { mockMembers } from "../data/members.mock"

// TODO: göra dynamiskt när backend finns
const filterOptions: { value: FilterCategory; label: string }[] = [
  { value: "all", label: "Alla" },
  { value: "adult", label: "Vuxen" },
  { value: "youth", label: "Ungdom" },
  { value: "leader", label: "Ledare" },
  { value: "other", label: "Övrig" }
]

// Ritar medlemssidan: sökfält, filter-knappar och lista med MemberCard
// Sök- och filter-logik ligger i useMemberSearch — här bara visning
// Tar inga props och returnerar sidan som JSX
export function Members() {
  const { searchText, setSearchText, filter, setFilter, filteredMembers } =
    useMemberSearch(mockMembers)

  const total = filteredMembers.length

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Medlemmar</h1>
      <p className="text-stone-600 mb-6">Totalt {total} medlemmar</p>

      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
        />
        <input
          type="text"
          placeholder="Sök på namn..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {filterOptions.map((option) => {
          const isActive = filter === option.value
          const activeClasses = "bg-amber-800 text-white border-amber-800"
          const inactiveClasses = "bg-white text-stone-600 border-stone-200 hover:border-amber-800"

          return (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={"px-4 py-2 rounded-full border text-sm font-semibold " + (isActive ? activeClasses : inactiveClasses)}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
        {filteredMembers.length === 0 ? (
          <p className="text-sm text-stone-500 italic text-center py-4">
            Inga medlemmar hittades.
          </p>
        ) : (
          filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))
        )}
      </div>
    </div>
  )
}