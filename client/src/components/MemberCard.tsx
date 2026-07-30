// MemberCard — visar en medlem som en klickbar rad i listan
// Klick på raden öppnar medlemmens profil (utom Ring/Mejla-knapparna)
// Har snabbknappar för att ringa och mejla
//
// Används av: Members.tsx

import { Phone, Mail, Users, MapPin } from "lucide-react"
import type { Member } from "../types/member"

interface Props {
  member: Member
  onSelect: () => void
}

// Ritar en klickbar rad för en medlem med namn, familjestorlek, födelsedag och adress
// Tar emot member och onSelect (körs vid klick på raden)
// Returnerar raden som JSX
export function MemberCard({ member, onSelect }: Props) {
  const phoneLink = "tel:" + member.phone
  const emailLink = "mailto:" + member.email

  // Öppnar profilen med Enter eller mellanslag (tangentbords-stöd)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onSelect()
    }
  }

  return (
    <li
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="flex items-center justify-between py-4 border-b border-stone-200 cursor-pointer hover:bg-stone-50 rounded-lg px-2 -mx-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
    >
      <div>
        <div className="font-semibold text-stone-800">{member.name}</div>
        <div className="flex items-center gap-3 text-sm text-stone-500 mt-1">
          <span className="flex items-center gap-1">
            <Users size={14} />
            Familj: {member.familySize}
          </span>
          <span>Födelsedag: {member.birthday}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-stone-400 mt-1">
          <MapPin size={12} />
          {member.address}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* stopPropagation gör att klick på länkarna inte öppnar profilen */}
        <a
          onClick={(e) => e.stopPropagation()}
          href={phoneLink}
          className="p-2 rounded-full hover:bg-stone-100"
          aria-label={"Ring " + member.name}
        >
          <Phone size={18} className="text-amber-800" />
        </a>
        <a
          onClick={(e) => e.stopPropagation()}
          href={emailLink}
          className="p-2 rounded-full hover:bg-stone-100"
          aria-label={"Mejla " + member.name}
        >
          <Mail size={18} className="text-blue-700" />
        </a>
      </div>
    </li>
  )
}
