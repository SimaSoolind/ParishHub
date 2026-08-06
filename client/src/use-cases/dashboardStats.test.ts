// Enhetstester för buildDashboardStats (dashboardens KPI-logik)
// Ren funktion — inget React, ingen mock behövs
// Dagens datum är fast (5 aug 2026) så testerna alltid ger samma svar

import { describe, it, expect } from "vitest"
import {
  buildDashboardStats,
  getUpcomingServices,
  getRecentContacts,
  buildAbsenceReminders,
  getAttendanceTrend,
} from "./dashboardStats"
import type { Member } from "../domain/member"
import type { Service, Attendance } from "../domain/service"
import type { Contact } from "../domain/contact"

// Fast "idag" — gör veckoberäkningen förutsägbar
const today = new Date("2026-08-05T12:00:00")

// Minimal medlem för att slippa upprepa alla fält
function member(id: string): Member {
  return {
    id,
    name: "Test " + id,
    phone: "0700",
    email: id + "@x.se",
    address: "X",
    familySize: 1,
    birthday: "1 jan",
    category: "adult",
  }
}

const members: Member[] = [member("1"), member("2"), member("3")]

// En gudstjänst inom veckan (2 aug) och en utanför (19 juli)
const services: Service[] = [
  { id: "s-week", title: "Denna vecka", date: "2026-08-02", startTime: "10:00" },
  { id: "s-old", title: "Gammal", date: "2026-07-19", startTime: "10:00" },
]

const attendance: Attendance[] = [
  { serviceId: "s-week", memberId: "1", status: "present" },
  { serviceId: "s-week", memberId: "2", status: "present" },
  { serviceId: "s-week", memberId: "3", status: "absent" },
  { serviceId: "s-old", memberId: "1", status: "present" },
]

// Förberäknade frånvaro-påminnelser (två stycken) för KPI-testet
const absenceReminders: Contact[] = [
  {
    id: "absence-1",
    name: "A",
    reason: "Ingen närvaro registrerad",
    status: "not-contacted",
    phone: "1",
  },
  {
    id: "absence-2",
    name: "B",
    reason: "Frånvarande 5 veckor",
    status: "not-contacted",
    phone: "2",
  },
]

describe("buildDashboardStats", () => {
  it("räknar totalt antal medlemmar", () => {
    const stats = buildDashboardStats({ members, services, attendance, absenceReminders, today })
    expect(stats.memberCount).toBe(3)
  })

  it("räknar bara närvarande inom de senaste sju dagarna", () => {
    const stats = buildDashboardStats({ members, services, attendance, absenceReminders, today })
    // Två present i veckans gudstjänst, den gamla (19 juli) räknas inte
    expect(stats.presentThisWeek).toBe(2)
  })

  it("räknar antal frånvaro-påminnelser som att kontakta", () => {
    const stats = buildDashboardStats({ members, services, attendance, absenceReminders, today })
    expect(stats.toContactCount).toBe(2)
  })
})

describe("getUpcomingServices", () => {
  const list: Service[] = [
    { id: "past", title: "Gammal", date: "2026-07-19", startTime: "10:00" },
    { id: "today", title: "Idag", date: "2026-08-05", startTime: "10:00" },
    { id: "soon", title: "Snart", date: "2026-08-09", startTime: "10:00" },
  ]

  it("tar med idag och framåt, tidigast först", () => {
    const result = getUpcomingServices(list, today)
    expect(result.map((s) => s.id)).toEqual(["today", "soon"])
  })

  it("begränsar antalet med limit", () => {
    expect(getUpcomingServices(list, today, 1)).toHaveLength(1)
  })
})

describe("getRecentContacts", () => {
  const list: Contact[] = [
    {
      id: "1",
      name: "A",
      reason: "x",
      status: "answered",
      phone: "1",
      lastContactedAt: "2026-08-01",
    },
    {
      id: "2",
      name: "B",
      reason: "x",
      status: "attempted",
      phone: "2",
      lastContactedAt: "2026-08-04",
    },
    { id: "3", name: "C", reason: "x", status: "not-contacted", phone: "3" },
  ]

  it("tar bara med kontaktade personer, senast först", () => {
    const result = getRecentContacts(list)
    expect(result.map((c) => c.id)).toEqual(["2", "1"])
  })
})

describe("buildAbsenceReminders", () => {
  const soleService: Service[] = [
    { id: "sv", title: "Nyligen", date: "2026-08-02", startTime: "10:00" },
  ]
  const soleAttendance: Attendance[] = [
    { serviceId: "sv", memberId: "1", status: "absent" },
    { serviceId: "sv", memberId: "2", status: "present" },
  ]

  it("skapar påminnelse för frånvarande medlem men inte för närvarande", () => {
    const result = buildAbsenceReminders(members, soleService, soleAttendance, today, 4)
    // Medlem 1 frånvarande, medlem 2 närvarande, medlem 3 saknar data
    expect(result).toHaveLength(1)
    expect(result[0]?.name).toBe("Test 1")
    expect(result[0]?.status).toBe("not-contacted")
  })

  it("hoppar över medlemmar helt utan närvaro-data", () => {
    const result = buildAbsenceReminders([member("9")], soleService, soleAttendance, today, 4)
    expect(result).toHaveLength(0)
  })

  it("sorterar mest frånvarande överst (aldrig närvarande först)", () => {
    const services2: Service[] = [
      { id: "old", title: "Gammal", date: "2026-06-20", startTime: "10:00" },
      { id: "recent", title: "Nyligen", date: "2026-08-02", startTime: "10:00" },
    ]
    const attendance2: Attendance[] = [
      { serviceId: "old", memberId: "1", status: "present" },
      { serviceId: "recent", memberId: "1", status: "absent" },
      { serviceId: "old", memberId: "2", status: "absent" },
      { serviceId: "recent", memberId: "2", status: "absent" },
    ]
    const result = buildAbsenceReminders(members, services2, attendance2, today, 4)
    // Medlem 2 var aldrig närvarande -> överst; medlem 1 (frånvarande N veckor) efter
    expect(result.map((c) => c.name)).toEqual(["Test 2", "Test 1"])
  })
})

describe("getAttendanceTrend", () => {
  it("räknar närvarande och totalt per gudstjänst, äldst först", () => {
    const result = getAttendanceTrend(services, attendance, 6)
    // Båda gudstjänsterna har närvaro: s-old (19 juli) före s-week (2 aug)
    expect(result).toHaveLength(2)
    expect(result[0]?.serviceId).toBe("s-old")
    // s-week: 2 present av 3 avprickade
    expect(result[1]?.present).toBe(2)
    expect(result[1]?.total).toBe(3)
  })

  it("hoppar över gudstjänster utan avprickad närvaro", () => {
    const result = getAttendanceTrend(services, [], 6)
    expect(result).toHaveLength(0)
  })
})
