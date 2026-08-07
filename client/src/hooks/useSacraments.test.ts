// Tester för useSacraments — en medlems sakrament via mock-repositoryt

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useSacraments } from "./useSacraments"
import type { NewSacramentData } from "../domain/sacrament"

// Egen medlem så testet inte krockar med annan mock-data
const MEMBER_ID = "member-sac-test"

const newSacrament: NewSacramentData = {
  memberId: MEMBER_ID,
  type: "baptism",
  date: "2026-01-01",
  officiant: "Fader Korollos",
}

describe("useSacraments", () => {
  it("lägger till och tar bort ett sakrament", async () => {
    const { result } = renderHook(() => useSacraments(MEMBER_ID))
    await waitForLoaded(result)

    const before = result.current.sacraments.length
    await act(async () => {
      await result.current.addSacrament(newSacrament)
    })
    expect(result.current.sacraments).toHaveLength(before + 1)

    const added = result.current.sacraments.find((s) => s.type === "baptism")!
    await act(async () => {
      await result.current.removeSacrament(added.id)
    })
    expect(result.current.sacraments).toHaveLength(before)
  })
})
