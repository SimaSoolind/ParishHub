// fields — gemensamma Zod-fält som återanvänds av alla formulär-scheman (DRY)
// Skriv regeln EN gång här; ändra på ETT ställe och den slår igenom överallt
// Samma scheman används i formulär nu och i API-validering när backend finns
//
// Används av: memberSchema, serviceSchema, sermonSchema, sacramentSchema,
// reminderSchema och eventSchema
//
// Felmeddelanden sätts inte här — de översätts globalt via zodErrorMap (svenska/arabiska)

import { z } from "zod"

// Obligatorisk kort text (namn, titel) — trimmad, 1..max tecken
// max-gränsen skyddar mot att någon klistrar in enorma mängder text (DoS-skydd)
export const requiredText = (max = 100) => z.string().trim().min(1).max(max)

// Valfri text — högst max tecken (tom är tillåten)
export const optionalText = (max: number) => z.string().max(max).optional()

// Obligatoriskt datum eller tid som text (formulärfält ger en sträng)
export const requiredDate = () => z.string().trim().min(1)

// Giltig e-post — trimmad och gemener (mot dubbletter som Anna vs anna), högst 254 tecken
export const emailField = () => z.string().trim().toLowerCase().pipe(z.email().max(254))
