// En pagaende tolkningssession — kopplas till en gudstjanst
// Innehaller aktuell riktning och talare (uppdateras manuellt av operator)
//
// Anvands av: InterpretationRepository, hooks, kontrollpanel

import type { LanguageDirection, Speaker } from "../types/interpretation.types"

export interface InterpretationSession {
  // Unikt session-id (uuid) — anvands i URL for projektor/watch
  id: string

  // Kopplar till Service.id i domanmodellen
  serviceId: string

  // ISO-tid nar sessionen startade
  startedAt: string

  // ISO-tid nar sessionen stoppades (undefined nar aktiv)
  endedAt?: string

  // Nuvarande sprak-riktning (kan andras under sessionen)
  direction: LanguageDirection

  // Vem som talar just nu (kan andras nar diakon tar over)
  currentSpeaker: Speaker
}
