// Enhetstester för calendarSync (gudstjänst/sakrament -> kalender-event)
// Rena funktioner — inget React, ingen mock behövs

import { describe, it, expect } from "vitest"
import { serviceToCalendarEvent, sacramentToCalendarEvent } from "./calendarSync"
import type { Service } from "../domain/service"
import type { Sacrament } from "../domain/sacrament"

describe("serviceToCalendarEvent", () => {
  it("bygger ett skrivskyddat event med start- och sluttid", () => {
    const service: Service = {
      id: "s1",
      title: "Söndagsgudstjänst",
      date: "2026-08-09",
      startTime: "10:00",
      endTime: "12:00",
    }
    const event = serviceToCalendarEvent(service)

    expect(event.id).toBe("service-s1")
    expect(event.title).toBe("Söndagsgudstjänst")
    expect(event.category).toBe("service")
    expect(event.isReadOnly).toBe(true)
    expect(event.start.getHours()).toBe(10)
    expect(event.end.getHours()).toBe(12)
  })

  it("använder en timme som längd när sluttid saknas", () => {
    const service: Service = { id: "s2", title: "Möte", date: "2026-08-09", startTime: "18:00" }
    const event = serviceToCalendarEvent(service)
    expect(event.end.getTime() - event.start.getTime()).toBe(60 * 60 * 1000)
  })
})

describe("sacramentToCalendarEvent", () => {
  it("sätter typ och medlemsnamn i titeln, skrivskyddat", () => {
    const sacrament: Sacrament = {
      id: "sac1",
      memberId: "1",
      type: "baptism",
      date: "2026-06-01",
      officiant: "Fader Korollos",
    }
    const event = sacramentToCalendarEvent(sacrament, "Dop", "Anna Lindgren")

    expect(event.id).toBe("sacrament-sac1")
    expect(event.title).toBe("Dop — Anna Lindgren")
    expect(event.category).toBe("sacrament")
    expect(event.isReadOnly).toBe(true)
  })
})
