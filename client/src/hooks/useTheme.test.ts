// Tester för useTheme — ljust/mörkt läge sparat i localStorage + data-theme på <html>

import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useTheme } from "./useTheme"

const STORAGE_KEY = "parishhub-theme"

// Nollställer tema och lagring före varje test så de inte påverkar varandra
beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute("data-theme")
})

describe("useTheme", () => {
  it("är ljust som standard", () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("light")
  })

  it("växlar till mörkt, sätter data-theme och sparar valet", () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe("dark")
    expect(document.documentElement.dataset["theme"]).toBe("dark")
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark")
  })

  it("läser sparat tema vid start", () => {
    localStorage.setItem(STORAGE_KEY, "dark")
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe("dark")
  })
})
