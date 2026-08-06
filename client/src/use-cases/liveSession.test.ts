// Enhetstester för live-tolkningens rena logik
// Testar att segment läggs till, att final ersätter partial och senaste plockas ut

import { describe, it, expect } from "vitest"
import { upsertSegment, latestSegment } from "./liveSession"
import type { TranscriptSegment } from "../domain/liveSession"

// Bygger ett segment för test (status och sequence styrs in)
// Översättningen läggs bara till för final (partial saknar översättning)
function segment(sequence: number, status: "partial" | "final"): TranscriptSegment {
  const base: TranscriptSegment = {
    id: "id-" + sequence + "-" + status,
    speaker: "priest",
    sourceLanguage: "ar",
    targetLanguage: "sv",
    sourceText: "آمين",
    status,
    sequence,
    timestamp: sequence,
  }
  return status === "final" ? { ...base, translatedText: "Amen" } : base
}

describe("upsertSegment", () => {
  it("lägger till ett nytt segment sist utan att ändra originalet", () => {
    const original = [segment(1, "final")]
    const result = upsertSegment(original, segment(2, "final"))
    expect(result).toHaveLength(2)
    expect(result[1]?.sequence).toBe(2)
    expect(original).toHaveLength(1)
  })

  it("ersätter en partial med sin final (samma sequence)", () => {
    const list = upsertSegment([], segment(1, "partial"))
    const updated = upsertSegment(list, segment(1, "final"))
    expect(updated).toHaveLength(1) // ingen dubblett
    expect(updated[0]?.status).toBe("final")
    expect(updated[0]?.translatedText).toBe("Amen")
  })

  it("behåller bara de senaste när gränsen överskrids", () => {
    let list: TranscriptSegment[] = []
    for (let i = 1; i <= 5; i++) list = upsertSegment(list, segment(i, "final"), 3)
    expect(list).toHaveLength(3)
    expect(list.map((s) => s.sequence)).toEqual([3, 4, 5])
  })
})

describe("latestSegment", () => {
  it("returnerar sista segmentet", () => {
    const list = [segment(1, "final"), segment(2, "final")]
    expect(latestSegment(list)?.sequence).toBe(2)
  })

  it("returnerar undefined för tom lista", () => {
    expect(latestSegment([])).toBeUndefined()
  })
})
