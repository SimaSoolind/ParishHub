// MemberCard — visar en medlem som en klickbar rad i listan
// Klick öppnar profilen — eller bockar av medlemmen i grupputskick-läge
// Har snabbknappar för att ringa och mejla
//
// Används av: Members.tsx

import { memo } from "react"
import { Phone, Mail, Users, MapPin, CheckSquare, Square } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Avatar } from "./Avatar"
import type { Member } from "../domain/member"

interface Props {
  member: Member
  // Kallas med hela member — föräldern slipper skapa en ny closure per rad
  onSelect: (member: Member) => void
  // Grupputskick-läge — bocka av flera medlemmar
  selectionMode?: boolean
  selected?: boolean
  // Kallas med medlemmens id vid avbockning i grupputskick-läge
  onToggleSelect?: (id: string) => void
}

// Ritar en klickbar rad för en medlem
// Tar emot member, onSelect och (valfritt) grupputskick-läge
// Returnerar raden som JSX
function MemberCardBase({
  member,
  onSelect,
  selectionMode = false,
  selected = false,
  onToggleSelect,
}: Props) {
  const { t } = useTranslation()

  const phoneLink = "tel:" + member.phone
  const emailLink = "mailto:" + member.email

  // Klick öppnar profilen — men i grupputskick-läge bockar det av istället
  const handleActivate = () => {
    if (selectionMode) onToggleSelect?.(member.id)
    else onSelect(member)
  }

  // Öppnar/bockar med Enter eller mellanslag (tangentbords-stöd)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleActivate()
    }
  }

  return (
    <li
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="flex items-center justify-between py-4 border-b border-stone-200 dark:border-stone-700 cursor-pointer row-hover rounded-lg px-2 -mx-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
    >
      <div className="flex items-center gap-3">
        {/* Kryssruta visas bara i grupputskick-läge */}
        {selectionMode &&
          (selected ? (
            <CheckSquare size={20} className="text-accent flex-shrink-0" />
          ) : (
            <Square size={20} className="text-stone-400 dark:text-stone-500 flex-shrink-0" />
          ))}
        <Avatar name={member.name} photoUrl={member.photoUrl} />
        <div>
          <div className="font-semibold text-strong">{member.name}</div>
          <div className="flex items-center gap-3 text-sm text-faint mt-1">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {t("members.familyLabel", { size: member.familySize })}
            </span>
            <span>{t("members.birthdayLabel", { date: member.birthday })}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-faint mt-1">
            <MapPin size={12} />
            {member.address}
          </div>
        </div>
      </div>

      {/* Ring/Mejla göms i grupputskick-läge för att inte krocka med avbockning */}
      {!selectionMode && (
        <div className="flex items-center gap-2">
          {/* stopPropagation gör att klick på länkarna inte öppnar profilen */}
          <a
            onClick={(event) => event.stopPropagation()}
            href={phoneLink}
            className="p-2 rounded-full row-hover"
            aria-label={t("common.call", { name: member.name })}
          >
            <Phone size={18} className="text-accent" />
          </a>
          <a
            onClick={(event) => event.stopPropagation()}
            href={emailLink}
            className="p-2 rounded-full row-hover"
            aria-label={t("common.email", { name: member.name })}
          >
            <Mail size={18} className="text-blue-700 dark:text-blue-400" />
          </a>
        </div>
      )}
    </li>
  )
}

// Wrappar i memo — hoppar över rendering när props är oförändrade
// Används eftersom MemberCard renderas en gång per medlem i listan
export const MemberCard = memo(MemberCardBase)
