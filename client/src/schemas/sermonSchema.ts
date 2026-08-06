// sermonSchema — Zod-validering för predikan-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av SermonModal
//
// max-gränser hindrar att någon klistrar in enorma mängder text (DoS-skydd)

import { z } from "zod"

export const newSermonSchema = z.object({
  title: z.string().trim().min(1, "Titel krävs").max(100, "För lång titel"),
  date: z.string().trim().min(1, "Datum krävs"),
  bibleText: z.string().max(200, "För lång referens").optional(),
  feast: z.string().max(100, "För lång högtid").optional(),
  church: z.string().max(100, "För långt namn").optional(),
  mediaUrl: z.string().max(500, "För lång länk").optional(),
  content: z.string().max(10000, "Texten är för lång").optional(),
})
