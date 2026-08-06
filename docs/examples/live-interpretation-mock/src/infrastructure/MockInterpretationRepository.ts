// MockInterpretationRepository — simulerar en session utan backend
// Skickar dummy-segment var 3:e sekund sa UI kan byggas fritt
//
// Anvands av: LiveInterpretationPage under Vecka 1-8
// Byts mot WebSocketInterpretationRepository i Vecka 9+ (en import-rad)

import type { InterpretationRepository } from "../domain/repositories/InterpretationRepository"
import type { InterpretationSession } from "../domain/entities/InterpretationSession"
import type { TranscriptSegment } from "../domain/entities/TranscriptSegment"

// Sessions som ar aktiva just nu — anvands sa updateSettings kan hitta dem
const activeSessions = new Map<string, InterpretationSession>()

// Dummy-rader som repeteras — simulerar Fader Korollos som predikar
const DUMMY_SEGMENTS = [
  { ar: "باسم الآب والابن والروح القدس", sv: "I Faderns, Sonens och Helige Andes namn" },
  { ar: "اليوم نتحدث عن المحبة", sv: "Idag talar vi om karleken" },
  { ar: "المحبة صبورة ولطيفة", sv: "Karleken ar taligt och vanlig" },
  { ar: "المحبة لا تحسد", sv: "Karleken avundas inte" },
  { ar: "المحبة لا تتفاخر", sv: "Karleken skryter inte" },
]

export const mockInterpretationRepository: InterpretationRepository = {
  async start(serviceId, direction, speaker) {
    // Skapar en fejk-session och sparar den for uppslag i updateSettings
    const session: InterpretationSession = {
      id: crypto.randomUUID(),
      serviceId,
      startedAt: new Date().toISOString(),
      direction,
      currentSpeaker: speaker,
    }
    activeSessions.set(session.id, session)
    return session
  },

  async stop(sessionId) {
    const session = activeSessions.get(sessionId)
    if (session) {
      // Markerar sessionen som slut och tar bort ur cache
      session.endedAt = new Date().toISOString()
      activeSessions.delete(sessionId)
    }
  },

  async updateSettings(sessionId, changes) {
    // Byter riktning eller talare mitt i en session
    // I mock: bara uppdaterar cache — riktig backend broadcastar via WS
    const session = activeSessions.get(sessionId)
    if (session) {
      Object.assign(session, changes)
    }
  },

  subscribe(sessionId, onSegment) {
    // Startar en timer som skickar ett dummy-segment var 3:e sekund
    // Returnerar unsubscribe-funktion for att stoppa
    let sequence = 0

    const timer = setInterval(() => {
      const session = activeSessions.get(sessionId)
      if (!session) return

      sequence++
      const line = DUMMY_SEGMENTS[sequence % DUMMY_SEGMENTS.length]!

      // Anpassar original och oversattning efter aktuell riktning
      const isArToSv = session.direction.source === "ar"
      const segment: TranscriptSegment = {
        id: crypto.randomUUID(),
        sessionId,
        speaker: session.currentSpeaker,
        sourceLanguage: session.direction.source,
        targetLanguage: session.direction.target,
        originalText: isArToSv ? line.ar : line.sv,
        translatedText: isArToSv ? line.sv : line.ar,
        status: "final",
        sequence,
        createdAt: new Date().toISOString(),
      }
      onSegment(segment)
    }, 3000)

    return () => clearInterval(timer)
  },
}
