// Enhetstester för dateUtils (rena datum-hjälpfunktioner)
// Undviker exakta lokal-strängar för att inte bli miljöberoende

import { describe, it, expect } from "vitest"
import { getDateBox, getWeekday, formatShortDate } from "./dateUtils"

describe("getDateBox", () => {
  it("plockar ut rätt dag ur ett ISO-datum", () => {
    expect(getDateBox("2026-08-03").day).toBe("3")
  })

  it("ger en versal månadsförkortning", () => {
    const month = getDateBox("2026-08-03").month
    expect(month).toBe(month.toUpperCase())
    expect(month.length).toBeGreaterThan(0)
  })
})

describe("getWeekday", () => {
  it("ger en veckodag med stor första bokstav", () => {
    const weekday = getWeekday("2026-08-03")
    expect(weekday.length).toBeGreaterThan(0)
    expect(weekday.charAt(0)).toBe(weekday.charAt(0).toUpperCase())
  })
})

describe("formatShortDate", () => {
  it("innehåller dagen och saknar avslutande punkt", () => {
    const short = formatShortDate("2026-08-04")
    expect(short).toContain("4")
    expect(short.endsWith(".")).toBe(false)
  })
})
