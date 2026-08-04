// errorHandler — samlad felhantering för hela appen
// Loggar fel internt (konsolen) — visar aldrig interna detaljer för användaren
//
// Används av: lib/api.ts, ErrorBoundary och try/catch-block

import { NetworkError, ValidationError, AuthError } from "./errors"

// Loggar ett fel internt med en beskrivande kontext
// context beskriver var felet hände, error är det fångade felet (unknown = säkert)
// Returnerar inget — bara loggning
export function logError(context: string, error: unknown): void {
  // I produktion kan detta skickas till en logg-tjänst istället för konsolen
  console.error(`[${context}]`, error)
}

// Ger ett generellt, användarvänligt felmeddelande
// Läcker aldrig interna detaljer (stack trace, sökvägar, SQL)
export function getUserMessage(): string {
  return "Något gick fel. Försök igen."
}

// Ger rätt i18n-nyckel för ett fångat fel baserat på dess typ
// Samlar instanceof-logiken på ETT ställe (DRY) — används i toast.error
// error är unknown (säkert) — kontrolleras med instanceof innan typen används
export function getErrorMessageKey(error: unknown): string {
  if (error instanceof NetworkError) return "common.errorNetwork"
  if (error instanceof ValidationError) return "common.errorValidation"
  if (error instanceof AuthError) return "common.errorAuth"
  return "common.errorGeneric"
}
