// useCopticCelebrations — hämtar koptiska högtider från coptic.io
// Filtrerar bort fastor och returnerar högtider i kalenderns event-format
// Högtiderna är skrivskyddade — de kan inte ändras eller raderas
//
// Själva API-anropet ligger i api/copticApi.ts (samlat på ett ställe)
// Används av: Calendar.tsx

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchCelebrations } from "../api/copticApi"

// Event-format som kalendern förstår (samma form som övriga events)
// isReadOnly markerar att det är en högtid som inte får ändras
export interface CopticFeastEvent {
  id: string
  title: string
  start: Date
  end: Date
  category: string
  isReadOnly: true
}

// Hämtar och omvandlar koptiska högtider till kalender-event
// Fastor filtreras bort — bara högtider ska visas i kalendern
// Tar antal dagar framåt (standard 365) och returnerar skrivskyddade event
export function useCopticCelebrations(days = 365): CopticFeastEvent[] {
  // useQuery sköter hämtning, cachning och fel automatiskt
  // queryKey: unikt namn på datan i cachen — samma nyckel = samma cache
  // queryFn: funktionen som gör själva hämtningen (från copticApi)
  // staleTime: hur länge datan räknas som färsk innan den hämtas på nytt
  const { data } = useQuery({
    queryKey: ["coptic-celebrations", days],
    queryFn: () => fetchCelebrations(days),
    staleTime: 1000 * 60 * 60 * 24, // en dag i millisekunder — högtider ändras sällan
  })

  // useMemo räknar bara om listan när datan faktiskt ändras
  // Utan useMemo skulle listan byggas om vid varje rendering (onödigt arbete)
  return useMemo(() => {
    // Medan datan hämtas är data undefined — då visas inga högtider
    if (!data) return []

    const events: CopticFeastEvent[] = []

    // Yttre loop: går igenom varje dag från API:et
    for (const day of data) {
      // Inre loop: en dag kan ha flera högtider
      for (const celebration of day.celebrations) {
        // Hoppar över fastor — bara högtider ska visas i kalendern
        if (celebration.type === "fast") continue

        // Omvandlar högtiden till kalenderns event-format
        events.push({
          id: "coptic-" + day.date + "-" + celebration.id,
          title: celebration.name,
          start: new Date(day.date),
          end: new Date(day.date),
          category: "coptic-feast",
          isReadOnly: true,
        })
      }
    }

    return events
  }, [data])
}
