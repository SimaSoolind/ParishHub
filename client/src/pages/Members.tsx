// Members — visar hela medlemsregistret
// Innehåller sök-fält och kategori-filter
//
// Används av: App.tsx (sidan för URL "/medlemmar")
// Bygger på: useMemberSearch (logik) och MemberCard (visning)
// Data: startar från mockMembers, ligger sedan i state så nya kan läggas till

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { MemberCard } from "../components/MemberCard"
import { AddMemberModal } from "../components/AddMemberModal"
import { MemberProfileModal } from "../components/MemberProfileModal"
import { useMemberSearch } from "../hooks/useMemberSearch"
import type { FilterCategory } from "../hooks/useMemberSearch"
import type { Member, NewMemberData } from "../types/member"
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
  // Hela medlemslistan — ligger i state så nya kan läggas till
  const [members, setMembers] = useState<Member[]>(mockMembers)

  // Styr om Ny-medlem-modalen är öppen
  const [addModalOpen, setAddModalOpen] = useState(false)

  // Håller medlemmen som redigeras — null när ingen redigeras
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  // Håller medlemmen vars profil visas — null när ingen är vald
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const { searchText, setSearchText, filter, setFilter, filteredMembers } =
    useMemberSearch(members)

  const total = filteredMembers.length

  // Körs när prästen sparar en ny medlem från formuläret
  // Skapar ett Member med nytt id och lägger till det i listan
  const handleAddMember = (newMember: NewMemberData) => {
    const memberToAdd: Member = {
      id: "m" + Date.now(),
      ...newMember,
    }
    setMembers((prev) => [...prev, memberToAdd])
    setAddModalOpen(false)
  }

  // Körs när prästen sparar en ändring
  // Ersätter medlemmen med samma id med de nya värdena (id behålls)
  const handleUpdateMember = (updated: NewMemberData) => {
    if (!editingMember) return
    setMembers((prev) =>
      prev.map((member) =>
        member.id === editingMember.id ? { ...member, ...updated } : member
      )
    )
    setEditingMember(null)
  }

  // Tar bort medlemmen med angivet id ur listan
  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((member) => member.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-stone-800">Medlemmar</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900"
        >
          <Plus size={16} />
          Ny medlem
        </button>
      </div>
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
          <ul>
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onSelect={() => setSelectedMember(member)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Profil-modal visas när en medlem klickats */}
      {selectedMember && (
        <MemberProfileModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onEdit={() => {
            setEditingMember(selectedMember)
            setSelectedMember(null)
          }}
          onDelete={() => {
            handleDeleteMember(selectedMember.id)
            setSelectedMember(null)
          }}
        />
      )}

      {/* Ny-medlem-modal visas när Ny-knappen klickats */}
      {addModalOpen && (
        <AddMemberModal
          onSave={handleAddMember}
          onClose={() => setAddModalOpen(false)}
        />
      )}

      {/* Redigera-modal visas när en medlem redigeras — förifylld med värdena */}
      {editingMember && (
        <AddMemberModal
          isEdit
          initialData={{
            name: editingMember.name,
            phone: editingMember.phone,
            email: editingMember.email,
            address: editingMember.address,
            familySize: editingMember.familySize,
            birthday: editingMember.birthday,
            category: editingMember.category,
            notes: editingMember.notes,
          }}
          onSave={handleUpdateMember}
          onClose={() => setEditingMember(null)}
        />
      )}
    </div>
  )
}