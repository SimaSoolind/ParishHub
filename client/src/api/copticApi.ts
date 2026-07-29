// copticApi — alla anrop till coptic.io samlas här på ett ställe
// Hooks importerar härifrån istället för att anropa fetch() direkt
// Det gör det lättare att hitta och felsöka API-anrop
//
// coptic.io är ett öppet API och kräver ingen nyckel

import type { CopticCelebrationDay } from "../types/coptic"

// Bas-URL till coptic.io-API:et
export const COPTIC_BASE_URL = "https://api.coptic.io/api"

// Hämtar kommande högtider från coptic.io
// days är antal dagar framåt som ska hämtas
// Om anropet misslyckas kastas felet vidare till useCopticCelebrations
export async function fetchCelebrations(
  days: number
): Promise<CopticCelebrationDay[]> {
  try {
    const url = `${COPTIC_BASE_URL}/celebrations/upcoming/list?days=${days}`

    // fetch() skickar en HTTP-förfrågan och väntar på svar från servern
    const response = await fetch(url)

    // response.ok är false om servern svarar med en felkod som 404 eller 500
    if (!response.ok) {
      throw new Error(`kan inte hämta högtider (status ${response.status})`)
    }

    // response.json() omvandlar svaret från text till ett JavaScript-objekt
    return await response.json()
  } catch (error) {
    console.error("fetchCelebrations: fel vid hämtning av högtider", error)
    // felet kastas vidare — react-query fångar det och kan försöka igen
    throw error
  }
}
