// formErrors — samlar Zod-valideringsfel till en karta { fält: meddelande }
// Bryts ut eftersom exakt samma loop upprepades i alla formulär-modaler (DRY)
// Ren logik utan React — lätt att testa och återanvända
//
// Används av: AddMemberModal, AddEventModal, AddServiceModal, SermonModal,
// ReminderModal, SacramentModal

import type { ZodError } from "zod"

// Gör om Zods fellista till en karta med det FÖRSTA felet per fält
// Tar ett ZodError (från safeParse när valideringen misslyckas)
// Returnerar { fältnamn: felmeddelande } — bara första felet per fält behålls,
// så formuläret visar ett tydligt meddelande per fält i stället för flera
export function collectFieldErrors(error: ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {}
  for (const issue of error.issues) {
    const field = String(issue.path[0])
    if (!fieldErrors[field]) fieldErrors[field] = issue.message
  }
  return fieldErrors
}
