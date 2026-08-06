// sacramentSchema — Zod-validering för sakrament-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av SacramentModal

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
  date: z.string().trim().min(1, "Datum krävs"),
  officiant: z.string().trim().min(1, "Officiant krävs").max(100, "För långt namn"),
  place: z.string().max(200, "För lång plats").optional(),
  witnesses: z.string().max(300, "För lång text").optional(),
  grade: z.string().max(100, "För lång grad").optional(),
  partnerId: z.string().optional(),
  certificateUrl: z.string().max(500, "För lång länk").optional(),
  notes: z.string().max(1000, "Texten är för lång").optional(),
})
