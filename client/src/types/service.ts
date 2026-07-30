// Service — beskriver en gudstjänst eller samling
// Attendance — kopplar en medlem till en gudstjänst med närvarostatus

export type AttendanceStatus = "present" | "absent" | "not-marked"

export type AbsenceReason = "sick" | "travel" | "unknown" | "other"

// En gudstjänst med grundläggande information
export type Service = {
  id: string
  title: string
  date: string       // ISO-format: "2026-08-03"
  startTime: string  // "10:00"
  endTime?: string   // "12:00" — valfri sluttid
  notes?: string
}

// Närvaro för EN medlem i EN gudstjänst
// Byggs som många-till-många relation
export type Attendance = {
  serviceId: string
  memberId: string
  status: AttendanceStatus
  absenceReason?: AbsenceReason
  markedAt?: string   // När avprickningen gjordes (ISO-tid) — för spårbarhet
  markedBy?: string   // Vem som prickade av (t.ex. prästens id) — för spårbarhet
}

// Används när prästen skapar ny gudstjänst
export type NewServiceData = Omit<Service, "id">
