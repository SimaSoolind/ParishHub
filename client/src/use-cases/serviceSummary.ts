// serviceSummary — räknar fram en sammanfattningsrapport för EN gudstjänst
// Visar närvarograd (present/avprickade) och jämför med snittet för alla gudstjänster
// Ren affärslogik (use-case) — ingen React, lätt att testa separat
//
// Används av: useServiceSummary

import type { Service, Attendance } from "../domain/service"

// Sammanfattning för en gudstjänst
export interface ServiceSummary {
  present: number // Antal närvarande
  absent: number // Antal frånvarande
  total: number // Antal avprickade (närvarande + frånvarande)
  rate: number // Närvarograd i procent (0-100), avrundad
  averageRate: number // Snitt-närvarograd över alla gudstjänster med data
  diffFromAverage: number // rate minus averageRate (kan vara negativ)
  hasData: boolean // Falskt om gudstjänsten saknar avprickad närvaro
}

// Räknar närvarograd i procent för en enskild gudstjänst
// Tar närvaro-poster som hör till gudstjänsten
// Returnerar procent (0-100) eller null om inga poster finns
function rateFor(records: Attendance[]): number | null {
  if (records.length === 0) return null
  const present = records.filter((a) => a.status === "present").length
  return Math.round((present / records.length) * 100)
}

// Bygger sammanfattningsrapporten för en gudstjänst
// Tar alla gudstjänster, alla närvaro-poster och gudstjänstens id
// Returnerar ServiceSummary med närvarograd och jämförelse mot snittet
export function buildServiceSummary(
  services: Service[],
  attendance: Attendance[],
  serviceId: string
): ServiceSummary {
  const records = attendance.filter((a) => a.serviceId === serviceId)
  const present = records.filter((a) => a.status === "present").length
  const absent = records.filter((a) => a.status === "absent").length
  const rate = rateFor(records) ?? 0

  // Snittet räknas per gudstjänst (varje gudstjänst väger lika), inte per person
  const perServiceRates = services
    .map((service) => rateFor(attendance.filter((a) => a.serviceId === service.id)))
    .filter((r): r is number => r !== null)

  const averageRate =
    perServiceRates.length === 0
      ? 0
      : Math.round(perServiceRates.reduce((sum, r) => sum + r, 0) / perServiceRates.length)

  return {
    present,
    absent,
    total: records.length,
    rate,
    averageRate,
    diffFromAverage: rate - averageRate,
    hasData: records.length > 0,
  }
}
