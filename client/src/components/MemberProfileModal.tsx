// MemberProfileModal — popup som visar all info om en medlem
// Öppnas när prästen klickar på en medlem i listan
// Har knappar för att redigera eller radera medlemmen
//
// Används av: Members.tsx

import { useEffect, useState } from "react"
import { X, Phone, Mail, Trash2, Pencil, Users, UserPlus, MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { FocusTrap } from "focus-trap-react"
import { Avatar } from "./Avatar"
import type { Member } from "../domain/member"
import { messageTemplateIds, fillTemplate } from "../data/messageTemplates"
import { buildWhatsAppLink } from "../lib/whatsapp"

interface Props {
  member: Member
  allMembers: Member[] // alla medlemmar (för att hitta familjen)
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  onOpenMember: (member: Member) => void // öppnar en annan medlems profil
  onLinkFamily: (otherMemberId: string) => void // kopplar en medlem till familjen
  onUnlinkFamily: () => void // lossar denna medlem ur familjen
}

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

// Ritar profil-modalen med medlemmens uppgifter och åtgärds-knappar
// Tar emot member, onClose (stäng), onEdit (redigera) och onDelete (radera)
// Returnerar modalen som JSX
export function MemberProfileModal({
  member,
  allMembers,
  onClose,
  onEdit,
  onDelete,
  onOpenMember,
  onLinkFamily,
  onUnlinkFamily,
}: Props) {
  const { t } = useTranslation()

  // Sant när prästen klickat Radera och ska bekräfta borttagningen
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Sant när listan för att koppla en familjemedlem visas
  const [showFamilyPicker, setShowFamilyPicker] = useState(false)

  // Andra medlemmar i samma familj (samma familyId) — utom personen själv
  const familyMembers = member.familyId
    ? allMembers.filter((m) => m.familyId === member.familyId && m.id !== member.id)
    : []

  // Medlemmar som går att koppla (inte personen själv, inte redan i familjen)
  const candidates = allMembers.filter(
    (m) => m.id !== member.id && !(member.familyId && m.familyId === member.familyId)
  )

  // Stänger modalen när Escape trycks (tillgänglighet)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  return (
    // Backdrop — klick utanför stänger modalen
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="modal-panel max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Rubrik-rad med stäng-knapp */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar name={member.name} photoUrl={member.photoUrl} size="lg" />
              <h2 id="modal-title" className="text-xl font-bold text-strong">
                {member.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full row-hover"
              aria-label={t("form.close")}
            >
              <X size={20} className="text-faint" />
            </button>
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
                    {/* Klick öppnar den familjemedlemmens profil */}
                    <button
                      onClick={() => onOpenMember(fm)}
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
                          onClick={() => {
                            onLinkFamily(c.id)
                            setShowFamilyPicker(false)
                          }}
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
                onClick={onUnlinkFamily}
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
              {messageTemplateIds.map((id) => (
                <a
                  key={id}
                  href={buildWhatsAppLink(
                    member.phone,
                    fillTemplate(t("templates." + id + ".text"), member.name)
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 border border-stone-200 rounded-xl text-sm font-semibold text-green-700 hover:bg-green-50 dark:border-stone-600 dark:text-green-400 dark:hover:bg-green-950"
                >
                  {t("templates." + id + ".label")}
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

          {/* Bekräftelse innan radering — annars vanliga knappar */}
          {confirmingDelete ? (
            <div className="mt-5">
              <p className="text-sm text-soft mb-3">
                {t("profile.deleteQ", { name: member.name })}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmingDelete(false)}
                  className="flex-1 px-4 py-2 btn-secondary text-soft"
                >
                  {t("form.cancel")}
                </button>
                <button
                  onClick={onDelete}
                  className="flex-1 px-4 py-2 bg-red-700 text-white rounded-xl font-semibold hover:bg-red-800"
                >
                  {t("profile.confirmDelete")}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setConfirmingDelete(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 rounded-xl font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                <Trash2 size={16} />
                {t("profile.delete")}
              </button>
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 btn-primary"
              >
                <Pencil size={16} />
                {t("profile.edit")}
              </button>
            </div>
          )}
        </div>
      </div>
    </FocusTrap>
  )
}
