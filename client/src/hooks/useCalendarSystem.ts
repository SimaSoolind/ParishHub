// useCalendarSystem — custom hook som håller valt kalendersystem
// Gregoriansk (vanlig) eller juliansk (13 dagars förskjutning i ortodox tradition)
// Sparar valet i localStorage så det kommer ihåg mellan besök
// Not: full juliansk datumvisning byggs senare — hooken lagrar bara valet
//
// Används av: Settings-sidan

import { useState, useEffect } from "react"

// De enda tillåtna värdena
export type CalendarSystem = "gregorian" | "julian"

// Nyckeln som valet sparas under i localStorage
const STORAGE_KEY = "parishhub-calendar-system"

// Läser sparat kalendersystem och validerar det i runtime
// Returnerar "julian" om det är sparat, annars "gregorian" (standard)
function readStored(): CalendarSystem {
  const raw: unknown = localStorage.getItem(STORAGE_KEY)
  return raw === "julian" ? "julian" : "gregorian"
}

// Håller aktuellt kalendersystem och en funktion för att ändra det
// Tar inga argument
// Returnerar system (nuvarande) och setSystem (byter värde)
export function useCalendarSystem() {
  const [system, setSystem] = useState<CalendarSystem>(readStored)

  // Sparar valet varje gång det ändras
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, system)
  }, [system])

  return { system, setSystem }
}
