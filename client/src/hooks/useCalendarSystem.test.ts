// Tester för useCalendarSystem — håller valt kalendersystem i localStorage
// jsdom ger en localStorage att testa mot

import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useCalendarSystem } from "./useCalendarSystem"

const STORAGE_KEY = "parishhub-calendar-system"

// Nollställer localStorage före varje test så de inte påverkar varandra
beforeEach(() => localStorage.clear())

describe("useCalendarSystem", () => {
  it("är gregoriansk som standard när inget är sparat", () => {
    const { result } = renderHook(() => useCalendarSystem())
    expect(result.current.system).toBe("gregorian")
  })

  it("läser sparat värde vid start", () => {
    localStorage.setItem(STORAGE_KEY, "julian")
    const { result } = renderHook(() => useCalendarSystem())
    expect(result.current.system).toBe("julian")
  })

  it("sparar valet i localStorage när det ändras", () => {
    const { result } = renderHook(() => useCalendarSystem())
    act(() => result.current.setSystem("julian"))
    expect(result.current.system).toBe("julian")
    expect(localStorage.getItem(STORAGE_KEY)).toBe("julian")
  })
})
