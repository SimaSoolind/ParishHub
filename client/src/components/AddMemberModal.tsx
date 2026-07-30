// AddMemberModal — formulär för att skapa eller ändra en medlem
// Prästen fyller i namn, kontaktuppgifter, kategori och anteckningar
// Skickar värdena till föräldern via onSave-prop
// Om initialData skickas in öppnas formuläret förifyllt (redigeringsläge)
//
// Används av: Members.tsx

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import type { MemberCategory, NewMemberData } from "../types/member"
import { newMemberSchema } from "../schemas/memberSchema"

interface Props {
  onSave: (member: NewMemberData) => void
  onClose: () => void
  // Förifyllda värden vid redigering
  initialData?: NewMemberData
  // Sant vid redigering — styr rubrik och knapptext
  isEdit?: boolean
}

// Alternativ i kategori-dropdown
// Kopplar internt värde till svensk visning
const categoryOptions: { value: MemberCategory; label: string }[] = [
  { value: "adult", label: "Vuxen" },
  { value: "youth", label: "Ungdom" },
  { value: "leader", label: "Ledare" },
  { value: "other", label: "Övrig" },
]

// Ritar formuläret och håller fältens värden i state
// Tar emot onSave (spara), onClose (stäng) och eventuell initialData
// Returnerar modalen som JSX
export function AddMemberModal({ onSave, onClose, initialData, isEdit = false }: Props) {
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

  // Håller felmeddelanden per fält från valideringen
  const [errors, setErrors] = useState<Record<string, string>>({})

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
    })

    // Om valideringen misslyckas — samla felmeddelanden per fält och avbryt
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = String(issue.path[0])
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    // Skickar den validerade medlemmen till föräldern
    setErrors({})
    onSave(result.data)
  }

  return (
    // Backdrop — klick utanför stänger modalen
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Rubrik-rad med stäng-knapp */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-bold text-stone-800">
            {isEdit ? "Redigera medlem" : "Ny medlem"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100"
            aria-label="Stäng"
          >
            <X size={20} className="text-stone-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Namn-fält */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Namn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="T.ex. Anna Lindgren"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
            />
            {errors.name && (
              <p className="text-xs text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Telefon-fält */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="T.ex. 0701234567"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
            )}
          </div>

          {/* E-post-fält */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              E-post
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="T.ex. anna@example.com"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Adress-fält */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Adress
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="T.ex. Storgatan 12, Stockholm"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
            />
            {errors.address && (
              <p className="text-xs text-red-600 mt-1">{errors.address}</p>
            )}
          </div>

          {/* Familjestorlek och födelsedag bredvid varandra */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
                Familjestorlek
              </label>
              <input
                type="number"
                min={1}
                value={familySize}
                onChange={(e) => setFamilySize(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
              />
              {errors.familySize && (
                <p className="text-xs text-red-600 mt-1">{errors.familySize}</p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
                Födelsedag
              </label>
              <input
                type="text"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                placeholder="T.ex. 5 aug"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
              />
              {errors.birthday && (
                <p className="text-xs text-red-600 mt-1">{errors.birthday}</p>
              )}
            </div>
          </div>

          {/* Kategori-dropdown */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as MemberCategory)}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Anteckningar — valfritt fält */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">
              Anteckningar (frivilligt)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="T.ex. Sjungit i kören sedan 2020"
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:border-amber-800 focus:outline-none resize-none"
            />
          </div>

          {/* Knappar */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-stone-200 rounded-xl font-semibold text-stone-600 hover:bg-stone-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-900"
            >
              {isEdit ? "Spara ändring" : "Spara"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
