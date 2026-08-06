// calendarConvert — omvandlar mellan gregoriansk och juliansk kalender
// För åren 1900–2099 ligger julianska kalendern 13 dagar EFTER den gregorianska
// (ortodox "gammalkalender"). Rena funktioner — lätta att testa och återanvända.
//
// Används av: EventModal (visar juliansk motsvarighet när juliansk kalender är vald)

// Skillnaden mellan kalendrarna 1900–2099
const JULIAN_OFFSET_DAYS = 13
const DAY_MS = 24 * 60 * 60 * 1000

// Omvandlar ett julianskt datum till gregorianskt (lägger till 13 dagar)
// Tar ett Date-objekt (tolkat som julianskt)
// Returnerar motsvarande gregorianska datum
export function julianToGregorian(date: Date): Date {
  return new Date(date.getTime() + JULIAN_OFFSET_DAYS * DAY_MS)
}

// Omvandlar ett gregorianskt datum till julianskt (drar bort 13 dagar)
// Tar ett Date-objekt (gregorianskt)
// Returnerar motsvarande julianska datum
export function gregorianToJulian(date: Date): Date {
  return new Date(date.getTime() - JULIAN_OFFSET_DAYS * DAY_MS)
}
