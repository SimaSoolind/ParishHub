// sacramentSchema — Zod-validering för sakrament-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Återanvänder de gemensamma fält-byggarna i fields.ts (DRY)
// Används av SacramentModal
//
// Felmeddelanden översätts globalt via zodErrorMap (svenska/arabiska)

import { z } from "zod"
import { requiredText, optionalText, requiredDate } from "./fields"

export const newSacramentSchema = z.object({
  memberId: z.string().min(1),
  type: z.enum([
    "baptism",
    "chrismation",
    "firstCommunion",
    "confession",
    "marriage",
    "ordination",
    "unction",
    "funeral",
    "other",
  ]),
  date: requiredDate(),
  officiant: requiredText(100),
  place: optionalText(200),
  witnesses: optionalText(300),
  grade: optionalText(100),
  partnerId: z.string().optional(),
  certificateUrl: optionalText(500),
  notes: optionalText(1000),
})
