// Tester för useDashboardStats — dashboardens nyckeltal + listor via mock-repositories

import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useDashboardStats } from "./useDashboardStats"

describe("useDashboardStats", () => {
  it("räknar fram nyckeltal och listor", async () => {
    const { result } = renderHook(() => useDashboardStats())
    await waitForLoaded(result)

    expect(result.current.stats.memberCount).toBeGreaterThan(0)
    expect(Array.isArray(result.current.upcomingServices)).toBe(true)
    expect(Array.isArray(result.current.attendanceTrend)).toBe(true)
    expect(Array.isArray(result.current.contactsToReach)).toBe(true)
  })
})
