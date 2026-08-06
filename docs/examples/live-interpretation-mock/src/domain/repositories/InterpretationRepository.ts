// Kontrakt for hur tolkningen ar tillganglig for UI:t
// UI:t vet INTE om implementationen ar mock eller riktig WebSocket
//
// Implementeras av:
//   - MockInterpretationRepository (Vecka 1-8, ingen backend)
//   - WebSocketInterpretationRepository (Vecka 9+, riktig backend)

import type { InterpretationSession } from "../entities/InterpretationSession"
import type { TranscriptSegment } from "../entities/TranscriptSegment"
import type { LanguageDirection, Speaker } from "../types/interpretation.types"

export interface InterpretationRepository {
  // Startar en ny session — returnerar session med id
  start(
    serviceId: string,
    direction: LanguageDirection,
    speaker: Speaker,
  ): Promise<InterpretationSession>

  // Stoppar en pagaende session
  stop(sessionId: string): Promise<void>

  // Uppdaterar riktning eller talare mitt i en session
  // Andringar broadcastas till projektor/watch i realtid
  updateSettings(
    sessionId: string,
    changes: Partial<Pick<InterpretationSession, "direction" | "currentSpeaker">>,
  ): Promise<void>

  // Prenumererar pa transkript-segment fran en session
  // Returnerar en unsubscribe-funktion for att sluta lyssna
  subscribe(
    sessionId: string,
    onSegment: (segment: TranscriptSegment) => void,
  ): () => void
}
