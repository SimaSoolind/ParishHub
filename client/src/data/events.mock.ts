// Tillfällig mockdata för kalender-händelser
// Datum i ISO-format så react-big-calendar kan tolka dem
// Ersätts med riktig databas + Google Calendar i vecka 5-6

import type { ChurchEvent, LifeEvent } from "../domain/event"

// Koptisk-ortodoxa högtider och fastor
export const churchEvents: ChurchEvent[] = [
  {
    id: "c1",
    name: "Petrus och Paulus dag",
    date: "2026-06-22",
    category: "feast",
  },
  {
    id: "c2",
    name: "Apostlafastas slut",
    date: "2026-06-29",
    category: "fast",
  },
  {
    id: "c3",
    name: "Jungfru Marias högtid",
    date: "2026-07-07",
    category: "feast",
  },
]

// Kommande händelser i församlingen
export const lifeEvents: LifeEvent[] = [
  {
    id: "l1",
    title: "Dop — Familjen Svensson",
    date: "2026-06-29",
    category: "baptism",
  },
  {
    id: "l2",
    title: "Bröllop — Maria & Johan",
    date: "2026-07-15",
    category: "wedding",
  },
  {
    id: "l3",
    title: "Sjukbesök — Anna Lindgren",
    date: "2026-07-03",
    category: "sick-visit",
    notes: "Ta med bibel och bön",
  },
]
