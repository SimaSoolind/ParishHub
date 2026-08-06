// Ett textsegment i en pagaende tolkningssession
// Skickas i realtid fran server via WebSocket
// Sekvensnummer anvands for deduplicering hos klienten
//
// Anvands av: InterpretationRepository, hooks, TranscriptFeed

import type { Language, Speaker, SegmentStatus } from "../types/interpretation.types"

export interface TranscriptSegment {
  // Unikt id — genereras med crypto.randomUUID() eller pa servern
  id: string

  // Vilken session detta segment tillhor
  sessionId: string

  // Vem som talade — prast eller diakon (manuellt valt av operator)
  speaker: Speaker

  // Sprak-riktning for just detta segment
  sourceLanguage: Language
  targetLanguage: Language

  // Ursprunglig transkription fran ASR (arabisk eller svensk)
  originalText: string

  // Oversattning — finns bara nar status = "final"
  // Partiella segment oversatts inte (kostnadseffektivt)
  translatedText?: string

  // partial = pagaende, final = klar (oversatt)
  status: SegmentStatus

  // Monotont okande — for deduplicering hos klienten
  sequence: number

  // ISO-tid nar segmentet skapades pa servern
  createdAt: string
}
