// dateUtils — rena hjälpfunktioner för datum (ingen React, inga beroenden)
// Samlade här (DRY) så samma datum-logik inte upprepas i flera filer
//
// Används av: Services, EventModal

// Dagens datum som ISO-sträng (YYYY-MM-DD) i lokal tid
// Byggs från lokala delar för att undvika tidszonsförskjutning
export function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Plockar ut dag och månad ur ett ISO-datum för en datum-box
// Splittar strängen manuellt för att undvika tidszons-buggar (t.ex. Safari)
export function getDateBox(dateString: string): { day: string; month: string } {
  const [year, month, day] = dateString.split("-").map(Number) as [number, number, number]
  const date = new Date(year, month - 1, day)
  const monthShort = date
    .toLocaleDateString("sv-SE", { month: "short" })
    .replace(".", "")
    .toUpperCase()
  return { day: String(day), month: monthShort }
}

// Ger veckodagen (med stor bokstav) för ett ISO-datum
export function getWeekday(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number) as [number, number, number]
  const date = new Date(year, month - 1, day)
  const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" })
  return weekday.charAt(0).toUpperCase() + weekday.slice(1)
}

// Formaterar ett Date-objekt till svenskt läsbart format
// Exempel: "Söndag 22 juni 2026"
export function formatLongDate(date: Date): string {
  const formatted = date.toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

// Formaterar ett ISO-datum till kort svenskt format, t.ex. "4 aug"
// Splittar strängen manuellt för att undvika tidszons-buggar (t.ex. Safari)
// Tar ett datum som ISO-text ("YYYY-MM-DD")
// Returnerar dag + kort månad utan punkt
export function formatShortDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number) as [number, number, number]
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" }).replace(".", "")
}
