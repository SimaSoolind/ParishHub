// Chip — liten på/av-knapp för att välja ett alternativ (t.ex. typ eller synlighet)
// Aktiv chip fylls med kopparfärg; inaktiv har bara kant
//
// Används av: NotesPanel (fler vyer kan använda den senare)

import type { ReactNode } from "react"

interface Props {
  active: boolean
  onClick: () => void
  children: ReactNode
}

// Ritar en chip-knapp som är markerad när active är sann
// Tar emot active (markerad), onClick och children (texten)
// Returnerar knappen som JSX
export function Chip({ active, onClick, children }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={
        "px-3 py-1 rounded-full text-xs font-semibold border " +
        (active
          ? "bg-amber-800 text-white border-amber-800"
          : "bg-white text-stone-600 border-stone-200 hover:border-amber-800 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600")
      }
    >
      {children}
    </button>
  )
}
