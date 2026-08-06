// Members — visar hela medlemsregistret
// Innehåller sök-fält och kategori-filter
//
// Används av: App.tsx (sidan för URL "/medlemmar")
// Bygger på: useMembers (data via repository), useMemberSearch (sök) och MemberCard
// Data: kommer från useMembers — sidan vet INTE om det är mock eller databas

import { useState, useCallback } from "react"
import { Search, Plus, Users } from "lucide-react"
import { useTranslation } from "react-i18next"
import { AddButton } from "../components/AddButton"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "@lib/errorHandler"
import { MemberCard } from "@components/MemberCard"
import { AddMemberModal } from "@components/AddMemberModal"
import { MemberProfileModal } from "@components/MemberProfileModal"
import { GroupMessageModal } from "@components/GroupMessageModal"
import { Skeleton } from "@components/Skeleton"
import { EmptyState } from "@components/EmptyState"
import { useMembers } from "@hooks/useMembers"
import { useMemberSearch } from "@hooks/useMemberSearch"
import type { FilterCategory } from "@hooks/useMemberSearch"
import type { Member, NewMemberData } from "@domain/member"
import { resolveFamilyId } from "@/use-cases/family"

// Filter-knapparnas värden — texten översätts via t("members.filter." + value)
const filterOptions: FilterCategory[] = ["all", "adult", "youth", "leader", "other"]

// Ritar medlemssidan: sökfält, filter-knappar och lista med MemberCard
// Sök- och filter-logik ligger i useMemberSearch — här bara visning
// Tar inga props och returnerar sidan som JSX
export function Members() {
  const { t } = useTranslation()

  // Medlemmar och CRUD-funktioner kommer från hooken (via repositoryt)
  const { members, loading, addMember, updateMember, removeMember } = useMembers()

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

  const { searchText, setSearchText, filter, setFilter, filteredMembers } = useMemberSearch(members)

  const total = filteredMembers.length

  // Körs när prästen sparar en ny medlem — repositoryt skapar id:t
  const handleAddMember = async (newMember: NewMemberData) => {
    try {
      await addMember(newMember)
      setAddModalOpen(false)
      toast.success(t("common.added"))
    } catch (error) {
      // Loggar internt och visar ett generellt fel — aldrig interna detaljer
      logError("Members.handleAddMember", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Körs när prästen sparar en ändring — uppdaterar medlemmen med samma id
  const handleUpdateMember = async (updated: NewMemberData) => {
    if (!editingMember) return
    try {
      await updateMember(editingMember.id, updated)
      setEditingMember(null)
      toast.success(t("common.updated"))
    } catch (error) {
      logError("Members.handleUpdateMember", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Tar bort medlemmen med angivet id
  const handleDeleteMember = async (id: string) => {
    try {
      await removeMember(id)
      toast.success(t("common.removed"))
    } catch (error) {
      logError("Members.handleDeleteMember", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Kopplar den valda medlemmen och en annan medlem till samma familj
  // Använder befintlig familyId om någon finns, annars skapas en ny kod
  const handleLinkFamily = (otherId: string) => {
    if (!selectedMember) return
    const other = members.find((m) => m.id === otherId)
    const familyId = resolveFamilyId(selectedMember.familyId, other?.familyId)

    // Sätter samma familyId på båda medlemmarna via repositoryt
    updateMember(selectedMember.id, { familyId })
    updateMember(otherId, { familyId })
    // Uppdaterar profilen så familjen syns direkt
    setSelectedMember({ ...selectedMember, familyId })
  }

  // Lossar den valda medlemmen ur sin familj (nollställer familyId)
  const handleUnlinkFamily = () => {
    if (!selectedMember) return
    updateMember(selectedMember.id, { familyId: undefined })
    setSelectedMember({ ...selectedMember, familyId: undefined })
  }

  // Slår på/av grupputskick-läge och nollställer valen
  const toggleSelectionMode = () => {
    setSelectionMode((prev) => !prev)
    setSelectedIds([])
  }

  // Öppnar medlemmens profil — stabil referens så memo:ade MemberCard slipper rendera om
  const handleSelectMember = useCallback((member: Member) => {
    setSelectedMember(member)
  }, [])

  // Bockar av eller på en medlem i grupputskicket
  // useCallback ger stabil referens till memo:ade MemberCard
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  return (
    <>
      <header>
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-serif font-bold text-strong">{t("members.title")}</h1>
          <div className="flex gap-2">
            <button
              onClick={toggleSelectionMode}
              className="px-4 py-2 rounded-full border border-stone-200 text-stone-600 text-sm font-semibold hover:border-amber-800 dark:border-stone-600 dark:text-stone-300 dark:hover:border-amber-500"
            >
              {selectionMode ? t("members.cancel") : t("members.groupSend")}
            </button>
            <AddButton label={t("members.add")} onClick={() => setAddModalOpen(true)} />
          </div>
        </div>
        <p className="text-soft mb-6">{t("members.total", { total })}</p>
      </header>

      <section aria-label={t("a11y.searchFilter")}>
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

        <div
          className="flex gap-2 flex-wrap mb-6"
          role="group"
          aria-label={t("a11y.filterCategory")}
        >
          {filterOptions.map((value) => {
            const isActive = filter === value
            const activeClasses = "bg-amber-800 text-white border-amber-800"
            const inactiveClasses =
              "bg-white text-stone-600 border-stone-200 hover:border-amber-800 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600"

            return (
              <button
                key={value}
                onClick={() => setFilter(value)}
                aria-pressed={isActive}
                className={
                  "px-4 py-2 rounded-full border text-sm font-semibold " +
                  (isActive ? activeClasses : inactiveClasses)
                }
              >
                {t("members.filter." + value)}
              </button>
            )
          })}
        </div>
      </section>

      {/* Urvalsrad i grupputskick-läge */}
      {selectionMode && (
        <div className="flex items-center justify-between mb-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 dark:bg-amber-950 dark:border-amber-900">
          <span className="text-sm text-soft">
            {t("members.selected", { n: selectedIds.length })}
          </span>
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
        {loading ? (
          <div className="space-y-3" aria-label={t("common.loading")}>
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : filteredMembers.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t("members.empty")}
            action={
              <button
                onClick={() => setAddModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={16} aria-hidden="true" />
                {t("members.add")}
              </button>
            }
          />
        ) : (
          <ul aria-label={t("a11y.memberList")}>
            {filteredMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onSelect={handleSelectMember}
                selectionMode={selectionMode}
                selected={selectedIds.includes(member.id)}
                onToggleSelect={handleToggleSelect}
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
        <AddMemberModal onSave={handleAddMember} onClose={() => setAddModalOpen(false)} />
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
    </>
  )
}
