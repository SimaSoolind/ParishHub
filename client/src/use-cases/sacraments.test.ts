// Enhetstester för sakrament-logiken (sortering + vilka fält en typ använder)
// Rena funktioner testas utan React och utan mock — snabbt och förutsägbart
// Varje test beskriver VAD som förväntas och VARFÖR det är viktigt

import { describe, it, expect } from "vitest"
import {
  sortSacramentsByDate,
  usesWitnesses,
  usesGrade,
  usesPartner,
  usesContent,
  filterSacraments,
  getSacramentYears,
} from "./sacraments"
import type { Sacrament } from "../domain/sacrament"

// Testdata: två sakrament i "fel" ordning (nyast först) så sorteringen syns tydligt
// Äktenskap (2015) ligger före dop (1990) i listan — sorteringen ska vända på det
const sacraments: Sacrament[] = [
  { id: "2", memberId: "1", type: "marriage", date: "2015-07-01", officiant: "X" },
  { id: "1", memberId: "1", type: "baptism", date: "1990-06-10", officiant: "X" },
]

describe("sortSacramentsByDate", () => {
  it("sorterar äldst först utan att mutera originalet", () => {
    const result = sortSacramentsByDate(sacraments)

    // Dop (1990) ska nu ligga före äktenskap (2015) — tidslinje äldst först
    expect(result.map((s) => s.id)).toEqual(["1", "2"])

    // Funktionen får INTE ändra på inskickade listan (ren funktion, ingen sidoeffekt)
    expect(sacraments.map((s) => s.id)).toEqual(["2", "1"])
  })
})

describe("usesWitnesses", () => {
  // Vittnen finns på dop, myrrasmörjelse, första nattvard och äktenskap
  // Formuläret använder detta för att visa/dölja vittnes-fältet
  it("vittnen används för livssakramenten men inte övriga", () => {
    expect(usesWitnesses("baptism")).toBe(true)
    expect(usesWitnesses("chrismation")).toBe(true)
    expect(usesWitnesses("firstCommunion")).toBe(true)
    expect(usesWitnesses("marriage")).toBe(true)

    expect(usesWitnesses("confession")).toBe(false)
    expect(usesWitnesses("ordination")).toBe(false)
    expect(usesWitnesses("funeral")).toBe(false)
  })
})

describe("usesGrade / usesPartner", () => {
  // Grad (diakon/präst/biskop) är bara relevant vid prästvigning
  it("grad används bara för prästvigning", () => {
    expect(usesGrade("ordination")).toBe(true)
    expect(usesGrade("baptism")).toBe(false)
  })

  // Bara äktenskap kopplas till en annan medlem (make/maka)
  it("partner används bara för äktenskap", () => {
    expect(usesPartner("marriage")).toBe(true)
    expect(usesPartner("baptism")).toBe(false)
  })
})

describe("usesContent", () => {
  // Bikt får aldrig ha innehåll (sekretess) — övriga typer får ha anteckningar
  it("bikt saknar innehåll men övriga har det", () => {
    expect(usesContent("confession")).toBe(false)
    expect(usesContent("baptism")).toBe(true)
    expect(usesContent("other")).toBe(true)
  })
})

describe("filterSacraments / getSacramentYears", () => {
  // Blandade sakrament över två år för att testa filter och år-lista
  const list: Sacrament[] = [
    { id: "1", memberId: "1", type: "baptism", date: "2026-05-01", officiant: "X" },
    { id: "2", memberId: "2", type: "marriage", date: "2026-07-10", officiant: "X" },
    { id: "3", memberId: "3", type: "baptism", date: "2025-03-20", officiant: "X" },
  ]

  it("filtrerar på typ", () => {
    const result = filterSacraments(list, "baptism", "")
    expect(result.map((s) => s.id)).toEqual(["1", "3"])
  })

  it("filtrerar på år", () => {
    const result = filterSacraments(list, "", "2026")
    expect(result.map((s) => s.id)).toEqual(["2", "1"])
  })

  it("ger unika år, senaste först", () => {
    expect(getSacramentYears(list)).toEqual(["2026", "2025"])
  })
})
