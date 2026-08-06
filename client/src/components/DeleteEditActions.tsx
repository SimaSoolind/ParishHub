// DeleteEditActions — fot med Radera- och Redigera-knappar + bekräftelse innan radering
// Sköter själv bekräftelse-läget, så föräldern slipper upprepa samma logik och knappar
//
// Används av: MemberProfileModal, EventModal

import { useState } from "react"
import { Trash2, Pencil } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Props {
  name: string // Visas i bekräftelse-frågan ("Radera {name}?")
  onDelete: () => void
  onEdit: () => void
}

// Ritar Radera/Redigera-knapparna, eller en bekräftelse-fråga när Radera tryckts
// Tar emot name (för frågan), onDelete och onEdit
// Returnerar foten som JSX
export function DeleteEditActions({ name, onDelete, onEdit }: Props) {
  const { t } = useTranslation()

  // Sant när prästen tryckt Radera och ska bekräfta borttagningen
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  if (confirmingDelete) {
    return (
      <div className="mt-5">
        <p className="text-sm text-soft mb-3">{t("profile.deleteQ", { name })}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setConfirmingDelete(false)}
            className="flex-1 px-4 py-2 btn-secondary text-soft"
          >
            {t("form.cancel")}
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-2 bg-red-700 text-white rounded-xl font-semibold hover:bg-red-800"
          >
            {t("profile.confirmDelete")}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2 mt-5">
      <button
        onClick={() => setConfirmingDelete(true)}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 rounded-xl font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
      >
        <Trash2 size={16} />
        {t("profile.delete")}
      </button>
      <button
        onClick={onEdit}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 btn-primary"
      >
        <Pencil size={16} />
        {t("profile.edit")}
      </button>
    </div>
  )
}
