// AddMemberModal — formulär för att skapa eller ändra en medlem
// Prästen fyller i namn, kontaktuppgifter, kategori och anteckningar
// Skickar värdena till föräldern via onSave-prop
// Om initialData skickas in öppnas formuläret förifyllt (redigeringsläge)
//
// Används av: Members.tsx

import { useState, useEffect, useRef } from "react"
import { Upload, Camera, ChevronDown, ChevronUp } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ModalCloseButton } from "./ModalCloseButton"
import { FocusTrap } from "focus-trap-react"
import type { MemberCategory, NewMemberData } from "../domain/member"
import { newMemberSchema } from "../schemas/memberSchema"
import { Dropdown } from "./Dropdown"
import { Avatar } from "./Avatar"

interface Props {
  onSave: (member: NewMemberData) => void
  onClose: () => void
  // Förifyllda värden vid redigering
  initialData?: NewMemberData
  // Sant vid redigering — styr rubrik och knapptext
  isEdit?: boolean
}

// Värden i kategori-dropdown — texten översätts via members.filter.<value>
const categoryOptions: MemberCategory[] = ["adult", "youth", "leader", "other"]

// Ritar formuläret och håller fältens värden i state
// Tar emot onSave (spara), onClose (stäng) och eventuell initialData
// Returnerar modalen som JSX
export function AddMemberModal({ onSave, onClose, initialData, isEdit = false }: Props) {
  const { t } = useTranslation()

  // State för varje fält — förifylls vid redigering, annars tomt
  // familySize hålls som text eftersom input-fält alltid ger text
  const [name, setName] = useState(initialData?.name ?? "")
  const [phone, setPhone] = useState(initialData?.phone ?? "")
  const [email, setEmail] = useState(initialData?.email ?? "")
  const [address, setAddress] = useState(initialData?.address ?? "")
  const [familySize, setFamilySize] = useState(String(initialData?.familySize ?? "1"))
  const [birthday, setBirthday] = useState(initialData?.birthday ?? "")
  const [category, setCategory] = useState<MemberCategory>(initialData?.category ?? "adult")
  const [notes, setNotes] = useState(initialData?.notes ?? "")
  const [photoUrl, setPhotoUrl] = useState(initialData?.photoUrl ?? "")

  // Håller felmeddelanden per fält från valideringen
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Sant när de valfria fälten visas — vid redigering visas de direkt
  const [showMoreFields, setShowMoreFields] = useState(isEdit)

  // Referens till det dolda fil-fältet (öppnas via Välj bild-knappen)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Referens till det dolda kamera-fältet (öppnas via Ta foto-knappen)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  // Stänger modalen när Escape trycks (tillgänglighet)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  // Körs när formuläret skickas
  // Validerar med Zod och skickar vidare bara om allt är korrekt
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const result = newMemberSchema.safeParse({
      name,
      phone,
      email,
      address,
      familySize,
      birthday,
      category,
      notes: notes || undefined,
      photoUrl: photoUrl.trim() || undefined,
    })

    // Om valideringen misslyckas — samla felmeddelanden per fält och avbryt
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = String(issue.path[0])
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      // Expanderar de valfria fälten om felet ligger på ett dolt fält (så felet syns)
      const optionalFields = [
        "email",
        "address",
        "familySize",
        "birthday",
        "category",
        "photoUrl",
        "notes",
      ]
      if (Object.keys(fieldErrors).some((f) => optionalFields.includes(f))) {
        setShowMoreFields(true)
      }
      setErrors(fieldErrors)
      return
    }

    // Skickar den validerade medlemmen till föräldern
    setErrors({})
    onSave(result.data)
  }

  // Läser en vald bildfil och sparar den som data-URL (base64) i state
  // Begränsar storleken eftersom bilden hålls i minnet tills backend finns
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxBytes = 1024 * 1024 // 1 MB
    if (file.size > maxBytes) {
      setErrors((prev) => ({ ...prev, photoUrl: t("form.photoTooLarge") }))
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoUrl(reader.result)
        setErrors((prev) => ({ ...prev, photoUrl: "" }))
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    // Backdrop — klick utanför stänger modalen
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
        <div
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="modal-panel max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Rubrik-rad med stäng-knapp */}
          <div className="flex items-start justify-between mb-4">
            <h2 id="modal-title" className="text-xl font-bold text-strong">
              {isEdit ? t("form.editTitle") : t("form.addTitle")}
            </h2>
            <ModalCloseButton onClose={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            {/* Namn-fält */}
            <div className="mb-4">
              <label className="field-label">{t("form.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("form.phName")}
                className="field"
              />
              {errors["name"] && <p className="field-error">{errors["name"]}</p>}
            </div>

            {/* Telefon-fält */}
            <div className="mb-4">
              <label className="field-label">{t("form.phone")}</label>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("form.phPhone")}
                className="field"
              />
              {errors["phone"] && <p className="field-error">{errors["phone"]}</p>}
            </div>

            {/* Visa/dölj valfria fält — gör det snabbt att lägga till med bara namn + telefon */}
            <button
              type="button"
              onClick={() => setShowMoreFields((v) => !v)}
              aria-expanded={showMoreFields}
              className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              {showMoreFields ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showMoreFields ? t("form.hideMore") : t("form.showMore")}
            </button>

            {showMoreFields && (
              <>
                {/* E-post-fält */}
                <div className="mb-4">
                  <label className="field-label">{t("form.email")}</label>
                  <input
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("form.phEmail")}
                    className="field"
                  />
                  {errors["email"] && <p className="field-error">{errors["email"]}</p>}
                </div>

                {/* Adress-fält */}
                <div className="mb-4">
                  <label className="field-label">{t("form.address")}</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={t("form.phAddress")}
                    className="field"
                  />
                  {errors["address"] && <p className="field-error">{errors["address"]}</p>}
                </div>

                {/* Familjestorlek och födelsedag bredvid varandra */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1">
                    <label className="field-label">{t("form.familySize")}</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      value={familySize}
                      onChange={(e) => setFamilySize(e.target.value)}
                      className="field"
                    />
                    {errors["familySize"] && <p className="field-error">{errors["familySize"]}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="field-label">{t("form.birthday")}</label>
                    <input
                      type="text"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      placeholder={t("form.phBirthday")}
                      className="field"
                    />
                    {errors["birthday"] && <p className="field-error">{errors["birthday"]}</p>}
                  </div>
                </div>

                {/* Kategori-dropdown */}
                <div className="mb-4">
                  <label className="field-label">{t("form.category")}</label>
                  <Dropdown
                    value={category}
                    onChange={(value) => setCategory(value as MemberCategory)}
                    ariaLabel={t("form.category")}
                    options={categoryOptions.map((value) => ({
                      value,
                      label: t("members.filter." + value),
                    }))}
                  />
                </div>

                {/* Profilbild — välj fil eller klistra in en länk (annars visas initialer) */}
                <div className="mb-4">
                  <label className="field-label">{t("form.photoUrl")}</label>
                  <div className="flex items-center gap-3 mb-2">
                    {/* Förhandsvisning: bilden om den finns, annars initialer */}
                    <Avatar name={name} photoUrl={photoUrl.trim() || undefined} size="lg" />
                    <div className="flex flex-col items-start gap-1">
                      {/* Ta foto — öppnar kameran på mobil/surfplatta */}
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-1.5 btn-secondary text-soft text-sm"
                      >
                        <Camera size={14} />
                        {t("form.takePhoto")}
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-1.5 btn-secondary text-soft text-sm"
                      >
                        <Upload size={14} />
                        {t("form.choosePhoto")}
                      </button>
                      {photoUrl && (
                        <button
                          type="button"
                          onClick={() => setPhotoUrl("")}
                          className="text-xs text-red-600 hover:underline dark:text-red-400"
                        >
                          {t("form.removePhoto")}
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Dolt fil-fält — öppnas av Välj bild-knappen */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                  {/* Dolt kamera-fält — capture öppnar kameran på mobil/surfplatta */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFile}
                    className="hidden"
                  />
                  {errors["photoUrl"] && <p className="field-error">{errors["photoUrl"]}</p>}
                </div>

                {/* Anteckningar — valfritt fält */}
                <div className="mb-6">
                  <label className="field-label">{t("form.notesOptional")}</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t("form.phNotes")}
                    rows={2}
                    className="field resize-none"
                  />
                </div>
              </>
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
