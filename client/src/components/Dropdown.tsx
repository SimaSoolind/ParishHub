// Dropdown — egen rullgardinsmeny som ersätter native <select>
// Byggd för att kunna stylas fritt (mörkt läge fungerar överallt)
// Tangentbord: Enter/Space öppnar, Escape stänger, klick utanför stänger
//
// Används av: AddEventModal, AddMemberModal (kategori-val)

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

// Ett val i listan — value sparas, label visas för användaren
interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  options: Option[]
  onChange: (value: string) => void
  // Läses upp av skärmläsare eftersom knappen saknar synlig etikett
  ariaLabel?: string
}

// Ritar en klickbar knapp med aktuellt val och en lista som fälls ut
// Tar emot value (valt), options (alla val), onChange och ariaLabel
// Returnerar dropdownen som JSX
export function Dropdown({ value, options, onChange, ariaLabel }: Props) {
  // Sant när listan är utfälld
  const [open, setOpen] = useState(false)

  // Referens till hela komponenten — används för att upptäcka klick utanför
  const containerRef = useRef<HTMLDivElement>(null)

  // Stänger listan när man klickar utanför komponenten
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Det valda alternativet — används för att visa rätt text på knappen
  const selected = options.find((option) => option.value === value)

  // Väljer ett alternativ och stänger listan
  const handleSelect = (newValue: string) => {
    onChange(newValue)
    setOpen(false)
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false)
      }}
    >
      {/* Knappen som visar aktuellt val och öppnar listan */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className="field flex items-center justify-between text-left"
      >
        <span>{selected?.label ?? ""}</span>
        <ChevronDown size={16} className="text-soft" />
      </button>

      {/* Listan visas bara när open är sant */}
      {open && (
        <ul
          role="listbox"
          className="surface border absolute z-10 mt-1 w-full rounded-xl shadow-lg overflow-hidden"
        >
          {options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                className={
                  "w-full text-left px-3 py-2 text-sm row-hover " +
                  (option.value === value ? "text-accent font-semibold" : "text-soft")
                }
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
