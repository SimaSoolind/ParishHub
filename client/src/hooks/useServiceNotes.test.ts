// Tester för useServiceNotes — noteringar per gudstjänst via mock-repositoryt

import { describe, it, expect } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { waitForLoaded } from "../test/hookHelpers"
import { useServiceNotes } from "./useServiceNotes"
import type { NewServiceNoteData } from "../domain/serviceNote"

// Egen serviceId så testet inte krockar med annan mock-data
const SERVICE_ID = "svc-notes-test"

const newNote: NewServiceNoteData = {
  serviceId: SERVICE_ID,
  type: "prayer",
  visibility: "private",
  text: "Kom ihåg att be för familjen",
}

describe("useServiceNotes", () => {
  it("lägger till och tar bort en notering", async () => {
    const { result } = renderHook(() => useServiceNotes(SERVICE_ID))
    await waitForLoaded(result)

    const before = result.current.notes.length
    await act(async () => {
      await result.current.addNote(newNote)
    })
    expect(result.current.notes).toHaveLength(before + 1)

    const added = result.current.notes.find((n) => n.text === newNote.text)!
    await act(async () => {
      await result.current.removeNote(added.id)
    })
    expect(result.current.notes).toHaveLength(before)
  })
})
