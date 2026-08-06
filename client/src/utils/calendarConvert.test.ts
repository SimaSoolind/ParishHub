// Enhetstester för kalender-konvertering (gregoriansk <-> juliansk)
// Rena funktioner — inget React, ingen mock behövs

import { describe, it, expect } from "vitest"
import { julianToGregorian, gregorianToJulian } from "./calendarConvert"

describe("calendarConvert", () => {
  it("lägger till 13 dagar från juliansk till gregoriansk", () => {
    const julian = new Date("2026-01-07T00:00:00") // ortodox jul (juliansk)
    const gregorian = julianToGregorian(julian)
    // 7 jan + 13 dagar = 20 jan
    expect(gregorian.getMonth()).toBe(0) // januari
    expect(gregorian.getDate()).toBe(20)
  })

  it("drar bort 13 dagar från gregoriansk till juliansk", () => {
    const gregorian = new Date("2026-01-20T00:00:00")
    const julian = gregorianToJulian(gregorian)
    expect(julian.getDate()).toBe(7)
  })

  it("är omvändbar (fram och tillbaka ger samma datum)", () => {
    const start = new Date("2026-08-06T00:00:00")
    const roundTrip = gregorianToJulian(julianToGregorian(start))
    expect(roundTrip.getTime()).toBe(start.getTime())
  })
})
