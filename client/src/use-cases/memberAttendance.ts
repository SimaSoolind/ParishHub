// memberAttendance — ren logik för en medlems närvarohistorik (ingen React)
// Plockar ut medlemmens närvaro per gudstjänst och räknar ut närvaro-procent
//
// Används av: useMemberAttendance / MemberHistoryChart

import type { Service, Attendance } from "../domain/service"
import { formatShortDate } from "../utils/dateUtils"

// En punkt i historiken: en gudstjänst och om medlemmen var närvarande
export interface MemberAttendancePoint {
  serviceId: string
  label: string // Kort datum för x-axeln, t.ex. "2 aug"
  present: boolean // Sant om medlemmen var närvarande
}

// Bygger en medlems närvarohistorik, äldst först
// Tar gudstjänster, alla närvaro-poster, medlemmens id och hur många punkter (standard 8)
// Returnerar en punkt per gudstjänst där medlemmen är avprickad (present eller absent)
export function getMemberAttendance(
  services: Service[],
  attendance: Attendance[],
  memberId: string,
  limit = 8
): MemberAttendancePoint[] {
  const serviceById = new Map(services.map((service) => [service.id, service]))

  return attendance
    .filter((record) => record.memberId === memberId && serviceById.has(record.serviceId))
    .map((record) => {
      const service = serviceById.get(record.serviceId)
      return {
        serviceId: record.serviceId,
        date: service?.date ?? "",
        present: record.status === "present",
      }
    })
    .sort((earlier, later) => earlier.date.localeCompare(later.date))
    .slice(-limit)
    .map((record) => ({
      serviceId: record.serviceId,
      label: formatShortDate(record.date),
      present: record.present,
    }))
}

// Räknar ut närvaro-procent (andel gudstjänster medlemmen var närvarande på)
// Tar en lista med historik-punkter
// Returnerar procent 0–100 (avrundat), eller 0 om listan är tom
export function calculateAttendanceRate(points: MemberAttendancePoint[]): number {
  if (points.length === 0) return 0
  const present = points.filter((point) => point.present).length
  return Math.round((present / points.length) * 100)
}
