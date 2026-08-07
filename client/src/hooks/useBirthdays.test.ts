// Test för useBirthdays — veckans födelsedagar via mock-repositoryt
// Smoke-test: hooken laddar utan att krascha och ger en lista

import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { useBirthdays } from "./useBirthdays"

describe("useBirthdays", () => {
  it("ger en lista med födelsedagar", async () => {
    const { result } = renderHook(() => useBirthdays())
    await waitFor(() => expect(Array.isArray(result.current)).toBe(true))
  })
})
