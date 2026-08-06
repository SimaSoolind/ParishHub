// Centrala typer for live-tolkning
// Definieras EN gang och importeras overallt (DRY)
// Anvands av: entiteter, repositories, hooks, komponenter

export type Language = "ar" | "sv"

export type Speaker = "priest" | "deacon"

export type SegmentStatus = "partial" | "final"

// Riktning for tolkningen — fran ett sprak till ett annat
export interface LanguageDirection {
  source: Language
  target: Language
}

// State-machine for en pagaende session
// Anvands av kontrollpanel + status-badge + logg
export type SessionState =
  | "idle"
  | "requesting-microphone"
  | "connecting"
  | "live"
  | "reconnecting"
  | "stopping"
  | "error"
