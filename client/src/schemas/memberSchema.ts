// memberSchema — Zod-validering för medlemsformuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Återanvänder de gemensamma fält-byggarna i fields.ts (DRY)
// Används av AddMemberModal
//
// Felmeddelanden sätts inte här — de översätts globalt via zodErrorMap (svenska/arabiska)

import { z } from "zod"
import { requiredText, optionalText, emailField } from "./fields"

export const newMemberSchema = z.object({
  name: requiredText(100),
  // Telefon har en egen regex (bara siffror, +, mellanslag och bindestreck)
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{6,15}$/),
  email: emailField(),
  address: requiredText(200),
  familySize: z.coerce.number().int().min(1).max(50),
  birthday: requiredText(20),
  category: z.enum(["adult", "youth", "leader", "other"]),
  preferredName: optionalText(100),
  language: z.enum(["sv", "ar", "en", "el", "ru", "syr"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  familyRole: z.enum(["spouse", "child", "parent", "sibling"]).optional(),
  notes: optionalText(500),
  // Valfri profilbild — uppladdad fil sparad som data-URL (base64)
  // Stor max eftersom base64-bilder är långa. Refine har eget meddelande
  // eftersom felet (fel filtyp) inte fångas av den generella felkartan
  photoUrl: z
    .string()
    .trim()
    .max(2_000_000)
    .refine((value) => value.startsWith("data:image/"), "Ogiltig bild")
    .optional(),
})
