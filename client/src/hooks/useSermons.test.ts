// Tester för useSermons — predikobiblioteket via mock-repositoryt

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useSermons } from "./useSermons"
import type { NewSermonData } from "../domain/sermon"

const newSermon: NewSermonData = {
  title: "Testpredikan",
  date: "2026-08-09",
}

describe("useSermons", () => {
  it("lägger till och tar bort en predikan", async () => {
    const { result } = renderHook(() => useSermons())
    await waitForLoaded(result)

    const before = result.current.sermons.length
    await act(async () => {
      await result.current.addSermon(newSermon)
    })
    expect(result.current.sermons).toHaveLength(before + 1)

    const added = result.current.sermons.find((s) => s.title === "Testpredikan")!
    await act(async () => {
      await result.current.removeSermon(added.id)
    })
    expect(result.current.sermons).toHaveLength(before)
  })
})
