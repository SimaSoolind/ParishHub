// EmptyState — visas när en lista eller vy är tom
// Ger tydligt besked (ikon + rubrik) och en valfri call-to-action-knapp
// Bättre än en tom skärm — visar användaren vad som kan göras härnäst
//
// Används av: Members, Services (fler vyer kan använda den senare)

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface Props {
  icon: LucideIcon
  title: string
  // Valfri förklarande text under rubriken
  description?: string
  // Valfritt handlings-block, t.ex. en knapp som skapar första posten
  action?: ReactNode
}

// Ritar en centrerad ikon, rubrik och valfritt beskrivning + knapp
// Tar emot icon, title och (valfritt) description och action
// Returnerar det tomma tillståndet som JSX
export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={48} className="text-faint mb-4" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-strong mb-1">{title}</h3>
      {description && <p className="text-sm text-soft mb-4">{description}</p>}
      {action}
    </div>
  )
}
