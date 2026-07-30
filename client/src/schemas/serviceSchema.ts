// serviceSchema — Zod-validering för gudstjänst-formuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av AddServiceModal
//
// max-gränser hindrar att någon klistrar in enorma mängder text (DoS-skydd)

import { z } from "zod"

export const newServiceSchema = z.object({
  title: z.string().trim().min(1, "Titel krävs").max(100, "För lång titel"),
  date: z.string().trim().min(1, "Datum krävs"),
  startTime: z.string().trim().min(1, "Starttid krävs"),
  endTime: z.string().optional(),
  notes: z.string().max(500, "Anteckningen är för lång").optional(),
})
