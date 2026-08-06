// useMemberAttendance — presentation-hook för en medlems närvarohistorik
// Hämtar gudstjänster + närvaro via repositoryt och räknar fram punkter + procent
//
// Används av: MemberHistoryChart

import { useState, useEffect } from "react"
import { mockServiceRepository as repository } from "../data/mock/mockServiceRepository"
import {
  getMemberAttendance,
  calculateAttendanceRate,
  type MemberAttendancePoint,
} from "../use-cases/memberAttendance"

// Ger en medlems närvaro-punkter + närvaro-procent
// Tar memberId (vilken medlem historiken gäller)
// Returnerar points, rate och loading
export function useMemberAttendance(memberId: string) {
  const [points, setPoints] = useState<MemberAttendancePoint[]>([])
  const [loading, setLoading] = useState(true)

  // Hämtar gudstjänster + närvaro och räknar fram medlemmens historik
  useEffect(() => {
    Promise.all([repository.getAll(), repository.getAttendance()]).then(
      ([services, attendance]) => {
        setPoints(getMemberAttendance(services, attendance, memberId))
        setLoading(false)
      }
    )
  }, [memberId])

  const rate = calculateAttendanceRate(points)

  return { points, rate, loading }
}
