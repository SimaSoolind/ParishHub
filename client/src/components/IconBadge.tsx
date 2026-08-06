// IconBadge — en ikon i en mjuk, rund bakgrund i ljus koppar-nyans
// Bryts ut så sektionsrubriker i inställningarna ser lika ut (DRY)
//
// Används av: SettingsDrawer

import type { LucideIcon } from "lucide-react"

interface Props {
  icon: LucideIcon
}

// Ritar en cirkulär bricka med en ikon i mitten
// Tar emot icon (vilken lucide-ikon som visas)
// Returnerar brickan som JSX
export function IconBadge({ icon: Icon }: Props) {
  return (
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
      <Icon size={18} aria-hidden="true" />
    </span>
  )
}
