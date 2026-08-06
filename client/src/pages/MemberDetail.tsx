// MemberDetail — detaljsida för EN medlem (URL "/medlemmar/:id")
// Visar all profilinfo (kontakt, uppgifter, familj, WhatsApp) samt sakrament
// Ersätter den tidigare profil-modalen — klick på en medlem leder hit
//
// Används av: App.tsx (route "medlemmar/:id")
// Bygger på: useMembers (data), SacramentPanel, AddMemberModal (redigera), DeleteEditActions

import { useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { ArrowLeft, Phone, Mail, Users, UserPlus, MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "../lib/errorHandler"
import { Avatar } from "../components/Avatar"
import { AddMemberModal } from "../components/AddMemberModal"
import { DeleteEditActions } from "../components/DeleteEditActions"
import { SacramentPanel } from "../components/SacramentPanel"
import { Skeleton } from "../components/Skeleton"
import { useMembers } from "../hooks/useMembers"
import { resolveFamilyId } from "../use-cases/family"
import type { NewMemberData } from "../domain/member"
import { messageTemplateIds, fillTemplate } from "../data/messageTemplates"
import { buildWhatsAppLink } from "../lib/whatsapp"

// Hjälp-komponent för en detaljrad (etikett ovanför värde)
// Tar emot label (rubrik) och value (texten som visas)
// Returnerar raden som JSX
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-semibold text-faint uppercase">{label}</div>
      <div className="text-strong">{value}</div>
    </div>
  )
}

// Ritar medlems-detaljsidan: tillbaka-länk, profil-kort, sakrament och redigera/radera
// Tar inga props (id kommer från URL:en via useParams)
// Returnerar sidan som JSX
export function MemberDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()

  // Medlemmar och CRUD-funktioner via hooken; rätt medlem plockas ut på id
  const { members, loading, updateMember, removeMember } = useMembers()
  const member = members.find((m) => m.id === id)

  // Sant när listan för att koppla en familjemedlem visas
  const [showFamilyPicker, setShowFamilyPicker] = useState(false)

  // Sant när redigera-modalen är öppen
  const [editing, setEditing] = useState(false)

  // Andra medlemmar i samma familj (samma familyId) — utom personen själv
  const familyMembers = member?.familyId
    ? members.filter((m) => m.familyId === member.familyId && m.id !== member.id)
    : []

  // Medlemmar som går att koppla (inte personen själv, inte redan i familjen)
  const candidates = member
    ? members.filter(
        (m) => m.id !== member.id && !(member.familyId && m.familyId === member.familyId)
      )
    : []

  // Kopplar medlemmen och en annan medlem till samma familj
  const handleLinkFamily = (otherId: string) => {
    if (!member) return
    const other = members.find((m) => m.id === otherId)
    const familyId = resolveFamilyId(member.familyId, other?.familyId)
    updateMember(member.id, { familyId })
    updateMember(otherId, { familyId })
    setShowFamilyPicker(false)
  }

  // Lossar medlemmen ur sin familj (nollställer familyId)
  const handleUnlinkFamily = () => {
    if (!member) return
    updateMember(member.id, { familyId: undefined })
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
          {/* Profil-kort */}
          <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
            <div className="flex items-center gap-3 mb-5">
              <Avatar name={member.name} photoUrl={member.photoUrl} size="lg" />
              <h1 className="text-2xl font-serif font-bold text-strong">{member.name}</h1>
            </div>

            {/* Snabbkontakt — ring och mejla */}
            <div className="flex gap-2 mb-5">
              <a
                href={"tel:" + member.phone}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 btn-secondary text-accent"
              >
                <Phone size={16} />
                {t("profile.call")}
              </a>
              <a
                href={"mailto:" + member.email}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 btn-secondary text-blue-700 dark:text-blue-400"
              >
                <Mail size={16} />
                {t("profile.email")}
              </a>
            </div>

            {/* Alla uppgifter om medlemmen */}
            <DetailRow label={t("form.phone")} value={member.phone} />
            <DetailRow label={t("form.email")} value={member.email} />
            <DetailRow label={t("form.address")} value={member.address} />
            <DetailRow label={t("form.familySize")} value={String(member.familySize)} />
            <DetailRow label={t("form.birthday")} value={member.birthday} />
            <DetailRow label={t("form.category")} value={t("members.filter." + member.category)} />
            {member.notes && <DetailRow label={t("profile.notes")} value={member.notes} />}

            {/* Familj — andra medlemmar med samma familyId */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-faint uppercase mb-2 flex items-center gap-1">
                <Users size={12} />
                {t("profile.family")}
              </div>

              {familyMembers.length > 0 ? (
                <ul className="mb-2">
                  {familyMembers.map((fm) => (
                    <li key={fm.id} className="flex items-center justify-between py-1">
                      {/* Klick öppnar den familjemedlemmens detaljsida */}
                      <button
                        onClick={() => navigate("/medlemmar/" + fm.id)}
                        className="text-sm text-accent hover:underline"
                      >
                        {fm.name}
                      </button>
                      {/* WhatsApp direkt till familjemedlemmen */}
                      <a
                        href={buildWhatsAppLink(fm.phone, "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-full row-hover"
                        aria-label={t("profile.whatsappTo", { name: fm.name })}
                      >
                        <MessageCircle size={16} className="text-green-600 dark:text-green-400" />
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-faint mb-2">{t("profile.noFamily")}</p>
              )}

              {/* Knapp eller väljare för att koppla en familjemedlem */}
              {!showFamilyPicker ? (
                <button
                  onClick={() => setShowFamilyPicker(true)}
                  className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                >
                  <UserPlus size={14} />
                  {t("profile.linkFamily")}
                </button>
              ) : (
                <div className="border border-stone-200 rounded-xl p-2 max-h-40 overflow-y-auto dark:border-stone-600">
                  {candidates.length === 0 ? (
                    <p className="text-sm text-faint">{t("profile.noCandidates")}</p>
                  ) : (
                    <ul>
                      {candidates.map((c) => (
                        <li key={c.id} className="flex items-center justify-between py-1">
                          <span className="text-sm text-soft">{c.name}</span>
                          <button
                            onClick={() => handleLinkFamily(c.id)}
                            className="text-xs font-semibold text-accent hover:underline"
                          >
                            {t("profile.add")}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Lossa denna medlem ur familjen */}
              {member.familyId && (
                <button
                  onClick={handleUnlinkFamily}
                  className="block mt-2 text-xs text-red-600 hover:underline dark:text-red-400"
                >
                  {t("profile.removeFromFamily")}
                </button>
              )}
            </div>

            {/* Snabbmeddelande via WhatsApp */}
            <div className="mb-4">
              <div className="text-xs font-semibold text-faint uppercase mb-2 flex items-center gap-1">
                <MessageCircle size={12} />
                {t("profile.whatsappTitle")}
              </div>
              <div className="flex flex-col gap-2">
                {messageTemplateIds.map((templateId) => (
                  <a
                    key={templateId}
                    href={buildWhatsAppLink(
                      member.phone,
                      fillTemplate(t("templates." + templateId + ".text"), member.name)
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 border border-stone-200 rounded-xl text-sm font-semibold text-green-700 hover:bg-green-50 dark:border-stone-600 dark:text-green-400 dark:hover:bg-green-950"
                  >
                    {t("templates." + templateId + ".label")}
                  </a>
                ))}
                {/* Tomt meddelande — prästen skriver själv i WhatsApp */}
                <a
                  href={buildWhatsAppLink(member.phone, "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 btn-secondary text-soft text-sm"
                >
                  {t("profile.emptyMessage")}
                </a>
              </div>
            </div>

            {/* Radera/Redigera-fot med inbyggd bekräftelse (delad komponent) */}
            <DeleteEditActions
              name={member.name}
              onDelete={handleDelete}
              onEdit={() => setEditing(true)}
            />
          </div>

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
