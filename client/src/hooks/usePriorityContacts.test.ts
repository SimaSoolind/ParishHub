// Tester för usePriorityContacts — "dagens lista" med gräns + dölj (klar/snooza)
// Ren logik utan API — lätt att testa med renderHook + act

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { usePriorityContacts } from "./usePriorityContacts"
import { makeContact } from "../test/factories"

const reminders = ["1", "2", "3", "4", "5", "6", "7"].map(makeContact)

describe("usePriorityContacts", () => {
  it("visar högst `limit` rader men räknar alla kvarvarande", () => {
    const { result } = renderHook(() => usePriorityContacts(reminders, 5))
    expect(result.current.visible).toHaveLength(5)
    expect(result.current.remainingCount).toBe(7)
    expect(result.current.total).toBe(7)
  })

  it("döljer en rad när den markeras klar", () => {
    const { result } = renderHook(() => usePriorityContacts(reminders, 5))
    const firstId = result.current.visible[0]!.id
    act(() => result.current.markDone(firstId))
    expect(result.current.remainingCount).toBe(6)
    // Fortfarande 5 synliga eftersom nästa rad fyller platsen
    expect(result.current.visible).toHaveLength(5)
    expect(result.current.visible.some((c) => c.id === firstId)).toBe(false)
  })
})
