// SegmentedControl — segmenterad kontroll (iOS-liknande) för att välja ETT värde
// Den valda knappen får vit bakgrund och mjuk skugga som tydlig markering
// Återanvändbar: passar språk, kalendersystem eller andra korta val
//
// Används av: SettingsDrawer (språk och kalender)

// Ett val: värdet som sparas och etiketten som visas
export interface SegmentOption {
  value: string
  label: string
}

interface Props {
  options: SegmentOption[]
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}

// Ritar de segmenterade knapparna i en gemensam "spår"-bakgrund
// Tar options (valen), value (valt), onChange (byte) och ariaLabel
// Returnerar kontrollen som JSX
export function SegmentedControl({ options, value, onChange, ariaLabel }: Props) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="inline-flex gap-1 rounded-full bg-stone-100 p-1 dark:bg-stone-800"
    >
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className={
              "rounded-full px-4 py-1.5 text-sm font-semibold transition-all " +
              (isActive
                ? "bg-white text-amber-900 shadow dark:bg-stone-600 dark:text-white"
                : "text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200")
            }
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
