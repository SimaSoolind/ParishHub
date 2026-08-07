// Tester för useEvents — prästens egna kalender-händelser via mock-repositoryt

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useEvents } from "./useEvents"
import type { NewEventData } from "../domain/event"

const newEvent: NewEventData = {
  title: "Testhändelse",
  date: "2026-08-09",
  category: "other",
}

describe("useEvents", () => {
  it("lägger till och tar bort en händelse", async () => {
    const { result } = renderHook(() => useEvents())
    await waitForLoaded(result)

    const before = result.current.events.length
    await act(async () => {
      await result.current.addEvent(newEvent)
    })
    expect(result.current.events).toHaveLength(before + 1)

    const added = result.current.events.find((e) => e.title === "Testhändelse")!
    await act(async () => {
      await result.current.removeEvent(added.id)
    })
    expect(result.current.events).toHaveLength(before)
  })
})
