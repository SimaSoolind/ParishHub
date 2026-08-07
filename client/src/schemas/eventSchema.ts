// eventSchema — Zod-validering för event-formuläret (kalendern)
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Återanvänder de gemensamma fält-byggarna i fields.ts (DRY)
// Används av AddEventModal
//
// Felmeddelanden översätts globalt via zodErrorMap (svenska/arabiska)

import { z } from "zod"
import { requiredText, optionalText, requiredDate } from "./fields"

export const newEventSchema = z.object({
  title: requiredText(100),
  date: requiredDate(),
  category: z.string(),
  notes: optionalText(500),
})
