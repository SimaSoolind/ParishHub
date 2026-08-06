// sacramentSchema — Zod-validering för sakrament-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av SacramentModal
//
// Felmeddelanden översätts globalt via zodErrorMap (svenska/arabiska)

import { z } from "zod"

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
  date: z.string().trim().min(1),
  officiant: z.string().trim().min(1).max(100),
  place: z.string().max(200).optional(),
  witnesses: z.string().max(300).optional(),
  grade: z.string().max(100).optional(),
  partnerId: z.string().optional(),
  certificateUrl: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
})
