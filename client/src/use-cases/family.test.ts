// Enhetstester för resolveFamilyId (familjekopplings-logik)
// Ren funktion — inget React, ingen mock behövs

import { describe, it, expect } from "vitest"
import { resolveFamilyId } from "./family"

describe("resolveFamilyId", () => {
  it("återanvänder den valda medlemmens familyId om det finns", () => {
    expect(resolveFamilyId("fam-1", undefined)).toBe("fam-1")
  })

  it("använder den andra medlemmens familyId om den valda saknar", () => {
    expect(resolveFamilyId(undefined, "fam-2")).toBe("fam-2")
  })

  it("prioriterar den valda medlemmens familyId före den andras", () => {
    expect(resolveFamilyId("fam-1", "fam-2")).toBe("fam-1")
  })

  it("skapar ett nytt id när ingen har familyId", () => {
    const result = resolveFamilyId(undefined, undefined)
    expect(typeof result).toBe("string")
    expect(result.length).toBeGreaterThan(0)
  })
})
