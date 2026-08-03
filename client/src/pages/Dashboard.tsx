// Dashboard — startsidan för Kyrko-appen
// Visar statistik, födelsedagar och prioritetslista för prästen
// Datum och hälsning kommer från useDateTime-hooken
//
// Används av: App.tsx (sidan för URL "/")
// Bygger på: StatCard, BirthdayList, PriorityList, useDateTime, useBirthdays, useContacts
// Data: kommer från useBirthdays/useContacts — sidan vet inte om det är mock eller databas

import { Users, Check, AlertTriangle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { StatCard } from "../components/StatCard"
import { BirthdayList } from "../components/BirthdayList"
import { PriorityList } from "../components/PriorityList"
import { useBirthdays } from "../hooks/useBirthdays"
import { useContacts } from "../hooks/useContacts"
import { useDateTime } from "../hooks/useDateTime"

// Sätter ihop startsidan: hälsning, tre StatCard, BirthdayList och PriorityList
// Tar inga props
// Returnerar hela sidan som JSX
export function Dashboard() {
  const { t } = useTranslation()

  // Hämtar datum och hälsnings-nyckel från hooken — ingen logik i JSX
  const { date, greetingKey } = useDateTime()

  // Data via repository-hooks — sidan vet inte om det är mock eller databas
  const birthdays = useBirthdays()
  const contacts = useContacts()

  return (
    <>
      <header>
        <h1 className="text-3xl font-bold text-strong mb-2">
          {t("dashboard.hello", { greeting: t("greeting." + greetingKey) })}
        </h1>
        <p className="text-soft mb-6">{date}</p>
      </header>

      <section aria-label={t("a11y.statsRegion")} className="flex gap-4 mb-6">
        <StatCard label={t("dashboard.statMembers")} value={47} color="blue" Icon={Users} />
        <StatCard label={t("dashboard.statPresent")} value={38} color="green" Icon={Check} />
        <StatCard label={t("dashboard.statToContact")} value={5} color="red" Icon={AlertTriangle} />
      </section>

      <BirthdayList birthdays={birthdays} />
      <PriorityList contacts={contacts} />
    </>
  )
}
