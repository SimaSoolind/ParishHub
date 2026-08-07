// MemberProfileCard — profil-kortet på medlems-detaljsidan
// Rubrik, snabbkontakt, alla uppgifter, familj, WhatsApp och radera/redigera
// Data och handlers ligger kvar i MemberDetail; kortet är bara visning
//
// Används av: MemberDetail
// Bygger på: Card, Avatar, Badge, MemberFamilySection, MemberWhatsAppLinks, DeleteEditActions

import { useTranslation } from "react-i18next"
import { Phone, Mail } from "lucide-react"
import type { Member } from "../domain/member"
import { Card } from "./Card"
import { Avatar } from "./Avatar"
import { Badge } from "./Badge"
import { DeleteEditActions } from "./DeleteEditActions"
import { MemberFamilySection } from "./MemberFamilySection"
import { MemberWhatsAppLinks } from "./MemberWhatsAppLinks"

// En detaljrad: liten etikett ovanför värdet
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

interface Props {
  member: Member
  familyMembers: Member[]
  candidates: Member[]
  onOpenMember: (id: string) => void
  onLinkFamily: (otherId: string) => void
  onUnlinkFamily: () => void
  onCreateFamily: () => void
  onEdit: () => void
  onDelete: () => void
}

// Ritar profil-kortet
// Tar emot member, familjelistor och callbacks för familj/redigera/radera
// Returnerar kortet som JSX
export function MemberProfileCard({
  member,
  familyMembers,
  candidates,
  onOpenMember,
  onLinkFamily,
  onUnlinkFamily,
  onCreateFamily,
  onEdit,
  onDelete,
}: Props) {
  const { t } = useTranslation()

  return (
    <Card>
      {/* Rubrik: avatar, namn, ev. föredraget namn och status */}
      <div className="flex items-center gap-3 mb-5">
        <Avatar name={member.name} photoUrl={member.photoUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-serif font-bold text-strong">{member.name}</h1>
          {member.preferredName && <p className="text-sm text-faint">”{member.preferredName}”</p>}
        </div>
        <Badge color={member.status === "inactive" ? "red" : "green"}>
          {t("form.memberStatus." + (member.status ?? "active"))}
        </Badge>
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
      {member.language && (
        <DetailRow label={t("form.language")} value={t("form.lang." + member.language)} />
      )}
      {member.familyRole && (
        <DetailRow label={t("form.familyRole")} value={t("familyRole." + member.familyRole)} />
      )}
      {member.notes && <DetailRow label={t("profile.notes")} value={member.notes} />}

      {/* Familj */}
      <MemberFamilySection
        member={member}
        familyMembers={familyMembers}
        candidates={candidates}
        onOpenMember={onOpenMember}
        onLink={onLinkFamily}
        onUnlink={onUnlinkFamily}
        onCreateFamily={onCreateFamily}
      />

      {/* Snabbmeddelande via WhatsApp */}
      <MemberWhatsAppLinks phone={member.phone} name={member.name} />

      {/* Radera/Redigera-fot med inbyggd bekräftelse (delad komponent) */}
      <DeleteEditActions name={member.name} onDelete={onDelete} onEdit={onEdit} />
    </Card>
  )
}
