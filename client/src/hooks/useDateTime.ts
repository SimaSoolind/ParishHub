// useDateTime — custom hook som räknar ut aktuellt datum och hälsning
// Returnerar formaterat svenskt datum och rätt hälsning beroende på tid
// Används på Dashboard för att slippa hårdkoda datum och tid
//
// Används av: Dashboard.tsx

// Räknar ut aktuellt datum och hälsning från datorns klocka
// Tar inga argument
// Returnerar ett objekt med date (formaterat datum) och greeting (hälsning)
export function useDateTime() {
  // Skapar ett Date-objekt med aktuell tid från datorn
  const now = new Date()

  // Räknar ut hälsning baserat på timme (0-23)
  const hour = now.getHours()
  let greeting: string

  if (hour >= 5 && hour < 11) {
    greeting = "God morgon"
  } else if (hour >= 11 && hour < 17) {
    greeting = "God dag"
  } else {
    greeting = "God kväll"
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
    greeting
  }
}
