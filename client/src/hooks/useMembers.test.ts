// Tester för useMembers — hämtar och ändrar medlemmar via mock-repositoryt
// Räknar relativt (före/efter) så testet inte beror på exakt antal i mock-datan

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useMembers } from "./useMembers"
import type { NewMemberData } from "../domain/member"

const newMember: NewMemberData = {
  name: "Test Testsson",
  phone: "0700000000",
  email: "test@test.se",
  address: "Gatan 1",
  familySize: 1,
  birthday: "1 jan",
  category: "adult",
}

describe("useMembers", () => {
  it("laddar medlemmar från repositoryt", async () => {
    const { result } = renderHook(() => useMembers())
    await waitForLoaded(result)
    expect(result.current.members.length).toBeGreaterThan(0)
  })

  it("lägger till och tar bort en medlem", async () => {
    const { result } = renderHook(() => useMembers())
    await waitForLoaded(result)

    const before = result.current.members.length
    await act(async () => {
      await result.current.addMember(newMember)
    })
    expect(result.current.members).toHaveLength(before + 1)

    const added = result.current.members.find((m) => m.name === "Test Testsson")!
    await act(async () => {
      await result.current.removeMember(added.id)
    })
    expect(result.current.members).toHaveLength(before)
  })
})
