// liveMessageSchema — Zod-validering av meddelanden på live-kanalen
// Meddelanden kommer från en annan flik (BroadcastChannel) och måste valideras i
// runtime — typer finns bara vid bygge, och data utifrån får aldrig litas på blint
//
// Används av: lib/liveChannel

import { z } from "zod"

// Ett transkript-segment som skickas över kanalen
const segmentSchema = z.object({
  id: z.string(),
  speaker: z.enum(["priest", "deacon"]),
  sourceLanguage: z.enum(["ar", "sv"]),
  targetLanguage: z.enum(["ar", "sv"]),
  sourceText: z.string(),
  translatedText: z.string().optional(),
  status: z.enum(["partial", "final"]),
  sequence: z.number(),
  timestamp: z.number(),
})

// Kanalens meddelande: antingen ett nytt segment eller ett statusbyte
export const liveMessageSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("segment"), segment: segmentSchema }),
  z.object({
    type: z.literal("status"),
    status: z.enum(["idle", "live", "paused", "ended"]),
  }),
])

// Typen härleds från schemat så kod och validering aldrig kan gå isär
export type LiveMessage = z.infer<typeof liveMessageSchema>
