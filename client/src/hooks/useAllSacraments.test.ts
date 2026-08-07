// Tester för useAllSacraments — alla sakrament (läs-endast) för översiktssidan

import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useAllSacraments } from "./useAllSacraments"

describe("useAllSacraments", () => {
  it("laddar en lista med sakrament", async () => {
    const { result } = renderHook(() => useAllSacraments())
    await waitForLoaded(result)
    expect(Array.isArray(result.current.sacraments)).toBe(true)
  })
})
