// ReminderModal — formulär för att skapa en manuell påminnelse
// Prästen väljer typ (påminnelse/sorg/åtagande), vem, orsak och valfritt datum/kontakt
// Skickar värdena till föräldern via onSave; validerar med Zod
//
// Används av: ReminderCard

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { FocusTrap } from "focus-trap-react"
import { ModalCloseButton } from "./ModalCloseButton"
import { Chip } from "./Chip"
import { FormField } from "./FormField"
import type { NewReminderData, ReminderKind } from "../domain/reminder"
import { newReminderSchema } from "../schemas/reminderSchema"
import { collectFieldErrors } from "../use-cases/formErrors"

// De tre typerna av påminnelse i den ordning de visas som chips
const reminderKinds: ReminderKind[] = ["manual", "grief", "commitment"]

interface Props {
  onSave: (data: NewReminderData) => void
  onClose: () => void
}

// Ritar formuläret och håller fältens värden i state
// Tar emot onSave (spara) och onClose (stäng)
// Returnerar modalen som JSX
export function ReminderModal({ onSave, onClose }: Props) {
  const { t } = useTranslation()

  const [name, setName] = useState("")
  const [reason, setReason] = useState("")
  const [kind, setKind] = useState<ReminderKind>("manual")
  const [dueDate, setDueDate] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  // Felmeddelanden per fält från valideringen
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Stänger modalen när Escape trycks (tillgänglighet)
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Validerar med Zod och skickar vidare bara om allt är korrekt
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const result = newReminderSchema.safeParse({
      name,
      reason,
      kind,
      dueDate: dueDate || undefined,
      phone: phone || undefined,
      email: email || undefined,
    })

    if (!result.success) {
      setErrors(collectFieldErrors(result.error))
      return
    }

    setErrors({})
    onSave(result.data)
  }

  return (
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        <div
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="modal-panel max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-bold text-strong">
              {t("reminderForm.newTitle")}
            </h2>
            <ModalCloseButton onClose={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Typ — påminnelse, sorg eller åtagande */}
            <div className="mb-4">
              <label className="field-label">{t("reminderForm.kind")}</label>
              <div className="flex flex-wrap gap-2">
                {reminderKinds.map((kindOption) => (
                  <Chip
                    key={kindOption}
                    active={kind === kindOption}
                    onClick={() => setKind(kindOption)}
                  >
                    {t("reminders.kind." + kindOption)}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Vem */}
            <FormField
              className="mb-4"
              label={t("reminderForm.name")}
              value={name}
              onChange={setName}
              error={errors["name"]}
              maxLength={100}
              placeholder={t("reminderForm.namePh")}
            />

            {/* Orsak */}
            <div className="mb-4">
              <label className="field-label">{t("reminderForm.reason")}</label>
              <textarea
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={300}
                rows={2}
                placeholder={t("reminderForm.reasonPh")}
                className="field"
              />
              {errors["reason"] && <p className="field-error">{errors["reason"]}</p>}
            </div>

            {/* Datum (valfritt) */}
            <FormField
              className="mb-4"
              label={t("reminderForm.dueDate")}
              value={dueDate}
              onChange={setDueDate}
              type="date"
            />

            {/* Telefon + e-post (valfria — för snabbkontakt) */}
            <div className="flex gap-3 mb-6">
              <FormField
                className="flex-1"
                label={t("reminderForm.phone")}
                value={phone}
                onChange={setPhone}
                type="tel"
                inputMode="tel"
                maxLength={30}
              />
              <FormField
                className="flex-1"
                label={t("reminderForm.email")}
                value={email}
                onChange={setEmail}
                type="email"
                inputMode="email"
                maxLength={200}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 btn-secondary text-soft"
              >
                {t("form.cancel")}
              </button>
              <button type="submit" className="flex-1 px-4 py-2 btn-primary">
                {t("form.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FocusTrap>
  )
}
