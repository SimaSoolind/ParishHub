// Tillfällig mockdata för manuella påminnelser
// Ersätts med riktig databas i vecka 5-6

import type { Reminder } from "../domain/reminder"

export const mockReminders: Reminder[] = [
  {
    id: "rem1",
    name: "Familjen Nasr",
    reason: "Förlorat en anhörig — hör av dig och erbjud stöd",
    kind: "grief",
    phone: "0703334444",
    done: false,
    createdAt: "2026-08-04T09:00:00.000Z",
  },
  {
    id: "rem2",
    name: "Sofia Karim",
    reason: "Löftet om volontärarbete löper ut",
    kind: "commitment",
    dueDate: "2026-08-15",
    done: false,
    createdAt: "2026-08-05T09:00:00.000Z",
  },
]
