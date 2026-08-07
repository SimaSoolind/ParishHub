// Tester för useServiceSummary — sammanfattningsrapport för en gudstjänst

import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useServiceSummary } from "./useServiceSummary"

describe("useServiceSummary", () => {
  it("bygger en sammanfattning med en numerisk närvarograd", async () => {
    const { result } = renderHook(() => useServiceSummary("s1"))
    await waitForLoaded(result)

    expect(result.current.summary).not.toBeNull()
    expect(typeof result.current.summary?.rate).toBe("number")
    expect(typeof result.current.summary?.averageRate).toBe("number")
  })
})
