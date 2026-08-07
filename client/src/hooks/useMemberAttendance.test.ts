// Tester för useMemberAttendance — närvarohistorik + procent för en medlem
// Kontrollerar formen på resultatet (array + giltig procent), oberoende av mock-datan

import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useMemberAttendance } from "./useMemberAttendance"

describe("useMemberAttendance", () => {
  it("ger punkter och en giltig närvaro-procent", async () => {
    const { result } = renderHook(() => useMemberAttendance("m1"))
    await waitForLoaded(result)

    expect(Array.isArray(result.current.points)).toBe(true)
    expect(typeof result.current.rate).toBe("number")
    expect(result.current.rate).toBeGreaterThanOrEqual(0)
    expect(result.current.rate).toBeLessThanOrEqual(100)
  })
})
