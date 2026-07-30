// MemberProfileModal — popup som visar all info om en medlem
// Öppnas när prästen klickar på en medlem i listan
// Har knappar för att redigera eller radera medlemmen
//
// Används av: Members.tsx

import { useEffect, useState } from "react"
import { X, Phone, Mail, Trash2, Pencil } from "lucide-react"
import type { Member, MemberCategory } from "../types/member"

interface Props {
  member: Member
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

// Kopplar kategori till svensk text
const categoryLabels: Record<MemberCategory, string> = {
  adult: "Vuxen",
  youth: "Ungdom",
  leader: "Ledare",
  other: "Övrig",
}

// Hjälp-komponent för en detaljrad (etikett ovanför värde)
// Tar emot label (rubrik) och value (texten som visas)
// Returnerar raden som JSX
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-3">
      <div className="text-xs font-semibold text-stone-400 uppercase">{label}</div>
      <div className="text-stone-800">{value}</div>
    </div>
  )
}

// Ritar profil-modalen med medlemmens uppgifter och åtgärds-knappar
// Tar emot member, onClose (stäng), onEdit (redigera) och onDelete (radera)
// Returnerar modalen som JSX
export function MemberProfileModal({ member, onClose, onEdit, onDelete }: Props) {
  // Sant när prästen klickat Radera och ska bekräfta borttagningen
  const [confirmingDelete, setConfirmingDelete] = useState(false)

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
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Rubrik-rad med stäng-knapp */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-800">{member.name}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100"
            aria-label="Stäng"
          >
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        {/* Snabbkontakt — ring och mejla */}
        <div className="flex gap-2 mb-5">
          <a
            href={"tel:" + member.phone}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-xl font-semibold text-amber-800 hover:bg-stone-50"
          >
            <Phone size={16} />
            Ring
          </a>
          <a
            href={"mailto:" + member.email}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 rounded-xl font-semibold text-blue-700 hover:bg-stone-50"
          >
            <Mail size={16} />
            Mejla
          </a>
        </div>

        {/* Alla uppgifter om medlemmen */}
        <DetailRow label="Telefon" value={member.phone} />
        <DetailRow label="E-post" value={member.email} />
        <DetailRow label="Adress" value={member.address} />
        <DetailRow label="Familjestorlek" value={String(member.familySize)} />
        <DetailRow label="Födelsedag" value={member.birthday} />
        <DetailRow label="Kategori" value={categoryLabels[member.category]} />
        {member.notes && <DetailRow label="Anteckningar" value={member.notes} />}

        {/* Bekräftelse innan radering — annars vanliga knappar */}
        {confirmingDelete ? (
          <div className="mt-5">
            <p className="text-sm text-stone-700 mb-3">
              Radera <span className="font-semibold">{member.name}</span>? Detta går inte att ångra.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmingDelete(false)}
                className="flex-1 px-4 py-2 border border-stone-200 rounded-xl font-semibold text-stone-600 hover:bg-stone-50"
              >
                Avbryt
              </button>
              <button
                onClick={onDelete}
                className="flex-1 px-4 py-2 bg-red-700 text-white rounded-xl font-semibold hover:bg-red-800"
              >
                Ja, radera
              </button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setConfirmingDelete(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 rounded-xl font-semibold text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Radera
            </button>
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-900"
            >
              <Pencil size={16} />
              Redigera
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
