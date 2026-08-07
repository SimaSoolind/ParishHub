// MemberFamilySection — familjedelen i medlemsprofilen
// Visar hushållet (FamilyTree) eller "skapa familj", kopplar en familjemedlem och
// lossar medlemmen ur familjen (med bekräftelse). Håller sitt EGET UI-tillstånd
// (väljare öppen, bekräfta lossning) så föräldern slipper de flaggorna
//
// Används av: MemberProfileCard

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Users, UserPlus } from "lucide-react"
import type { Member } from "../domain/member"
import { FamilyTree } from "./FamilyTree"

interface Props {
  member: Member
  familyMembers: Member[] // Andra i samma hushåll (utom personen själv)
  candidates: Member[] // Medlemmar som går att koppla till familjen
  onOpenMember: (id: string) => void
  onLink: (otherId: string) => void
  onUnlink: () => void
  onCreateFamily: () => void
}

// Ritar familjeblocket med träd/koppla/lossa
// Tar emot member, familyMembers, candidates och callbacks för öppna/koppla/lossa/skapa
// Returnerar blocket som JSX
export function MemberFamilySection({
  member,
  familyMembers,
  candidates,
  onOpenMember,
  onLink,
  onUnlink,
  onCreateFamily,
}: Props) {
  const { t } = useTranslation()

  // Lokalt UI-tillstånd — bara relevant här inne
  const [showPicker, setShowPicker] = useState(false)
  const [confirmingUnlink, setConfirmingUnlink] = useState(false)

  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-faint uppercase mb-2 flex items-center gap-1">
        <Users size={12} />
        {t("profile.family")}
      </div>

      {member.familyId ? (
        // Familjeträd — hushållet grupperat efter roll
        <FamilyTree self={member} members={familyMembers} onOpen={onOpenMember} />
      ) : (
        <div className="mb-2">
          <p className="text-sm text-faint mb-2">{t("profile.noFamily")}</p>
          {/* Skapa en ny familj från noll (medlemmen blir ett eget hushåll) */}
          <button
            onClick={onCreateFamily}
            className="flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
          >
            <Users size={14} />
            {t("profile.createFamily")}
          </button>
        </div>
      )}

      {/* Knapp eller väljare för att koppla en familjemedlem */}
      {!showPicker ? (
        <button
          onClick={() => setShowPicker(true)}
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
              {candidates.map((candidate) => (
                <li key={candidate.id} className="flex items-center justify-between py-1">
                  <span className="text-sm text-soft">{candidate.name}</span>
                  <button
                    onClick={() => {
                      onLink(candidate.id)
                      setShowPicker(false)
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

      {/* Lossa denna medlem ur familjen — med bekräftelse */}
      {member.familyId &&
        (confirmingUnlink ? (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-soft">{t("profile.confirmUnlink")}</span>
            <button
              onClick={() => setConfirmingUnlink(false)}
              className="px-2 py-0.5 rounded text-xs btn-secondary text-soft"
            >
              {t("form.cancel")}
            </button>
            <button
              onClick={() => {
                onUnlink()
                setConfirmingUnlink(false)
              }}
              className="px-2 py-0.5 rounded text-xs bg-red-700 text-white font-semibold hover:bg-red-800"
            >
              {t("profile.confirmDelete")}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmingUnlink(true)}
            className="block mt-2 text-xs text-red-600 hover:underline dark:text-red-400"
          >
            {t("profile.removeFromFamily")}
          </button>
        ))}
    </div>
  )
}
