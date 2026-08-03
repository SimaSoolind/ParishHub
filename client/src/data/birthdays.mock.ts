// Tillfällig mockdata för födelsedagar
// Ersätts med riktig databas i vecka 5-6

import type { Birthday } from "../domain/birthday"

export const mockBirthdays: Birthday[] = [
  {
    id: "1",
    name: "Maria Svensson",
    age: 52,
    when: "idag",
    phone: "0701234567",
  },
  {
    id: "2",
    name: "Johan Berg",
    age: 34,
    when: "om 2 dagar",
    phone: "0709876543",
  },
]
