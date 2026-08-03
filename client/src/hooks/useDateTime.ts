// useDateTime — custom hook som räknar ut aktuellt datum och hälsning
// Returnerar formaterat svenskt datum och rätt hälsning beroende på tid
// Används på Dashboard för att slippa hårdkoda datum och tid
//
// Används av: Dashboard.tsx

// Räknar ut aktuellt datum och hälsning från datorns klocka
// Tar inga argument
// Returnerar date (formaterat datum) och greetingKey (nyckel som översätts via i18n)
export function useDateTime() {
  // Skapar ett Date-objekt med aktuell tid från datorn
  const now = new Date()

  // Räknar ut hälsnings-nyckel baserat på timme (0-23)
  // Själva texten översätts i komponenten (God morgon / صباح الخير osv.)
  const hour = now.getHours()
  let greetingKey: string

  if (hour >= 5 && hour < 11) {
    greetingKey = "morning"
  } else if (hour >= 11 && hour < 17) {
    greetingKey = "day"
  } else {
    greetingKey = "evening"
  }

  // Formaterar datum på svenska
  // Exempel: "Söndag 27 juli 2026"
  const date = now.toLocaleDateString("sv-SE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  })

  // Första bokstaven i veckodagen med stor bokstav
  const formattedDate = date.charAt(0).toUpperCase() + date.slice(1)

  // Returnerar båda värden så komponenten kan använda dem
  return {
    date: formattedDate,
    greetingKey
  }
}
