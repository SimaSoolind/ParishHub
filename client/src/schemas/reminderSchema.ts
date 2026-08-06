// reminderSchema — Zod-validering för påminnelse-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av ReminderModal
//
// Felmeddelanden översätts globalt via zodErrorMap (svenska/arabiska)

import { z } from "zod"

export const newReminderSchema = z.object({
  name: z.string().trim().min(1).max(100),
  reason: z.string().trim().min(1).max(300),
  kind: z.enum(["manual", "grief", "commitment"]),
  dueDate: z.string().optional(),
  phone: z.string().max(30).optional(),
  email: z.string().max(200).optional(),
})
