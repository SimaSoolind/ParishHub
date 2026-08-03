// Members — visar hela medlemsregistret
// Innehåller sök-fält och kategori-filter
//
// Används av: App.tsx (sidan för URL "/medlemmar")
// Bygger på: useMemberSearch (logik) och MemberCard (visning)
// Data: startar från mockMembers, ligger sedan i state så nya kan läggas till

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { MemberCard } from "../components/MemberCard"
import { AddMemberModal } from "../components/AddMemberModal"
import { MemberProfileModal } from "../components/MemberProfileModal"
import { GroupMessageModal } from "../components/GroupMessageModal"
import { useMemberSearch } from "../hooks/useMemberSearch"
import type { FilterCategory } from "../hooks/useMemberSearch"
import type { Member, NewMemberData } from "../types/member"
import { mockMembers } from "../data/members.mock"

// Filter-knapparnas värden — texten översätts via t("members.filter." + value)
const filterOptions: FilterCategory[] = ["all", "adult", "youth", "leader", "other"]

// Ritar medlemssidan: sökfält, filter-knappar och lista med MemberCard
// Sök- och filter-logik ligger i useMemberSearch — här bara visning
// Tar inga props och returnerar sidan som JSX
export function Members() {
  const { t } = useTranslation()

  // Hela medlemslistan — ligger i state så nya kan läggas till
  const [members, setMembers] = useState<Member[]>(mockMembers)

  // Styr om Ny-medlem-modalen är öppen
  const [addModalOpen, setAddModalOpen] = useState(false)

  // Håller medlemmen som redigeras — null när ingen redigeras
  const [editingMember, setEditingMember] = useState<Member | null>(null)

  // Håller medlemmen vars profil visas — null när ingen är vald
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // Grupputskick: läge på/av, valda medlemmars id och om utskicks-modalen är öppen
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [groupModalOpen, setGroupModalOpen] = useState(false)

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

  // Kopplar den valda medlemmen och en annan medlem till samma familj
  // Använder befintlig familyId om någon finns, annars skapas en ny kod
  const handleLinkFamily = (otherId: string) => {
    if (!selectedMember) return
    const other = members.find((m) => m.id === otherId)
    const familyId = selectedMember.familyId ?? other?.familyId ?? crypto.randomUUID()

    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id || m.id === otherId ? { ...m, familyId } : m
      )
    )
    // Uppdaterar profilen så familjen syns direkt
    setSelectedMember({ ...selectedMember, familyId })
  }

  // Lossar den valda medlemmen ur sin familj (nollställer familyId)
  const handleUnlinkFamily = () => {
    if (!selectedMember) return
    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id ? { ...m, familyId: undefined } : m
      )
    )
    setSelectedMember({ ...selectedMember, familyId: undefined })
  }

  // Slår på/av grupputskick-läge och nollställer valen
  const toggleSelectionMode = () => {
    setSelectionMode((prev) => !prev)
    setSelectedIds([])
  }

  // Bockar av eller på en medlem i grupputskicket
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-strong">{t("members.title")}</h1>
        <div className="flex gap-2">
          <button
            onClick={toggleSelectionMode}
            className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 text-sm font-semibold hover:border-amber-800 dark:border-stone-600 dark:text-stone-300 dark:hover:border-amber-500"
          >
            {selectionMode ? t("members.cancel") : t("members.groupSend")}
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900"
          >
            <Plus size={16} />
            {t("members.add")}
          </button>
        </div>
      </div>
      <p className="text-soft mb-6">{t("members.total", { total })}</p>

      <div className="relative mb-4">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500"
        />
        <input
          type="text"
          placeholder={t("members.search")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="field pl-10 pr-4"
        />
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {filterOptions.map((value) => {
          const isActive = filter === value
          const activeClasses = "bg-amber-800 text-white border-amber-800"
          const inactiveClasses = "bg-white text-stone-600 border-stone-200 hover:border-amber-800 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600"

          return (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={"px-4 py-2 rounded-full border text-sm font-semibold " + (isActive ? activeClasses : inactiveClasses)}
            >
              {t("members.filter." + value)}
            </button>
          )
        })}
      </div>

      {/* Urvalsrad i grupputskick-läge */}
      {selectionMode && (
        <div className="flex items-center justify-between mb-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 dark:bg-amber-950 dark:border-amber-900">
          <span className="text-sm text-soft">{t("members.selected", { n: selectedIds.length })}</span>
          <button
            onClick={() => setGroupModalOpen(true)}
            disabled={selectedIds.length === 0}
            className="px-4 py-1.5 rounded-full bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900 disabled:opacity-50"
          >
            {t("members.sendToSelected")}
          </button>
        </div>
      )}

      <div className="surface border p-6 rounded-2xl shadow-sm">
        {filteredMembers.length === 0 ? (
          <p className="text-sm text-faint italic text-center py-4">
            {t("members.empty")}
          </p>
        ) : (
          <ul>
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onSelect={() => setSelectedMember(member)}
                selectionMode={selectionMode}
                selected={selectedIds.includes(member.id)}
                onToggleSelect={() => handleToggleSelect(member.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Profil-modal visas när en medlem klickats */}
      {/* key gör att modalen nollställs när man byter till en annan medlem */}
      {selectedMember && (
        <MemberProfileModal
          key={selectedMember.id}
          member={selectedMember}
          allMembers={members}
          onClose={() => setSelectedMember(null)}
          onEdit={() => {
            setEditingMember(selectedMember)
            setSelectedMember(null)
          }}
          onDelete={() => {
            handleDeleteMember(selectedMember.id)
            setSelectedMember(null)
          }}
          onOpenMember={(m) => setSelectedMember(m)}
          onLinkFamily={handleLinkFamily}
          onUnlinkFamily={handleUnlinkFamily}
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
            photoUrl: editingMember.photoUrl,
          }}
          onSave={handleUpdateMember}
          onClose={() => setEditingMember(null)}
        />
      )}

      {/* Grupputskick-modal — WhatsApp till varje vald medlem */}
      {groupModalOpen && (
        <GroupMessageModal
          members={members.filter((m) => selectedIds.includes(m.id))}
          onClose={() => setGroupModalOpen(false)}
        />
      )}
    </div>
  )
}