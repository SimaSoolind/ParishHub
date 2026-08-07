// sermonSchema — Zod-validering för predikan-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Återanvänder de gemensamma fält-byggarna i fields.ts (DRY)
// Används av SermonModal
//
// Felmeddelanden översätts globalt via zodErrorMap (svenska/arabiska)

import { requiredText, optionalText, requiredDate } from "./fields"
import { z } from "zod"

export const newSermonSchema = z.object({
  title: requiredText(100),
  date: requiredDate(),
  bibleText: optionalText(200),
  feast: optionalText(100),
  church: optionalText(100),
  mediaUrl: optionalText(500),
  content: optionalText(10000),
})
