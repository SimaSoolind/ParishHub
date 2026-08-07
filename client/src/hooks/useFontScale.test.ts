// Tester för useFontScale — textstorlek sparad i localStorage + CSS-variabel på <html>

import { describe, it, expect, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useFontScale } from "./useFontScale"

const STORAGE_KEY = "parishhub-font-scale"

beforeEach(() => localStorage.clear())

describe("useFontScale", () => {
  it("är 1 (100 %) som standard", () => {
    const { result } = renderHook(() => useFontScale())
    expect(result.current.scale).toBe(1)
  })

  it("ändrar skalan, sätter CSS-variabeln och sparar valet", () => {
    const { result } = renderHook(() => useFontScale())
    act(() => result.current.setScale(1.4))
    expect(result.current.scale).toBe(1.4)
    expect(document.documentElement.style.getPropertyValue("--font-scale")).toBe("1.4")
    expect(localStorage.getItem(STORAGE_KEY)).toBe("1.4")
  })

  it("läser sparad skala vid start", () => {
    localStorage.setItem(STORAGE_KEY, "2")
    const { result } = renderHook(() => useFontScale())
    expect(result.current.scale).toBe(2)
  })
})
