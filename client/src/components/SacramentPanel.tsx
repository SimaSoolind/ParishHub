// SacramentPanel visar en medlems sakrament som en tidslinje och låter prästen
// registrera, redigera och radera dem. Intyg (länk) öppnas i ny flik
//
// Används av: MemberDetail (medlems-detaljsidan)
// Bygger på: useSacraments (data), Badge, SacramentModal (formulär)

import { useState } from "react"
import { ScrollText, Plus, Trash2, Pencil, ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "../lib/errorHandler"
import { Badge } from "./Badge"
import { SacramentModal } from "./SacramentModal"
import { useSacraments } from "../hooks/useSacraments"
import type { Member } from "../domain/member"
import type { Sacrament, NewSacramentData } from "../domain/sacrament"
import { formatShortDate } from "../utils/dateUtils"

interface Props {
  memberId: string
  members: Member[] // Alla medlemmar (för att välja/visa make/maka vid äktenskap)
}

// Ritar sakrament-panelen: tidslinje + formulär-modal för att lägga till/ändra
// Tar emot memberId (vilken medlem sakramenten hör till)
// Returnerar panelen som JSX
export function SacramentPanel({ memberId, members }: Props) {
  const { t } = useTranslation()

  // Sakrament + funktioner från hooken (sorterade äldst först)
  const { sacraments, addSacrament, updateSacrament, removeSacrament } = useSacraments(memberId)

  // Om formuläret är öppet och vilket sakrament som redigeras (null = nytt)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Sacrament | null>(null)

  // Öppnar formuläret för nytt eller befintligt sakrament
  const openNew = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (sacrament: Sacrament) => {
    setEditing(sacrament)
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setEditing(null)
  }

  // Sparar ett nytt eller ändrat sakrament med felhantering och toast
  const handleSave = async (data: NewSacramentData) => {
    try {
      if (editing) await updateSacrament(editing.id, data)
      else await addSacrament(data)
      closeModal()
      toast.success(editing ? t("common.updated") : t("common.added"))
    } catch (error) {
      logError("SacramentPanel.handleSave", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Tar bort ett sakrament
  const handleDelete = async (id: string) => {
    try {
      await removeSacrament(id)
      toast.success(t("common.removed"))
    } catch (error) {
      logError("SacramentPanel.handleDelete", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ScrollText size={18} className="text-accent" />
          <h2 className="text-sm font-bold text-accent">{t("sacraments.title")}</h2>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
        >
          <Plus size={16} aria-hidden="true" />
          {t("sacraments.add")}
        </button>
      </div>

      {sacraments.length === 0 ? (
        <p className="text-sm text-faint italic">{t("sacraments.empty")}</p>
      ) : (
        <ul className="divide-y divide-rows">
          {sacraments.map((sacrament) => (
            <li key={sacrament.id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge color="blue">{t("sacraments.type." + sacrament.type)}</Badge>
                  <span className="text-sm text-faint">{formatShortDate(sacrament.date)}</span>
                </div>
                <div className="text-sm text-soft mt-1">
                  {sacrament.officiant}
                  {sacrament.place ? " · " + sacrament.place : ""}
                </div>
                {sacrament.partnerId && (
                  <div className="text-xs text-faint mt-1">
                    {t("sacramentForm.partner")}:{" "}
                    {members.find((member) => member.id === sacrament.partnerId)?.name ?? "—"}
                  </div>
                )}
                {sacrament.witnesses && (
                  <div className="text-xs text-faint mt-1">
                    {t("sacramentForm.witnesses")}: {sacrament.witnesses}
                  </div>
                )}
                {sacrament.grade && (
                  <div className="text-xs text-faint mt-1">
                    {t("sacramentForm.grade")}: {sacrament.grade}
                  </div>
                )}
                {sacrament.notes && (
                  <div className="text-xs text-faint mt-1">{sacrament.notes}</div>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {sacrament.certificateUrl && (
                  <a
                    href={sacrament.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("sacraments.openCertificate")}
                    className="p-2 rounded-full row-hover text-accent"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => openEdit(sacrament)}
                  aria-label={t("sacraments.edit")}
                  className="p-2 rounded-full row-hover text-soft"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(sacrament.id)}
                  aria-label={t("sacraments.delete")}
                  className="p-2 rounded-full row-hover text-soft hover:text-red-700 dark:hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && (
        <SacramentModal
          memberId={memberId}
          members={members}
          sacrament={editing}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
