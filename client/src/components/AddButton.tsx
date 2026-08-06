// AddButton — rund primär-knapp för att lägga till något (plus-ikon + text)
// Samlar den upprepade "Ny X"-knappen som finns i flera sid-rubriker
//
// Används av: Members, Services, Calendar

import { Plus } from "lucide-react"

interface Props {
  label: string
  onClick: () => void
}

// Ritar en pill-formad primär-knapp med plus-ikon och text
// Tar emot label (texten) och onClick (vad som händer vid klick)
// Returnerar knappen som JSX
export function AddButton({ label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900"
    >
      <Plus size={16} aria-hidden="true" />
      {label}
    </button>
  )
}
