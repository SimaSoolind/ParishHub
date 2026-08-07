// AddMemberModal — formulär för att skapa eller ändra en medlem
// Namn + telefon ligger här; de valfria fälten finns i MemberMoreFields
// Skickar värdena till föräldern via onSave. initialData öppnar i redigeringsläge
//
// Används av: Members.tsx

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ModalCloseButton } from "./ModalCloseButton"
import { FocusTrap } from "focus-trap-react"
import type { NewMemberData } from "../domain/member"
import { newMemberSchema } from "../schemas/memberSchema"
import { collectFieldErrors } from "../use-cases/formErrors"
import { FormField } from "./FormField"
import { MemberMoreFields, type MemberFormValues } from "./MemberMoreFields"

interface Props {
  onSave: (member: NewMemberData) => void
  onClose: () => void
  initialData?: NewMemberData // Förifyllda värden vid redigering
  isEdit?: boolean // Sant vid redigering — styr rubrik och knapptext
}

// Ritar formuläret och håller fältens värden i ett values-objekt
// Tar emot onSave (spara), onClose (stäng) och eventuell initialData
// Returnerar modalen som JSX
export function AddMemberModal({ onSave, onClose, initialData, isEdit = false }: Props) {
  const { t } = useTranslation()

  // Alla fältvärden i ETT objekt — förifylls vid redigering, annars tomt
  const [values, setValues] = useState<MemberFormValues>({
    name: initialData?.name ?? "",
    phone: initialData?.phone ?? "",
    email: initialData?.email ?? "",
    address: initialData?.address ?? "",
    familySize: String(initialData?.familySize ?? "1"),
    birthday: initialData?.birthday ?? "",
    category: initialData?.category ?? "adult",
    notes: initialData?.notes ?? "",
    photoUrl: initialData?.photoUrl ?? "",
    preferredName: initialData?.preferredName ?? "",
    language: initialData?.language ?? "sv",
    status: initialData?.status ?? "active",
    familyRole: initialData?.familyRole ?? "",
  })

  // Felmeddelanden per fält och om de valfria fälten visas (direkt vid redigering)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showMoreFields, setShowMoreFields] = useState(isEdit)

  // Uppdaterar ett enskilt fält utan att röra de andra
  const setField = <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }))
  }

  // Escape stänger modalen — tangentbords-användare ska kunna stänga utan mus (WCAG)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  // Validerar med Zod och skickar vidare bara om allt är korrekt
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const result = newMemberSchema.safeParse({
      name: values.name,
      phone: values.phone,
      email: values.email,
      address: values.address,
      familySize: values.familySize,
      birthday: values.birthday,
      category: values.category,
      preferredName: values.preferredName.trim() || undefined,
      language: values.language,
      status: values.status,
      familyRole: values.familyRole || undefined,
      notes: values.notes || undefined,
      photoUrl: values.photoUrl.trim() || undefined,
    })

    if (!result.success) {
      const fieldErrors = collectFieldErrors(result.error)
      // Expanderar de valfria fälten om felet ligger på ett dolt fält (så felet syns)
      const optionalFields = ["email", "address", "familySize", "birthday", "photoUrl"]
      if (Object.keys(fieldErrors).some((field) => optionalFields.includes(field))) {
        setShowMoreFields(true)
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    onSave(result.data)
  }

  return (
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        {/* stopPropagation förhindrar att klick i panelen stänger modalen */}
        <div
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="modal-panel max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-bold text-strong">
              {isEdit ? t("form.editTitle") : t("form.addTitle")}
            </h2>
            <ModalCloseButton onClose={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <FormField
              className="mb-4"
              label={t("form.name")}
              value={values.name}
              onChange={(value) => setField("name", value)}
              error={errors["name"]}
              placeholder={t("form.phName")}
            />

            <FormField
              className="mb-4"
              label={t("form.phone")}
              value={values.phone}
              onChange={(value) => setField("phone", value)}
              error={errors["phone"]}
              type="tel"
              inputMode="tel"
              placeholder={t("form.phPhone")}
            />

            {/* Visa/dölj valfria fält — snabbt att lägga till med bara namn + telefon */}
            <button
              type="button"
              onClick={() => setShowMoreFields((current) => !current)}
              aria-expanded={showMoreFields}
              className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              {showMoreFields ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showMoreFields ? t("form.hideMore") : t("form.showMore")}
            </button>

            {showMoreFields && (
              <MemberMoreFields
                values={values}
                errors={errors}
                setField={setField}
                onPhotoChange={(dataUrl) => {
                  setField("photoUrl", dataUrl)
                  setErrors((prev) => ({ ...prev, photoUrl: "" }))
                }}
                onPhotoClear={() => setField("photoUrl", "")}
                onPhotoError={(message) => setErrors((prev) => ({ ...prev, photoUrl: message }))}
              />
            )}

            {/* Knappar */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 btn-secondary text-soft"
              >
                {t("form.cancel")}
              </button>
              <button type="submit" className="flex-1 px-4 py-2 btn-primary">
                {isEdit ? t("form.saveEdit") : t("form.save")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FocusTrap>
  )
}
