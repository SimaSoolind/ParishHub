// calendarSync — gör gudstjänster och sakrament till kalender-events (skrivskyddade)
// Så att de syns i kalendern tillsammans med egna event och koptiska högtider
// Registrering/ändring sker på respektive sida — därför isReadOnly i kalendern
//
// Används av: Calendar-sidan

import type { Service } from "../domain/service"
import type { Sacrament } from "../domain/sacrament"
import type { CalendarEvent } from "../domain/event"

// En timme i millisekunder (standard-längd när sluttid saknas)
const ONE_HOUR_MS = 60 * 60 * 1000

// Gör en gudstjänst till ett kalender-event
// Tar en gudstjänst
// Returnerar ett CalendarEvent (skrivskyddat — ändras på Gudstjänst-sidan)
export function serviceToCalendarEvent(service: Service): CalendarEvent {
  const start = new Date(service.date + "T" + service.startTime)
  const end = service.endTime
    ? new Date(service.date + "T" + service.endTime)
    : new Date(start.getTime() + ONE_HOUR_MS)
  return {
    id: "service-" + service.id,
    title: service.title,
    start,
    end,
    category: "service",
    isReadOnly: true,
  }
}

// Gör ett sakrament till ett kalender-event med typ + medlemmens namn i titeln
// Tar ett sakrament, en färdig typ-etikett och medlemmens namn
// Returnerar ett CalendarEvent (skrivskyddat — ändras på medlemmens sida)
export function sacramentToCalendarEvent(
  sacrament: Sacrament,
  typeLabel: string,
  memberName: string
): CalendarEvent {
  const start = new Date(sacrament.date + "T00:00:00")
  const end = new Date(start.getTime() + ONE_HOUR_MS)
  return {
    id: "sacrament-" + sacrament.id,
    title: typeLabel + " — " + memberName,
    start,
    end,
    category: "sacrament",
    isReadOnly: true,
  }
}
