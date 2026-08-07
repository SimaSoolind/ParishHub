// Tester för useLiturgyDraft — manuellt inskrivna liturgi-block per gudstjänst
// Visar mönstret för att testa en hook som hämtar/ändrar via ett (mock-)repository:
// renderHook + waitFor för async, act för ändringar

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useLiturgyDraft } from "./useLiturgyDraft"

describe("useLiturgyDraft", () => {
  it("börjar tomt när gudstjänsten saknar block", async () => {
    const { result } = renderHook(() => useLiturgyDraft("svc-tom"))
    await waitForLoaded(result)
    expect(result.current.blocks).toHaveLength(0)
  })

  it("lägger till och tar bort ett block", async () => {
    const { result } = renderHook(() => useLiturgyDraft("svc-crud"))
    await waitForLoaded(result)

    // Lägger till en rad
    await act(async () => {
      await result.current.addBlock({ kind: "text", ar: "آمين", sv: "Amen" })
    })
    expect(result.current.blocks).toHaveLength(1)
    expect(result.current.blocks[0]?.sv).toBe("Amen")

    // Tar bort samma rad
    const id = result.current.blocks[0]!.id
    await act(async () => {
      await result.current.removeBlock(id)
    })
    expect(result.current.blocks).toHaveLength(0)
  })
})
