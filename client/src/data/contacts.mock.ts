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
    email: "anna.lindgren@exempel.se",
  },
  {
    id: "2",
    name: "Lars Eriksson",
    reason: "Frånvarande 2 veckor",
    status: "attempted",
    phone: "0709876543",
    email: "lars.eriksson@exempel.se",
    lastContactedAt: "2026-08-04",
  },
  {
    id: "3",
    name: "David Nasr",
    reason: "Sjuk - ville ha förbön",
    status: "answered",
    phone: "0703334444",
    email: "david.nasr@exempel.se",
    lastContactedAt: "2026-08-03",
  },
  {
    id: "4",
    name: "Sofia Karim",
    reason: "Ny besökare - välkomnad",
    status: "answered",
    phone: "0705556666",
    email: "sofia.karim@exempel.se",
    lastContactedAt: "2026-08-01",
  },
]
