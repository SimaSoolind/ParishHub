// liveSession — entiteter för AI-tolkning live (arabiska <-> svenska)
// Rena typer, ingen React eller API. Följer spec i docs/AI-TOLKNING.md (sektion 5)
//
// Används av: use-cases, hooks, lib och sidorna för live-tolkning

// Sessionens läge: väntar, spelar in, pausad eller avslutad
export type LiveStatus = "idle" | "live" | "paused" | "ended"

// Språk som stöds i tolkningen
export type Language = "ar" | "sv"

// Talare — två generiska taggar räcker för v1 (spec sektion 7)
export type Speaker = "priest" | "deacon"

// Ett segment är först preliminärt (partial) och blir sedan slutgiltigt (final)
export type SegmentStatus = "partial" | "final"

// Riktning på tolkningen: från källspråk till målspråk
export interface LanguageDirection {
  source: Language
  target: Language
}

// Ett transkriberat (och för final: översatt) segment
// sourceText är det som sägs (källspråk), translatedText är översättningen (målspråk)
// translatedText finns bara för final — partiella segment visas utan översättning
export interface TranscriptSegment {
  id: string
  speaker: Speaker
  sourceLanguage: Language
  targetLanguage: Language
  sourceText: string
  translatedText?: string | undefined
  status: SegmentStatus
  sequence: number // Löpnummer — används för att ersätta partial med final (deduplicering)
  timestamp: number // Millisekunder — för ordning och tid i vyn
}
