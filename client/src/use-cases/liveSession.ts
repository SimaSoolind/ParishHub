// liveSession — ren affärslogik för transkript-segment (AI-tolkning live)
// Ingen React — lätt att testa separat
//
// Används av: useLiveSession och useLiveDisplay

import type { TranscriptSegment } from "../domain/liveSession"

// Lägger till ett segment, eller ersätter ett tidigare med samma sequence
// (så en preliminär rad byts ut mot sin slutgiltiga version — deduplicering)
// Tar nuvarande lista, det nya segmentet och max antal att spara (standard 50)
// Returnerar en ny lista (muterar inte originalet)
// Gränsen hindrar att listan växer oändligt under en lång gudstjänst
export function upsertSegment(
  segments: TranscriptSegment[],
  segment: TranscriptSegment,
  limit = 50
): TranscriptSegment[] {
  const existingIndex = segments.findIndex((s) => s.sequence === segment.sequence)

  let next: TranscriptSegment[]
  if (existingIndex >= 0) {
    // Ersätter det gamla segmentet på samma plats (behåller ordningen)
    next = segments.map((s, i) => (i === existingIndex ? segment : s))
  } else {
    next = [...segments, segment]
  }

  // Klipper bort de äldsta om listan blivit för lång
  return next.length > limit ? next.slice(next.length - limit) : next
}

// Hämtar det senaste segmentet (används av projektor-vyn som visar en fras stort)
// Tar listan med segment
// Returnerar sista segmentet eller undefined om listan är tom
export function latestSegment(segments: TranscriptSegment[]): TranscriptSegment | undefined {
  return segments[segments.length - 1]
}
