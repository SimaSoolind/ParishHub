// eventSchema — Zod-validering för event-formuläret (kalendern)
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av AddEventModal

import { z } from "zod"

export const newEventSchema = z.object({
  title: z.string().trim().min(1, "Titel krävs").max(100, "För lång titel"),
  date: z.string().min(1, "Datum krävs"),
  category: z.string(),
  notes: z.string().max(500, "Anteckningen är för lång").optional(),
})
