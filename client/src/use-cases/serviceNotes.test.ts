// Enhetstester för filterServiceNotes (sök-logik för noteringar)
// Ren funktion — inget React, ingen mock behövs

import { describe, it, expect } from "vitest"
import { filterServiceNotes } from "./serviceNotes"
import type { ServiceNote } from "../domain/serviceNote"

const notes: ServiceNote[] = [
  {
    id: "1",
    serviceId: "s1",
    type: "prayer",
    visibility: "private",
    text: "Be för Anna",
    createdAt: "2026-08-01T09:00:00.000Z",
  },
  {
    id: "2",
    serviceId: "s1",
    type: "sermon",
    visibility: "public",
    text: "Tema barmhärtighet",
    createdAt: "2026-08-01T09:05:00.000Z",
  },
]

describe("filterServiceNotes", () => {
  it("returnerar alla när söksträngen är tom", () => {
    expect(filterServiceNotes(notes, "")).toHaveLength(2)
  })

  it("matchar text skiftlägesokänsligt", () => {
    const result = filterServiceNotes(notes, "anna")
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe("1")
  })

  it("returnerar tom lista när inget matchar", () => {
    expect(filterServiceNotes(notes, "xyz")).toHaveLength(0)
  })
})
