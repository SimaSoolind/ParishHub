// eventSchema — Zod-validering för event-formuläret (kalendern)
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av AddEventModal
//
// Felmeddelanden översätts globalt via zodErrorMap (svenska/arabiska)

import { z } from "zod"

export const newEventSchema = z.object({
  title: z.string().trim().min(1).max(100),
  date: z.string().min(1),
  category: z.string(),
  notes: z.string().max(500).optional(),
})
