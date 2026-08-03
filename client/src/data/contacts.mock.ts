// Tillfällig mockdata för kontaktlistan
// Ersätts med riktig databas i vecka 5-6

import type { Contact } from "../domain/contact"

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Anna Lindgren",
    reason: "Frånvarande 3 veckor",
    status: "not-contacted",
    phone: "0701234567",
  },
  {
    id: "2",
    name: "Lars Eriksson",
    reason: "Frånvarande 2 veckor",
    status: "attempted",
    phone: "0709876543",
  },
]
