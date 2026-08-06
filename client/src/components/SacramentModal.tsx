// SacramentModal — formulär för att registrera eller redigera ett sakrament
// Fälten anpassas efter typ:
// - Vittnen: dop, myrrasmörjelse, första nattvard, äktenskap
// - Grad + etiketten "Biskop": prästvigning
// - Kopplad medlem (make/maka): äktenskap
// - Bikt: bara datum/officiant/plats — aldrig innehåll (sekretess)
// Skickar värdena till föräldern via onSave; validerar med Zod
//
// Används av: SacramentPanel

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { FocusTrap } from "focus-trap-react"
import { ModalCloseButton } from "./ModalCloseButton"
import { Chip } from "./Chip"
import { Dropdown } from "./Dropdown"
import type { Member } from "../domain/member"
import type { Sacrament, NewSacramentData, SacramentType } from "../domain/sacrament"
import { newSacramentSchema } from "../schemas/sacramentSchema"
import { usesWitnesses, usesGrade, usesPartner, usesContent } from "../use-cases/sacraments"

// Alla typer i den ordning de visas som chips
const sacramentTypes: SacramentType[] = [
  "baptism",
  "chrismation",
  "firstCommunion",
  "confession",
  "marriage",
  "ordination",
  "unction",
  "funeral",
  "other",
]

interface Props {
  memberId: string // Vilken medlem sakramentet hör till
  members: Member[] // Alla medlemmar (för att välja make/maka vid äktenskap)
  sacrament: Sacrament | null // Finns vid redigering, null vid nytt sakrament
  onSave: (data: NewSacramentData) => void
  onClose: () => void
}

// Dagens datum i ISO-format (YYYY-MM-DD) — standardvärde för nya sakrament
const today = new Date().toISOString().split("T")[0]

// Ritar formuläret och håller fältens värden i state
// Tar emot memberId, members, sacrament (för redigering), onSave och onClose
// Returnerar modalen som JSX
export function SacramentModal({ memberId, members, sacrament, onSave, onClose }: Props) {
  const { t } = useTranslation()

  // Fält förifylls med sakramentets värden vid redigering, annars tomma
  const [type, setType] = useState<SacramentType>(sacrament?.type ?? "baptism")
  const [date, setDate] = useState(sacrament?.date ?? today)
  const [officiant, setOfficiant] = useState(sacrament?.officiant ?? "")
  const [place, setPlace] = useState(sacrament?.place ?? "")
  const [witnesses, setWitnesses] = useState(sacrament?.witnesses ?? "")
  const [grade, setGrade] = useState(sacrament?.grade ?? "")
  const [partnerId, setPartnerId] = useState(sacrament?.partnerId ?? "")
  const [certificateUrl, setCertificateUrl] = useState(sacrament?.certificateUrl ?? "")
  const [notes, setNotes] = useState(sacrament?.notes ?? "")

  // GDPR-samtycke — krävs bara vid NYTT sakrament (känslig religiös uppgift, art. 9)
  const [consent, setConsent] = useState(false)

  // Felmeddelanden per fält från valideringen
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Val för make/maka-väljaren: en tom rad + alla andra medlemmar
  const partnerOptions = [
    { value: "", label: t("sacramentForm.partnerNone") },
    ...members.filter((m) => m.id !== memberId).map((m) => ({ value: m.id, label: m.name })),
  ]

  // Stänger modalen när Escape trycks (tillgänglighet)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Validerar med Zod och skickar vidare bara om allt är korrekt
  // Fält som inte hör till typen sparas som undefined (t.ex. bikt får aldrig innehåll)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // GDPR: ett nytt sakrament kräver medlemmens samtycke (art. 9 — religiös uppgift)
    if (!sacrament && !consent) {
      setErrors({ consent: t("sacramentForm.consentRequired") })
      return
    }

    const result = newSacramentSchema.safeParse({
      memberId,
      type,
      date,
      officiant,
      place: place || undefined,
      witnesses: usesWitnesses(type) ? witnesses || undefined : undefined,
      grade: usesGrade(type) ? grade || undefined : undefined,
      partnerId: usesPartner(type) ? partnerId || undefined : undefined,
      certificateUrl: type !== "confession" ? certificateUrl || undefined : undefined,
      notes: usesContent(type) ? notes || undefined : undefined,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = String(issue.path[0])
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
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
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="modal-panel max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-bold text-strong">
              {sacrament ? t("sacramentForm.editTitle") : t("sacramentForm.newTitle")}
            </h2>
            <ModalCloseButton onClose={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Typ — chips för alla sakrament + övrigt */}
            <div className="mb-4">
              <label className="field-label">{t("sacramentForm.type")}</label>
              <div className="flex flex-wrap gap-2">
                {sacramentTypes.map((st) => (
                  <Chip key={st} active={type === st} onClick={() => setType(st)}>
                    {t("sacraments.type." + st)}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Datum + officiant (etiketten blir "Biskop" vid prästvigning) */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1">
                <label className="field-label">{t("form.date")}</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="field"
                />
                {errors["date"] && <p className="field-error">{errors["date"]}</p>}
              </div>
              <div className="flex-1">
                <label className="field-label">
                  {usesGrade(type) ? t("sacramentForm.bishop") : t("sacramentForm.officiant")}
                </label>
                <input
                  type="text"
                  value={officiant}
                  onChange={(e) => setOfficiant(e.target.value)}
                  maxLength={100}
                  className="field"
                />
                {errors["officiant"] && <p className="field-error">{errors["officiant"]}</p>}
              </div>
            </div>

            {/* Plats */}
            <div className="mb-4">
              <label className="field-label">{t("sacramentForm.place")}</label>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                maxLength={200}
                className="field"
              />
            </div>

            {/* Kopplad medlem (make/maka) — bara vid äktenskap */}
            {usesPartner(type) && (
              <div className="mb-4">
                <label className="field-label">{t("sacramentForm.partner")}</label>
                <Dropdown
                  value={partnerId}
                  options={partnerOptions}
                  onChange={setPartnerId}
                  ariaLabel={t("sacramentForm.partner")}
                />
              </div>
            )}

            {/* Vittnen — bara för typer som använder det */}
            {usesWitnesses(type) && (
              <div className="mb-4">
                <label className="field-label">{t("sacramentForm.witnesses")}</label>
                <input
                  type="text"
                  value={witnesses}
                  onChange={(e) => setWitnesses(e.target.value)}
                  maxLength={300}
                  className="field"
                />
              </div>
            )}

            {/* Grad — bara vid prästvigning */}
            {usesGrade(type) && (
              <div className="mb-4">
                <label className="field-label">{t("sacramentForm.grade")}</label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  maxLength={100}
                  placeholder={t("sacramentForm.gradePh")}
                  className="field"
                />
              </div>
            )}

            {/* Intyg (länk) — inte för bikt */}
            {type !== "confession" && (
              <div className="mb-4">
                <label className="field-label">{t("sacramentForm.certificate")}</label>
                <input
                  type="url"
                  value={certificateUrl}
                  onChange={(e) => setCertificateUrl(e.target.value)}
                  maxLength={500}
                  placeholder="https://..."
                  className="field"
                />
              </div>
            )}

            {/* Övrigt/anteckningar — men ALDRIG för bikt (sekretess) */}
            {usesContent(type) ? (
              <div className="mb-6">
                <label className="field-label">{t("sacramentForm.notes")}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  className="field"
                />
              </div>
            ) : (
              <p className="text-sm text-faint italic mb-6">{t("sacramentForm.confidential")}</p>
            )}

            {/* GDPR-samtycke — krävs för nytt sakrament (känslig religiös uppgift) */}
            {!sacrament && (
              <label className="flex items-start gap-2 mb-2 text-sm text-soft">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1"
                />
                <span>{t("sacramentForm.consent")}</span>
              </label>
            )}
            {errors["consent"] && <p className="field-error mb-4">{errors["consent"]}</p>}

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
