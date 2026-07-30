// copticApi — alla anrop till coptic.io samlas här på ett ställe
// Hooks importerar härifrån istället för att anropa fetch() direkt
// Anropet går via safeFetch (lib/api.ts) som validerar svaret med Zod
//
// coptic.io är ett öppet API och kräver ingen nyckel

import { safeFetch } from "../lib/api"
import { copticCelebrationsSchema } from "../schemas/copticSchema"

// Bas-URL till coptic.io-API:et
export const COPTIC_BASE_URL = "https://api.coptic.io/api"

// Hämtar kommande högtider från coptic.io och validerar svaret i runtime
// days är antal dagar framåt som ska hämtas
// safeFetch loggar och kastar felet vidare om något går fel
export async function fetchCelebrations(days: number) {
  const url = `${COPTIC_BASE_URL}/celebrations/upcoming/list?days=${days}`
  return safeFetch(url, copticCelebrationsSchema)
}
