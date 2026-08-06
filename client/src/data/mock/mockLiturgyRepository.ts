// mockLiturgyRepository — bygger liturgi-biblioteket från JSON-filer i data/liturgy/
// Två källor slås ihop:
//  1. Agbeya-samlingen (koptisk-agbeya/) — normaliseras från råtabeller (join)
//  2. Egna filer i enkelt format (title + blocks) direkt i data/liturgy/
// Allt valideras med Zod — trasiga filer hoppas över, inte kraschar appen
//
// Implementerar: LiturgyRepository. Byts mot apiLiturgyRepository när backend finns

import type { LiturgyRepository } from "../../domain/repositories/liturgyRepository"
import type { LiturgyScript, LiturgyBlock } from "../../domain/liturgy"
import {
  liturgyFileSchema,
  fileToScript,
  agbeyaSentencesSchema,
  agbeyaHoursSchema,
  agbeyaRelationsSchema,
} from "../../schemas/liturgySchema"

// Läser en glob-modul och returnerar dess default-innehåll (okänt tills validerat)
function contentOf(modules: Record<string, { default: unknown }>, endsWith: string): unknown {
  for (const path in modules) {
    if (path.endsWith(endsWith)) return modules[path]?.default
  }
  return undefined
}

// Normaliserar Agbeya-samlingen: joinar sentences + pray_hours + relations
// till en LiturgyScript per tidebön (8 stycken)
function loadAgbeya(): LiturgyScript[] {
  const modules = import.meta.glob("../liturgy/koptisk-agbeya/*.json", { eager: true }) as Record<
    string,
    { default: unknown }
  >

  const sentences = agbeyaSentencesSchema.safeParse(contentOf(modules, "sentences.json"))
  const hours = agbeyaHoursSchema.safeParse(contentOf(modules, "pray_hours.json"))
  const relations = agbeyaRelationsSchema.safeParse(contentOf(modules, "prays_relations.json"))
  if (!sentences.success || !hours.success || !relations.success) return []

  // Uppslag mening-id -> mening, för snabb join
  const sentenceById = new Map(sentences.data.map((s) => [s._id, s]))

  return hours.data.map((hour) => {
    // Meningarna som hör till bönen, i filens ordning (= läsordning)
    const blocks: LiturgyBlock[] = relations.data
      .filter((relation) => relation.pray_id === hour.pray_id)
      .map((relation, index): LiturgyBlock | null => {
        const sentence = sentenceById.get(relation.sentence_id)
        if (!sentence) return null
        return {
          id: "agbeya-" + hour.pray_id + "-" + index,
          // is_title > 0 betyder rubrik, annars vanlig textrad
          kind: sentence.is_title > 0 ? "heading" : "text",
          ar: sentence.arabic,
          sv: sentence.swedish,
        }
      })
      .filter((block): block is LiturgyBlock => block !== null)

    return { id: "agbeya-" + hour.pray_id, title: "Agbeya · " + hour.title_swedish, blocks }
  })
}

// Läser egna filer i enkelt format (title + blocks) direkt i data/liturgy/
function loadSimpleFiles(): LiturgyScript[] {
  const modules = import.meta.glob("../liturgy/*.json", { eager: true }) as Record<
    string,
    { default: unknown }
  >

  const scripts: LiturgyScript[] = []
  for (const path in modules) {
    const parsed = liturgyFileSchema.safeParse(modules[path]?.default)
    if (!parsed.success) continue // hoppa över filer som inte följer formatet

    // Filnamnet (utan mapp och .json) blir id-prefix
    const name = path.split("/").pop()?.replace(".json", "") ?? "liturgy"
    scripts.push(fileToScript(parsed.data, name))
  }
  return scripts
}

// Hela biblioteket läses en gång vid modulens start (filerna ändras inte i drift)
const library = [...loadAgbeya(), ...loadSimpleFiles()]

export const mockLiturgyRepository: LiturgyRepository = {
  getAll: async () => library,
}
