// errorHandler — samlad felhantering för hela appen
// Loggar fel internt (konsolen) — visar aldrig interna detaljer för användaren
//
// Används av: lib/api.ts, ErrorBoundary och try/catch-block

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
