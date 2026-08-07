// reminderSchema — Zod-validering för påminnelse-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Återanvänder de gemensamma fält-byggarna i fields.ts (DRY)
// Används av ReminderModal
//
// Felmeddelanden översätts globalt via zodErrorMap (svenska/arabiska)

import { z } from "zod"
import { requiredText, optionalText } from "./fields"

export const newReminderSchema = z.object({
  name: requiredText(100),
  reason: requiredText(300),
  kind: z.enum(["manual", "grief", "commitment"]),
  dueDate: z.string().optional(),
  phone: optionalText(30),
  email: optionalText(200),
})
