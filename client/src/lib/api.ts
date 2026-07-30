// api — säkra, återanvändbara nätverksanrop
// safeFetch samlar fetch + felhantering + valfri Zod-validering på ett ställe
// Använd denna istället för att anropa fetch() direkt
//
// Används av: copticApi.ts (och framtida API-anrop)

import type { ZodType } from "zod"
import { logError } from "./errorHandler"

// Hämtar JSON från en URL på ett säkert sätt
// url är adressen, schema är ett valfritt Zod-schema som validerar svaret i runtime
// Returnerar den validerade datan, eller kastar felet vidare (fångas av anroparen)
export async function safeFetch<T>(url: string, schema?: ZodType<T>): Promise<T> {
  try {
    const response = await fetch(url)

    // response.ok är false vid felkoder som 404 eller 500
    if (!response.ok) {
      throw new Error(`Anropet misslyckades (status ${response.status})`)
    }

    const data = await response.json()

    // Om ett schema skickas med valideras svaret i runtime (typer räcker inte)
    return schema ? schema.parse(data) : (data as T)
  } catch (error) {
    logError("safeFetch " + url, error)
    throw error
  }
}
