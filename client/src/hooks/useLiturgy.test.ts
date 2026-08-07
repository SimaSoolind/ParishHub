// Tester för useLiturgy — liturgi-biblioteket (Agbeya normaliserad från JSON)

import { describe, it, expect } from "vitest"
import { renderHook } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useLiturgy } from "./useLiturgy"

describe("useLiturgy", () => {
  it("laddar liturgier från biblioteket", async () => {
    const { result } = renderHook(() => useLiturgy())
    await waitForLoaded(result)

    // Agbeya-samlingen ger flera tideböner, så listan ska inte vara tom
    expect(result.current.scripts.length).toBeGreaterThan(0)
    expect(result.current.scripts[0]?.blocks.length).toBeGreaterThan(0)
  })
})
