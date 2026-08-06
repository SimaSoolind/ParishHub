// zodErrorMap — global felkarta för Zod som översätter valideringsfel via i18n
// Zod 4 sätter en global karta med z.config. Kartan väljer meddelande efter feltyp,
// så samma validering ger svenska eller arabiska felmeddelanden utan text i schemana.
//
// Installeras en gång i i18n.ts (efter att i18n startat)
// Nycklarna ligger under errors.validation.* i locales

import { z } from "zod"
import i18n from "../i18n"

// Översätter en valideringsnyckel med i18n i det språk som är valt just nu
// Tar nyckelns slut (t.ex. "required") och ev. värden för interpolation
// Returnerar den översatta strängen
function tr(key: string, params?: Record<string, unknown>): string {
  return i18n.t("errors.validation." + key, params ?? {})
}

// Kopplar in den översatta felkartan globalt i Zod
// Tar inga argument och returnerar inget — anropas en gång vid appstart
// Kan återanvändas: all Zod-validering i appen får översatta fel automatiskt
export function installZodErrorMap(): void {
  z.config({
    // issue typas av z.config (Zods $ZodRawIssue) — narrowas via issue.code
    customError: (issue) => {
      switch (issue.code) {
        case "invalid_type":
          // Fel eller saknad typ — oftast ett tomt tal-fält eller helt tomt fält
          return issue.expected === "number" ? tr("invalidNumber") : tr("required")

        case "too_small": {
          const min = Number(issue.minimum)
          // För text betyder min 1 "obligatoriskt", högre min betyder minsta längd
          if (issue.origin === "string") {
            return min <= 1 ? tr("required") : tr("tooShort", { min })
          }
          return tr("min", { min })
        }

        case "too_big": {
          const max = Number(issue.maximum)
          return issue.origin === "string" ? tr("tooLong", { max }) : tr("max", { max })
        }

        case "invalid_format":
          // E-post får eget meddelande, övriga format (t.ex. telefon-regex) ett generellt
          return issue.format === "email" ? tr("invalidEmail") : tr("invalidFormat")

        case "invalid_value":
          // Värdet finns inte bland tillåtna val (enum)
          return tr("invalidChoice")

        default:
          return tr("invalid")
      }
    },
  })
}
