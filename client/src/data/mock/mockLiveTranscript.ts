// mockLiveTranscript — låtsas-data för AI-tolkning live
// Simulerar en STT-tjänst (t.ex. Speechmatics) som matar ut segment ett i taget
// Varje fras kommer först som "partial" (utan översättning) och sedan som "final"
// Ersätts av riktig speech-to-text + DeepL när backend finns
//
// Används av: useLiveSession

import type { Language, LanguageDirection, Speaker, SegmentStatus } from "../../domain/liveSession"

// En fras i båda språken (samma innehåll, olika språk)
interface Phrase {
  ar: string
  sv: string
}

// Ett händelse-objekt som strömmen matar ut (hooken lägger till id och tid)
export interface LiveEvent {
  speaker: Speaker
  sourceLanguage: Language
  targetLanguage: Language
  sourceText: string
  translatedText?: string
  status: SegmentStatus
  sequence: number
}

// Korta liturgiska fraser som spelas upp i en slinga (respektfullt, allmänt hållna)
export const liturgyScript: Phrase[] = [
  { ar: "باسم الآب والابن والروح القدس", sv: "I Faderns och Sonens och den Helige Andes namn" },
  { ar: "الرب مع جميعكم", sv: "Herren vare med er alla" },
  { ar: "لنصلِّ", sv: "Låt oss be" },
  { ar: "ارفعوا قلوبكم", sv: "Upplyft era hjärtan" },
  { ar: "لنشكر الرب", sv: "Låt oss tacka Herren" },
  { ar: "قدوس قدوس قدوس رب الصاباؤوت", sv: "Helig, helig, helig är härskarornas Herre" },
  { ar: "المجد لله في الأعالي", sv: "Ära vare Gud i höjden" },
  { ar: "السلام لجميعكم", sv: "Frid vare med er alla" },
  { ar: "آمين", sv: "Amen" },
]

// Väljer käll- och måltext utifrån vald riktning (AR->SV eller SV->AR)
// Tar en fras och riktningen
// Returnerar { sourceText, translatedText } i rätt språk
function textsFor(phrase: Phrase, direction: LanguageDirection) {
  if (direction.source === "ar") {
    return { sourceText: phrase.ar, translatedText: phrase.sv }
  }
  return { sourceText: phrase.sv, translatedText: phrase.ar }
}

// Matar ut segment i en slinga: först partial (utan översättning), sedan final
// Tar en callback, vald riktning, intervall och fördröjning till final (i ms)
// Returnerar en stopp-funktion som avbryter strömmen och alla väntande timers
// Kan återanvändas var som helst som vill simulera en live-ström
export function streamTranscript(
  onEvent: (event: LiveEvent) => void,
  direction: LanguageDirection,
  intervalMs = 3500,
  partialDelayMs = 900
): () => void {
  let index = 0
  // Väntande final-timers, så de kan avbrytas vid stopp
  const pending = new Set<ReturnType<typeof setTimeout>>()

  const timer = setInterval(() => {
    const phrase = liturgyScript[index % liturgyScript.length]
    if (!phrase) return

    const sequence = index
    // Präst och diakon turas om (jämnt tal = präst)
    const speaker: Speaker = index % 2 === 0 ? "priest" : "deacon"
    const { sourceText, translatedText } = textsFor(phrase, direction)

    // Preliminär rad — visas direkt, utan översättning
    onEvent({
      speaker,
      sourceLanguage: direction.source,
      targetLanguage: direction.target,
      sourceText,
      status: "partial",
      sequence,
    })

    // Slutgiltig rad — kommer strax efter med översättning, ersätter den preliminära
    const finalize = setTimeout(() => {
      pending.delete(finalize)
      onEvent({
        speaker,
        sourceLanguage: direction.source,
        targetLanguage: direction.target,
        sourceText,
        translatedText,
        status: "final",
        sequence,
      })
    }, partialDelayMs)
    pending.add(finalize)

    index++
  }, intervalMs)

  return () => {
    clearInterval(timer)
    pending.forEach((id) => clearTimeout(id))
    pending.clear()
  }
}
