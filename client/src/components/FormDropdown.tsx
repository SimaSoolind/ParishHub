// FormDropdown — återanvändbar dropdown med etikett
// Samlar det upprepade mönstret label + Dropdown (DRY) som fanns i formulären
//
// Används av: MemberMoreFields (och kan återanvändas i fler formulär)

import { Dropdown } from "./Dropdown"

interface Option {
  value: string
  label: string
}

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  options: Option[]
  className?: string
}

// Ritar en etikett + Dropdown
// Tar emot label, value, onChange, options och valfria klasser
// Returnerar fältet som JSX
export function FormDropdown({ label, value, onChange, options, className = "" }: Props) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      <Dropdown value={value} onChange={onChange} ariaLabel={label} options={options} />
    </div>
  )
}
