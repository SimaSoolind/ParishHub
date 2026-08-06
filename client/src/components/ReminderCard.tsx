// ReminderCard visar prästens manuella påminnelser och låter hen skapa nya
// Aktiva påminnelser listas (mest brådskande först); klar/radera per rad
// Ring/Mejl/WhatsApp visas om påminnelsen har telefon/e-post
//
// Används av: Dashboard.tsx
// Bygger på: useReminders (data), getActiveReminders (logik), ReminderModal, ContactActions

import { useState } from "react"
import { BellRing, Plus, Check, Trash2 } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "../lib/errorHandler"
import { Badge } from "./Badge"
import { ContactActions } from "./ContactActions"
import { ReminderModal } from "./ReminderModal"
import { useReminders } from "../hooks/useReminders"
import { getActiveReminders } from "../use-cases/reminders"
import type { NewReminderData, ReminderKind } from "../domain/reminder"
import { formatShortDate } from "../utils/dateUtils"

// Färg på typ-etiketten: påminnelse (blå), sorg (röd), åtagande (gul)
const kindColor: Record<ReminderKind, "blue" | "red" | "amber"> = {
  manual: "blue",
  grief: "red",
  commitment: "amber",
}

// Ritar påminnelse-kortet med lista och formulär-modal
// Tar inga props (hämtar själv data via hooken)
// Returnerar kortet som JSX
export function ReminderCard() {
  const { t } = useTranslation()

  // Påminnelser + funktioner från hooken
  const { reminders, addReminder, markDone, removeReminder } = useReminders()

  // Om formuläret är öppet
  const [modalOpen, setModalOpen] = useState(false)

  // Bara aktiva (ej klara) påminnelser, mest brådskande först
  const active = getActiveReminders(reminders)

  // Skapar en ny påminnelse
  const handleAdd = async (data: NewReminderData) => {
    try {
      await addReminder(data)
      setModalOpen(false)
      toast.success(t("common.added"))
    } catch (error) {
      logError("ReminderCard.handleAdd", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Markerar en påminnelse som klar
  const handleDone = async (id: string) => {
    try {
      await markDone(id)
      toast.success(t("common.saved"))
    } catch (error) {
      logError("ReminderCard.handleDone", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Tar bort en påminnelse
  const handleDelete = async (id: string) => {
    try {
      await removeReminder(id)
      toast.success(t("common.removed"))
    } catch (error) {
      logError("ReminderCard.handleDelete", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BellRing size={18} className="text-accent" />
          <h2 className="text-sm font-bold text-accent">{t("reminders.title")}</h2>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
        >
          <Plus size={16} aria-hidden="true" />
          {t("reminders.add")}
        </button>
      </div>

      {active.length === 0 ? (
        <p className="text-sm text-faint italic">{t("reminders.empty")}</p>
      ) : (
        <ul className="divide-y divide-rows">
          {active.map((reminder) => (
            <li key={reminder.id} className="flex items-start justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge color={kindColor[reminder.kind]}>
                    {t("reminders.kind." + reminder.kind)}
                  </Badge>
                  <span className="font-semibold text-strong">{reminder.name}</span>
                </div>
                <div className="text-sm text-faint mt-1">{reminder.reason}</div>
                {reminder.dueDate && (
                  <div className="text-xs text-faint mt-1">
                    {t("reminders.due", { date: formatShortDate(reminder.dueDate) })}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                {reminder.phone && (
                  <ContactActions
                    name={reminder.name}
                    phone={reminder.phone}
                    email={reminder.email}
                  />
                )}
                <button
                  onClick={() => handleDone(reminder.id)}
                  aria-label={t("reminders.done")}
                  className="p-2 rounded-full row-hover text-green-700 dark:text-green-400"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => handleDelete(reminder.id)}
                  aria-label={t("reminders.delete")}
                  className="p-2 rounded-full row-hover text-soft hover:text-red-700 dark:hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {modalOpen && <ReminderModal onSave={handleAdd} onClose={() => setModalOpen(false)} />}
    </div>
  )
}
