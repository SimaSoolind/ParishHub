// ToggleSwitch — på/av-reglage (strömbrytare) med valfria ikoner i knappen
// Återanvändbar: passar mörkt läge, notiser eller andra på/av-inställningar
//
// Används av: SettingsDrawer (mörkt läge med sol/måne)

import type { ReactNode } from "react"

interface Props {
  checked: boolean
  onChange: () => void
  ariaLabel: string
  iconOn?: ReactNode // Ikon som visas i påslaget läge (t.ex. måne)
  iconOff?: ReactNode // Ikon som visas i avslaget läge (t.ex. sol)
}

// Ritar en strömbrytare vars knopp glider och byter ikon
// Tar checked (på/av), onChange (klick), ariaLabel och valfria ikoner
// Returnerar reglaget som JSX
export function ToggleSwitch({ checked, onChange, ariaLabel, iconOn, iconOff }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={
        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors " +
        (checked ? "bg-amber-800" : "bg-stone-300 dark:bg-stone-600")
      }
    >
      {/* Knoppen glider åt slut-sidan när den slås på (spegelvänds i RTL) */}
      <span
        className={
          "inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-amber-800 shadow transition-transform " +
          (checked
            ? "ltr:translate-x-7 rtl:-translate-x-7"
            : "ltr:translate-x-1 rtl:-translate-x-1")
        }
      >
        {checked ? iconOn : iconOff}
      </span>
    </button>
  )
}
