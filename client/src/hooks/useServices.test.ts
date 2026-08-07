// Tester för useServices — gudstjänster + närvaro via mock-repositoryt

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useServices } from "./useServices"
import type { NewServiceData } from "../domain/service"

const newService: NewServiceData = {
  title: "Testgudstjänst",
  date: "2026-08-09",
  startTime: "10:00",
}

describe("useServices", () => {
  it("laddar gudstjänster och närvaro", async () => {
    const { result } = renderHook(() => useServices())
    await waitForLoaded(result)
    expect(result.current.services.length).toBeGreaterThan(0)
    expect(Array.isArray(result.current.attendance)).toBe(true)
  })

  it("lägger till och tar bort en gudstjänst", async () => {
    const { result } = renderHook(() => useServices())
    await waitForLoaded(result)

    const before = result.current.services.length
    await act(async () => {
      await result.current.addService(newService)
    })
    expect(result.current.services).toHaveLength(before + 1)

    const added = result.current.services.find((s) => s.title === "Testgudstjänst")!
    await act(async () => {
      await result.current.removeService(added.id)
    })
    expect(result.current.services).toHaveLength(before)
  })
})
