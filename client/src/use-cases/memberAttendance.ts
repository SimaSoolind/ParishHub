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
    .filter((a) => a.memberId === memberId && serviceById.has(a.serviceId))
    .map((a) => {
      const service = serviceById.get(a.serviceId)
      return {
        serviceId: a.serviceId,
        date: service?.date ?? "",
        present: a.status === "present",
      }
    })
    .sort((x, y) => x.date.localeCompare(y.date))
    .slice(-limit)
    .map((r) => ({ serviceId: r.serviceId, label: formatShortDate(r.date), present: r.present }))
}

// Räknar ut närvaro-procent (andel gudstjänster medlemmen var närvarande på)
// Tar en lista med historik-punkter
// Returnerar procent 0–100 (avrundat), eller 0 om listan är tom
export function calculateAttendanceRate(points: MemberAttendancePoint[]): number {
  if (points.length === 0) return 0
  const present = points.filter((point) => point.present).length
  return Math.round((present / points.length) * 100)
}
