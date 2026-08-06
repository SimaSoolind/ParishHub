// FamilyTree — visar hela hushållet grupperat efter familjeroll
// Den valda medlemmen markeras; övriga är klickbara till sin detaljsida
// Modellen är en roll per medlem i hushållet (inte parvisa relationer)
//
// Används av: MemberDetail
// Bygger på: Avatar, buildWhatsAppLink och familyRole-översättningar

import { MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Avatar } from "./Avatar"
import { buildWhatsAppLink } from "../lib/whatsapp"
import type { Member, FamilyRole } from "../domain/member"

// Ordningen rollerna visas i (förälder överst, sedan make/maka, barn, syskon, övriga)
const roleOrder: (FamilyRole | "none")[] = ["parent", "spouse", "child", "sibling", "none"]

interface Props {
  self: Member // Medlemmen som visas (markeras i trädet)
  members: Member[] // Övriga i hushållet (samma familyId)
  onOpen: (id: string) => void // Öppnar en familjemedlems detaljsida
}

// Ritar hushållet grupperat på roll
// Tar emot self (den valda), members (övriga i familjen) och onOpen
// Returnerar trädet som JSX
export function FamilyTree({ self, members, onOpen }: Props) {
  const { t } = useTranslation()

  // Hela hushållet = den valda + övriga, grupperat på roll (tomma grupper döljs)
  const household = [self, ...members]
  const groups = roleOrder
    .map((role) => ({
      role,
      people: household.filter((m) => (m.familyRole ?? "none") === role),
    }))
    .filter((group) => group.people.length > 0)

  return (
    <div className="rounded-xl border border-stone-200 dark:border-stone-700 p-3 mb-2">
      {groups.map((group) => (
        <div key={group.role} className="mb-3 last:mb-0">
          <div className="text-xs font-semibold text-faint uppercase mb-1">
            {group.role === "none" ? t("profile.noRole") : t("familyRole." + group.role)}
          </div>
          <ul className="space-y-1">
            {group.people.map((m) => {
              const isSelf = m.id === self.id
              return (
                <li key={m.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={m.name} photoUrl={m.photoUrl} />
                    {isSelf ? (
                      <span className="text-sm font-semibold text-strong truncate">
                        {m.name}{" "}
                        <span className="text-xs font-normal text-faint">
                          ({t("profile.thisMember")})
                        </span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onOpen(m.id)}
                        className="text-sm text-accent hover:underline truncate"
                      >
                        {m.name}
                      </button>
                    )}
                  </div>
                  {!isSelf && (
                    <a
                      href={buildWhatsAppLink(m.phone, "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-full row-hover flex-shrink-0"
                      aria-label={t("profile.whatsappTo", { name: m.name })}
                    >
                      <MessageCircle size={16} className="text-green-600 dark:text-green-400" />
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
