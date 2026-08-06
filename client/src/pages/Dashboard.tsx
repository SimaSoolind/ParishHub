// Dashboard — startsidan för Kyrko-appen
// Visar statistik, födelsedagar och prioritetslista för prästen
// Datum och hälsning kommer från useDateTime-hooken
//
// Används av: App.tsx (sidan för URL "/")
// Bygger på: StatCard, BirthdayList, UpcomingServices, RecentContacts, PriorityList
// Data: kommer från hooks — sidan vet inte om det är mock eller databas

import { Users, Check, AlertTriangle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { StatCard } from "../components/StatCard"
import { AttendanceChart } from "../components/AttendanceChart"
import { AttendanceCard } from "../components/AttendanceCard"
import { BirthdayList } from "../components/BirthdayList"
import { UpcomingServices } from "../components/UpcomingServices"
import { RecentContacts } from "../components/RecentContacts"
import { PriorityList } from "../components/PriorityList"
import { useBirthdays } from "../hooks/useBirthdays"
import { useDateTime } from "../hooks/useDateTime"
import { useDashboardStats } from "../hooks/useDashboardStats"

// Sätter ihop startsidan: hälsning, tre StatCard och fyra listor
// Tar inga props
// Returnerar hela sidan som JSX
export function Dashboard() {
  const { t } = useTranslation()

  // Hämtar datum och hälsnings-nyckel från hooken — ingen logik i JSX
  const { date, greetingKey } = useDateTime()

  // Födelsedagar via egen repository-hook
  const birthdays = useBirthdays()

  // KPI:er + dashboardens listor och graf-data räknas fram i hooken — ingen beräkning i JSX
  const { stats, attendanceTrend, upcomingServices, recentContacts, contactsToReach } =
    useDashboardStats()

  return (
    <>
      <header>
        <h1 className="text-4xl font-serif font-bold text-strong mb-2">
          {t("dashboard.hello", { greeting: t("greeting." + greetingKey) })}
        </h1>
        <p className="text-soft mb-6">{date}</p>
      </header>

      <section aria-label={t("a11y.statsRegion")} className="flex gap-4 mb-6">
        <StatCard
          label={t("dashboard.statMembers")}
          value={stats.memberCount}
          color="blue"
          Icon={Users}
        />
        <StatCard
          label={t("dashboard.statPresent")}
          value={stats.presentThisWeek}
          color="green"
          Icon={Check}
        />
        <StatCard
          label={t("dashboard.statToContact")}
          value={stats.toContactCount}
          color="red"
          Icon={AlertTriangle}
        />
      </section>

      <AttendanceChart points={attendanceTrend} />
      <AttendanceCard />
      <BirthdayList birthdays={birthdays} />
      <UpcomingServices services={upcomingServices} />
      <RecentContacts contacts={recentContacts} />
      <PriorityList contacts={contactsToReach} />
    </>
  )
}
