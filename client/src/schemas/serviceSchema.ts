// serviceSchema — Zod-validering för gudstjänst-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av AddServiceModal
//
// Felmeddelanden översätts globalt via zodErrorMap (svenska/arabiska)
// max-gränser hindrar att någon klistrar in enorma mängder text (DoS-skydd)

import { z } from "zod"

export const newServiceSchema = z.object({
  title: z.string().trim().min(1).max(100),
  date: z.string().trim().min(1),
  startTime: z.string().trim().min(1),
  endTime: z.string().optional(),
  notes: z.string().max(500).optional(),
})
