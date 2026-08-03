// Badge visar en liten färgad etikett
// Används överallt i appen för att visa status
// Färg väljs via color-prop
//
// Används av: PriorityList.tsx (fler delar kan använda den senare)

import type { ReactNode } from "react"

interface Props {
  color: "red" | "blue" | "green" | "amber"
  children: ReactNode
}

// Färg-mappning kopplar namn till Tailwind-klasser
const colorClasses = {
  red: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  blue: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  green: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-900",
  amber: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
}

// Ritar en färgad etikett runt valfritt innehåll
// Tar emot color (färg) och children (innehållet som visas)
// Returnerar etiketten som JSX
export function Badge({ color, children }: Props) {
  const classes = colorClasses[color]

  return (
    <span className={"px-2 py-1 rounded-full text-xs font-semibold border " + classes}>
      {children}
    </span>
  )
}