// Enhetstester för medlemmens närvarohistorik (urval + närvaro-procent)
// Rena funktioner — inget React, ingen mock behövs

import { describe, it, expect } from "vitest"
import { getMemberAttendance, calculateAttendanceRate } from "./memberAttendance"
import type { Service, Attendance } from "../domain/service"

const services: Service[] = [
  { id: "s1", title: "A", date: "2026-07-19", startTime: "10:00" },
  { id: "s2", title: "B", date: "2026-07-26", startTime: "10:00" },
  { id: "s3", title: "C", date: "2026-08-02", startTime: "10:00" },
]

const attendance: Attendance[] = [
  { serviceId: "s1", memberId: "1", status: "present" },
  { serviceId: "s2", memberId: "1", status: "absent" },
  { serviceId: "s3", memberId: "1", status: "present" },
  { serviceId: "s1", memberId: "2", status: "present" }, // annan medlem — ska ignoreras
]

describe("getMemberAttendance", () => {
  it("tar bara medlemmens poster, sorterade äldst först", () => {
    const result = getMemberAttendance(services, attendance, "1")
    expect(result.map((p) => p.serviceId)).toEqual(["s1", "s2", "s3"])
    expect(result.map((p) => p.present)).toEqual([true, false, true])
  })

  it("ger tom lista för medlem utan poster", () => {
    expect(getMemberAttendance(services, attendance, "999")).toHaveLength(0)
  })
})

describe("calculateAttendanceRate", () => {
  it("räknar andel närvarande i procent", () => {
    const points = getMemberAttendance(services, attendance, "1")
    // 2 av 3 närvarande = 67 %
    expect(calculateAttendanceRate(points)).toBe(67)
  })

  it("ger 0 för tom lista", () => {
    expect(calculateAttendanceRate([])).toBe(0)
  })
})
