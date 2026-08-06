// Enhetstester för buildServiceSummary
// Testar närvarograd, snitt och skillnad mot snittet

import { describe, it, expect } from "vitest"
import { buildServiceSummary } from "./serviceSummary"
import type { Service, Attendance } from "../domain/service"

// Minimal gudstjänst för test (bara fält logiken behöver)
function service(id: string): Service {
  return { id, title: "Gudstjänst", date: "2026-08-02", startTime: "10:00" }
}

// Kort hjälpare för en närvaro-post
function mark(serviceId: string, memberId: string, status: "present" | "absent"): Attendance {
  return { serviceId, memberId, status, markedAt: "2026-08-02T10:00:00Z" }
}

describe("buildServiceSummary", () => {
  it("räknar närvarograd för en gudstjänst (2 av 4 = 50%)", () => {
    const services = [service("s1")]
    const attendance = [
      mark("s1", "m1", "present"),
      mark("s1", "m2", "present"),
      mark("s1", "m3", "absent"),
      mark("s1", "m4", "absent"),
    ]
    const summary = buildServiceSummary(services, attendance, "s1")
    expect(summary.present).toBe(2)
    expect(summary.absent).toBe(2)
    expect(summary.total).toBe(4)
    expect(summary.rate).toBe(50)
    expect(summary.hasData).toBe(true)
  })

  it("jämför gudstjänsten mot snittet av alla gudstjänster", () => {
    const services = [service("s1"), service("s2")]
    const attendance = [
      // s1: 100% närvaro
      mark("s1", "m1", "present"),
      mark("s1", "m2", "present"),
      // s2: 0% närvaro
      mark("s2", "m1", "absent"),
      mark("s2", "m2", "absent"),
    ]
    const summary = buildServiceSummary(services, attendance, "s1")
    // Snitt av 100 och 0 = 50; s1 ligger 50 över snittet
    expect(summary.averageRate).toBe(50)
    expect(summary.diffFromAverage).toBe(50)
  })

  it("markerar hasData falskt när gudstjänsten saknar närvaro", () => {
    const services = [service("s1")]
    const summary = buildServiceSummary(services, [], "s1")
    expect(summary.hasData).toBe(false)
    expect(summary.total).toBe(0)
  })
})
