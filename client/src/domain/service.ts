// Service — domän-entitet för en gudstjänst eller samling
// Attendance — kopplar en medlem till en gudstjänst med närvarostatus
// Ligger i domain/ — rena datastrukturer, oberoende av React och externa API:er

import type { ContactStatus } from "./contact"

export type AttendanceStatus = "present" | "absent" | "not-marked"

export type AbsenceReason = "sick" | "travel" | "unknown" | "other"

// En gudstjänst med grundläggande information
export type Service = {
  id: string
  title: string
  date: string // ISO-format: "2026-08-03"
  startTime: string // "10:00"
  endTime?: string | undefined // "12:00" — valfri sluttid
  notes?: string | undefined
  feast?: string | undefined // Högtid (t.ex. Fastan, Jul, Påsk) — för planering
  bibleText?: string | undefined // Bibeltexter kopplade till gudstjänsten
}

// Närvaro för EN medlem i EN gudstjänst (många-till-många-relation)
export type Attendance = {
  serviceId: string
  memberId: string
  status: AttendanceStatus
  absenceReason?: AbsenceReason // Orsak vid frånvaro (sjuk/resa/okänd/annat)
  contactStatus?: ContactStatus // Kontaktstatus för frånvarande (Ej kontaktad/Försökt/Svarat)
  markedAt?: string // När avprickningen gjordes (ISO-tid) — för spårbarhet
  markedBy?: string // Vem som prickade av (t.ex. prästens id) — för spårbarhet
}

// Används när prästen skapar ny gudstjänst (utan id än)
export type NewServiceData = Omit<Service, "id">
