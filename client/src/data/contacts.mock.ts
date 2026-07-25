// Tillfallig mockdata for kontaktlistan
// Ersatts med riktig databas i vecka 5-6

import type { Contact } from "../types/contact"

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Anna Lindgren",
    reason: "Franvarande 3 veckor",
    status: "not-contacted",
    phone: "0701234567"
  },
  {
    id: "2",
    name: "Lars Eriksson",
    reason: "Franvarande 2 veckor",
    status: "attempted",
    phone: "0709876543"
  }
]