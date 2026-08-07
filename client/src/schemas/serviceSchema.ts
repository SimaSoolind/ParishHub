// serviceSchema — Zod-validering för gudstjänst-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Återanvänder de gemensamma fält-byggarna i fields.ts (DRY)
// Används av AddServiceModal
//
// Felmeddelanden översätts globalt via zodErrorMap (svenska/arabiska)

import { z } from "zod"
import { requiredText, optionalText, requiredDate } from "./fields"

export const newServiceSchema = z.object({
  title: requiredText(100),
  date: requiredDate(),
  startTime: requiredDate(),
  endTime: z.string().optional(),
  notes: optionalText(500),
})
