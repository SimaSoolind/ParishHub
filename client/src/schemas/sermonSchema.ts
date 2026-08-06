// sermonSchema — Zod-validering för predikan-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av SermonModal
//
// Felmeddelanden översätts globalt via zodErrorMap (svenska/arabiska)
// max-gränser hindrar att någon klistrar in enorma mängder text (DoS-skydd)

import { z } from "zod"

export const newSermonSchema = z.object({
  title: z.string().trim().min(1).max(100),
  date: z.string().trim().min(1),
  bibleText: z.string().max(200).optional(),
  feast: z.string().max(100).optional(),
  church: z.string().max(100).optional(),
  mediaUrl: z.string().max(500).optional(),
  content: z.string().max(10000).optional(),
})
