// TodaySummary — kompakt översikt högst upp på startsidan
// Visar dagens börda på EN blick: antal att kontakta, påminnelser och födelsedagar
// Så prästen direkt ser läget utan att skrolla igenom alla kort
//
// Används av: Dashboard.tsx

import { ClipboardList, PhoneCall, BellRing, Cake } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Props {
  toContact: number // Antal att kontakta (frånvaro-påminnelser)
  reminders: number // Antal aktiva manuella påminnelser
  birthdays: number // Antal födelsedagar denna vecka
}

// Ritar översiktsraden med tre siffror och ikoner
// Tar emot toContact, reminders och birthdays
// Returnerar kortet som JSX
export function TodaySummary({ toContact, reminders, birthdays }: Props) {
  const { t } = useTranslation()

  return (
    <div className="surface border p-4 rounded-2xl shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-3">
        <ClipboardList size={18} className="text-accent" />
        <h2 className="text-sm font-bold text-accent">{t("today.title")}</h2>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-soft">
        <span className="flex items-center gap-2">
          <PhoneCall size={16} className="text-red-700 dark:text-red-400" aria-hidden="true" />
          <strong className="text-strong">{toContact}</strong> {t("today.toContact")}
        </span>
        <span className="flex items-center gap-2">
          <BellRing size={16} className="text-amber-700 dark:text-amber-400" aria-hidden="true" />
          <strong className="text-strong">{reminders}</strong> {t("today.reminders")}
        </span>
        <span className="flex items-center gap-2">
          <Cake size={16} className="text-pink-700 dark:text-pink-400" aria-hidden="true" />
          <strong className="text-strong">{birthdays}</strong> {t("today.birthdays")}
        </span>
      </div>
    </div>
  )
}
