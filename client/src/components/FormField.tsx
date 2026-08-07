// FormField — återanvändbart textfält med etikett och felmeddelande
// Samlar det upprepade mönstret label + input + fel (DRY) som fanns i alla formulär
//
// Används av: AddMemberModal, MemberMoreFields (och kan återanvändas i fler formulär)

import type { ComponentProps } from "react"

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string | undefined
  type?: string
  placeholder?: string | undefined
  inputMode?: ComponentProps<"input">["inputMode"]
  min?: number
  maxLength?: number
  className?: string // Extra klasser på ytterdiven (t.ex. "mb-4" eller "flex-1")
}

// Ritar ett fält: etikett, input och (om det finns) ett felmeddelande
// Tar emot label, value, onChange samt valfria input-egenskaper och fel
// Returnerar fältet som JSX
export function FormField({
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  inputMode,
  min,
  maxLength,
  className = "",
}: Props) {
  return (
    <div className={className}>
      <label className="field-label">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        min={min}
        maxLength={maxLength}
        className="field"
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
