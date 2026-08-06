// useDashboardStats — presentation-hook som ger dashboardens nyckeltal (KPI:er)
// Hämtar data från flera repositories och räknar fram statistiken via use-caset
// Sidan slipper veta VAR datan kommer ifrån (mock nu, databas senare)
//
// Används av: Dashboard.tsx

import { useState, useEffect } from "react"
import type { Service } from "../domain/service"
import type { Contact } from "../domain/contact"
import { mockMemberRepository } from "../data/mock/mockMemberRepository"
import { mockServiceRepository } from "../data/mock/mockServiceRepository"
import { mockContactRepository } from "../data/mock/mockContactRepository"
import {
  buildDashboardStats,
  getUpcomingServices,
  getRecentContacts,
  buildAbsenceReminders,
  getAttendanceTrend,
  type DashboardStats,
  type AttendancePoint,
} from "../use-cases/dashboardStats"

// Startvärden medan datan hämtas — visar 0 tills allt är klart
const emptyStats: DashboardStats = { memberCount: 0, presentThisWeek: 0, toContactCount: 0 }

// Ger all data dashboarden behöver: KPI:er + tre listor
// Tar inga argument
// Returnerar { stats, upcomingServices, recentContacts, contactsToReach, loading }
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>(emptyStats)
  const [attendanceTrend, setAttendanceTrend] = useState<AttendancePoint[]>([])
  const [upcomingServices, setUpcomingServices] = useState<Service[]>([])
  const [recentContacts, setRecentContacts] = useState<Contact[]>([])
  const [contactsToReach, setContactsToReach] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  // Hämtar all data parallellt och räknar fram statistik + listor en gång
  useEffect(() => {
    Promise.all([
      mockMemberRepository.getAll(),
      mockServiceRepository.getAll(),
      mockServiceRepository.getAttendance(),
      mockContactRepository.getAll(),
    ]).then(([members, services, attendance, contacts]) => {
      const today = new Date()
      // Frånvaro-regeln skapar "att kontakta"-listan automatiskt (standard 4 veckor)
      const reminders = buildAbsenceReminders(members, services, attendance, today)
      setStats(
        buildDashboardStats({ members, services, attendance, absenceReminders: reminders, today })
      )
      setAttendanceTrend(getAttendanceTrend(services, attendance))
      setUpcomingServices(getUpcomingServices(services, today))
      setRecentContacts(getRecentContacts(contacts))
      setContactsToReach(reminders)
      setLoading(false)
    })
  }, [])

  return { stats, attendanceTrend, upcomingServices, recentContacts, contactsToReach, loading }
}
