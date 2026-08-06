// Enhetstester för countByCategory (medlemsstatistik per kategori)
// Ren funktion — inget React, ingen mock behövs

import { describe, it, expect } from "vitest"
import { countByCategory } from "./memberStats"
import type { Member } from "../domain/member"

// Minimal medlem med bara det countByCategory bryr sig om (kategori)
function member(id: string, category: Member["category"]): Member {
  return {
    id,
    name: "Test " + id,
    phone: "0700",
    email: id + "@x.se",
    address: "X",
    familySize: 1,
    birthday: "1 jan",
    category,
  }
}

const members: Member[] = [
  member("1", "adult"),
  member("2", "adult"),
  member("3", "youth"),
  member("4", "leader"),
]

describe("countByCategory", () => {
  it("räknar antal per kategori", () => {
    const result = countByCategory(members)
    expect(result).toEqual([
      { key: "adult", value: 2 },
      { key: "youth", value: 1 },
      { key: "leader", value: 1 },
    ])
  })

  it("tar inte med kategorier utan medlemmar", () => {
    const result = countByCategory(members)
    // "other" saknar medlemmar och ska inte finnas med
    expect(result.some((c) => c.key === "other")).toBe(false)
  })
})
