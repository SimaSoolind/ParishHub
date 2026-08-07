// Tester för useReminders — manuella påminnelser via mock-repositoryt

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useReminders } from "./useReminders"
import type { NewReminderData } from "../domain/reminder"

const newReminder: NewReminderData = {
  name: "Test Testsson",
  reason: "Uppföljning",
  kind: "manual",
}

describe("useReminders", () => {
  it("skapar, markerar klar och tar bort en påminnelse", async () => {
    const { result } = renderHook(() => useReminders())
    await waitForLoaded(result)

    const before = result.current.reminders.length
    await act(async () => {
      await result.current.addReminder(newReminder)
    })
    expect(result.current.reminders).toHaveLength(before + 1)

    const added = result.current.reminders.find((r) => r.name === "Test Testsson")!
    expect(added.done).toBe(false)

    // Markera klar
    await act(async () => {
      await result.current.markDone(added.id)
    })
    const done = result.current.reminders.find((r) => r.id === added.id)!
    expect(done.done).toBe(true)

    // Ta bort
    await act(async () => {
      await result.current.removeReminder(added.id)
    })
    expect(result.current.reminders).toHaveLength(before)
  })
})
