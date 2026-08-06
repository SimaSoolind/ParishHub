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
import { TodaySummary } from "../components/TodaySummary"
import { AttendanceChart } from "../components/AttendanceChart"
import { AttendanceCard } from "../components/AttendanceCard"
import { MemberDistributionCard } from "../components/MemberDistributionCard"
import { BirthdayList } from "../components/BirthdayList"
import { UpcomingServices } from "../components/UpcomingServices"
import { RecentContacts } from "../components/RecentContacts"
import { PriorityList } from "../components/PriorityList"
import { ReminderCard } from "../components/ReminderCard"
import { useBirthdays } from "../hooks/useBirthdays"
import { useDateTime } from "../hooks/useDateTime"
import { useDashboardStats } from "../hooks/useDashboardStats"
import { useReminders } from "../hooks/useReminders"
import { getActiveReminders } from "../use-cases/reminders"

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

  // Antal aktiva påminnelser till översiktsraden
  const { reminders } = useReminders()
  const reminderCount = getActiveReminders(reminders).length

  return (
    <>
      <header>
        <h1 className="text-4xl font-serif font-bold text-strong mb-2">
          {t("dashboard.hello", { greeting: t("greeting." + greetingKey) })}
        </h1>
        <p className="text-soft mb-6">{date}</p>
      </header>

      {/* Översikt — dagens börda på en blick */}
      <TodaySummary
        toContact={stats.toContactCount}
        reminders={reminderCount}
        birthdays={birthdays.length}
      />

      {/* Zon 1 — saker att AGERA på */}
      <h2 className="text-sm font-bold text-soft uppercase mb-2">{t("dashboard.sectionTodo")}</h2>
      <PriorityList contacts={contactsToReach} />
      <ReminderCard />

      {/* Zon 2 — saker att HÅLLA KOLL på */}
      <h2 className="text-sm font-bold text-soft uppercase mb-3 mt-10">
        {t("dashboard.sectionOverview")}
      </h2>
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
      <MemberDistributionCard />
      <UpcomingServices services={upcomingServices} />
      <BirthdayList birthdays={birthdays} />
      <RecentContacts contacts={recentContacts} />
      <AttendanceCard />
    </>
  )
}
