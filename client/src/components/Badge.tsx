// Badge visar en liten fargad etikett
// Anvands overallt i appen for att visa status
// Farg valjs via color-prop

import type { ReactNode } from "react"

interface Props {
  color: "red" | "blue" | "green" | "amber"
  children: ReactNode
}

// Farg-mappning kopplar namn till Tailwind-klasser
const colorClasses = {
  red: "bg-red-100 text-red-800 border-red-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  green: "bg-green-100 text-green-800 border-green-200",
  amber: "bg-amber-100 text-amber-800 border-amber-200",
}

export function Badge({ color, children }: Props) {
  const classes = colorClasses[color]

  return (
    <span className={"px-2 py-1 rounded-full text-xs font-semibold border " + classes}>
      {children}
    </span>
  )
}