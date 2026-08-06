// liturgySchema — Zod-validering för liturgi-data (extern, valideras i runtime)
// Två format valideras här:
//  1. Enkelt fil-format (för uppladdning och egna biblioteksfiler)
//  2. Agbeya-samlingens råtabeller (sentences, pray_hours, prays_relations)
//
// Används av: liturgyLibrary (inläsning) och LiturgyUploadTab (uppladdning)

import { z } from "zod"
import type { LiturgyScript, LiturgyBlock } from "../domain/liturgy"

// ---- 1. Enkelt fil-format (title + blocks) ----

const blockSchema = z.object({
  kind: z.enum(["heading", "text", "sermon"]),
  ar: z.string().optional(),
  sv: z.string().optional(),
  bibleRef: z.string().optional(),
})

export const liturgyFileSchema = z.object({
  title: z.string(),
  blocks: z.array(blockSchema),
})

export type LiturgyFile = z.infer<typeof liturgyFileSchema>

// Gör om ett validerat fil-objekt till en LiturgyScript (sätter stabila id:n)
// Tar filen och ett id-prefix (t.ex. filnamn eller "upload")
// Returnerar en färdig LiturgyScript
export function fileToScript(file: LiturgyFile, idPrefix: string): LiturgyScript {
  const blocks: LiturgyBlock[] = file.blocks.map((block, index) => ({
    id: idPrefix + "-" + index,
    ...block,
  }))
  return { id: idPrefix, title: file.title, blocks }
}

// ---- 2. Agbeya-samlingens råtabeller ----

export const agbeyaSentencesSchema = z.array(
  z.object({
    _id: z.number(),
    arabic: z.string(),
    swedish: z.string(),
    is_title: z.number(), // 0 = text, >0 = rubrik
  })
)

export const agbeyaHoursSchema = z.array(
  z.object({
    pray_id: z.number(),
    title_swedish: z.string(),
    title_arabic: z.string(),
  })
)

export const agbeyaRelationsSchema = z.array(
  z.object({
    pray_id: z.number(),
    sentence_id: z.number(),
  })
)
