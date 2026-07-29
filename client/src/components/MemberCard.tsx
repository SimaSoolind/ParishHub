// MemberCard — visar en medlem i listan
// Har Ring- och Mejla-knappar för snabbkontakt
//
// Används av: Members.tsx

import { Phone, Mail, Users } from "lucide-react"
import type { Member } from "../types/member"

interface Props {
  member: Member
}

// Ritar en rad för en medlem med namn, familjestorlek och kontakt-knappar
// Tar emot ett Member-objekt som prop
// Returnerar raden som JSX
export function MemberCard({ member }: Props) {
  const phoneLink = "tel:" + member.phone
  const emailLink = "mailto:" + member.email

  return (
    <div className="flex items-center justify-between py-4 border-b border-stone-200">
      <div>
        <div className="font-semibold text-stone-800">{member.name}</div>
        <div className="flex items-center gap-3 text-sm text-stone-500 mt-1">
          <span className="flex items-center gap-1">
            <Users size={14} />
            Familj: {member.familySize}
          </span>
          <span>Födelsedag: {member.birthday}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a
          href={phoneLink}
          className="p-2 rounded-full hover:bg-stone-100"
          aria-label={"Ring " + member.name}
        >
          <Phone size={18} className="text-amber-800" />
        </a>
        <a
          href={emailLink}
          className="p-2 rounded-full hover:bg-stone-100"
          aria-label={"Mejla " + member.name}
        >
          <Mail size={18} className="text-blue-700" />
        </a>
      </div>
    </div>
  )
}