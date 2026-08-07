// MemberDetail — detaljsida för EN medlem (URL "/medlemmar/:id")
// Sidan håller data och handlers; visningen ligger i MemberProfileCard
// Klick på en medlem i listan leder hit (ersätter den tidigare profil-modalen)
//
// Används av: App.tsx (route "medlemmar/:id")
// Bygger på: useMembers (data), MemberProfileCard, MemberHistoryChart, SacramentPanel

import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "../lib/errorHandler"
import { MemberProfileCard } from "../components/MemberProfileCard"
import { AddMemberModal } from "../components/AddMemberModal"
import { SacramentPanel } from "../components/SacramentPanel"
import { MemberHistoryChart } from "../components/MemberHistoryChart"
import { Skeleton } from "../components/Skeleton"
import { useMembers } from "../hooks/useMembers"
import { resolveFamilyId } from "../use-cases/family"
import type { NewMemberData } from "../domain/member"

// Ritar medlems-detaljsidan: tillbaka-länk, profil-kort, historik och sakrament
// Tar inga props (id kommer från URL:en via useParams)
// Returnerar sidan som JSX
export function MemberDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  // Medlemmar och CRUD-funktioner via hooken; rätt medlem plockas ut på id
  const { members, loading, updateMember, removeMember } = useMembers()
  const member = members.find((current) => current.id === id)

  // Sant när redigera-modalen är öppen
  const [editing, setEditing] = useState(false)

  // Andra medlemmar i samma familj (samma familyId) — utom personen själv
  const familyMembers = member?.familyId
    ? members.filter((other) => other.familyId === member.familyId && other.id !== member.id)
    : []

  // Medlemmar som går att koppla (inte personen själv, inte redan i familjen)
  const candidates = member
    ? members.filter(
        (other) =>
          other.id !== member.id && !(member.familyId && other.familyId === member.familyId)
      )
    : []

  // Kopplar medlemmen och en annan medlem till samma familj
  const handleLinkFamily = (otherId: string) => {
    if (!member) return
    const other = members.find((candidate) => candidate.id === otherId)
    const familyId = resolveFamilyId(member.familyId, other?.familyId)
    updateMember(member.id, { familyId })
    updateMember(otherId, { familyId })
  }

  // Lossar medlemmen ur sin familj (nollställer familyId)
  const handleUnlinkFamily = () => {
    if (!member) return
    updateMember(member.id, { familyId: undefined })
  }

  // Skapar en ny (tom) familj för medlemmen — får ett fräscht familyId
  const handleCreateFamily = () => {
    if (!member) return
    updateMember(member.id, { familyId: crypto.randomUUID() })
    toast.success(t("profile.familyCreated"))
  }

  // Sparar en ändring av medlemmen
  const handleUpdate = async (data: NewMemberData) => {
    if (!member) return
    try {
      await updateMember(member.id, data)
      setEditing(false)
      toast.success(t("common.updated"))
    } catch (error) {
      logError("MemberDetail.handleUpdate", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Tar bort medlemmen och går tillbaka till listan
  const handleDelete = async () => {
    if (!member) return
    try {
      await removeMember(member.id)
      toast.success(t("common.removed"))
      navigate("/medlemmar")
    } catch (error) {
      logError("MemberDetail.handleDelete", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  return (
    <>
      <Link
        to="/medlemmar"
        className="inline-flex items-center gap-1 text-sm text-accent hover:underline mb-4"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t("memberDetail.back")}
      </Link>

      {loading ? (
        <Skeleton className="h-24 w-full" />
      ) : !member ? (
        <p className="text-soft">{t("memberDetail.notFound")}</p>
      ) : (
        <>
          <MemberProfileCard
            member={member}
            familyMembers={familyMembers}
            candidates={candidates}
            onOpenMember={(memberId) => navigate("/medlemmar/" + memberId)}
            onLinkFamily={handleLinkFamily}
            onUnlinkFamily={handleUnlinkFamily}
            onCreateFamily={handleCreateFamily}
            onEdit={() => setEditing(true)}
            onDelete={handleDelete}
          />

          {/* Närvarohistorik — närvaro per gudstjänst + procent */}
          <MemberHistoryChart memberId={member.id} />

          {/* Sakrament — dop, myrrasmörjelse, äktenskap, prästvigning m.fl. */}
          <SacramentPanel memberId={member.id} members={members} />
        </>
      )}

      {/* Redigera-modal — förifylld med medlemmens värden */}
      {editing && member && (
        <AddMemberModal
          isEdit
          initialData={{
            name: member.name,
            phone: member.phone,
            email: member.email,
            address: member.address,
            familySize: member.familySize,
            birthday: member.birthday,
            category: member.category,
            preferredName: member.preferredName,
            language: member.language,
            status: member.status,
            familyRole: member.familyRole,
            notes: member.notes,
            photoUrl: member.photoUrl,
          }}
          onSave={handleUpdate}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}
