// Enhetstester för predikobibliotekets logik (sök, filter, högtider)
// Rena funktioner — inget React, ingen mock behövs

import { describe, it, expect } from "vitest"
import { filterSermons, getSermonFeasts } from "./sermons"
import type { Sermon } from "../domain/sermon"

const sermons: Sermon[] = [
  {
    id: "1",
    title: "Barmhärtighet",
    date: "2026-08-02",
    feast: "Vanlig söndag",
    content: "om nåd",
  },
  { id: "2", title: "Ljuset", date: "2026-03-15", feast: "Fastan", bibleText: "Joh 8:12" },
  { id: "3", title: "Uppståndelsen", date: "2026-04-12", feast: "Påsk" },
]

describe("filterSermons", () => {
  it("returnerar alla sorterade nyaste först när inget filter finns", () => {
    const result = filterSermons(sermons, "", "")
    expect(result.map((s) => s.id)).toEqual(["1", "3", "2"])
  })

  it("filtrerar på högtid", () => {
    const result = filterSermons(sermons, "", "Fastan")
    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe("2")
  })

  it("söker i titel och bibeltext skiftlägesokänsligt", () => {
    expect(filterSermons(sermons, "barmhärtighet", "")).toHaveLength(1)
    expect(filterSermons(sermons, "joh 8", "")).toHaveLength(1)
  })
})

describe("getSermonFeasts", () => {
  it("ger unika högtider i bokstavsordning", () => {
    expect(getSermonFeasts(sermons)).toEqual(["Fastan", "Påsk", "Vanlig söndag"])
  })
})
