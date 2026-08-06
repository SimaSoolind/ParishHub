// memberSchema — Zod-validering för medlemsformuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av AddMemberModal
//
// Felmeddelanden sätts inte här — de översätts globalt via zodErrorMap (svenska/arabiska)
//
// Säkerhetstänk i reglerna:
// - trim + toLowerCase på e-post sanerar och förhindrar dubbletter (Anna vs anna)
// - regex på telefon släpper bara igenom siffror, +, mellanslag och bindestreck
// - max-gränser hindrar att någon klistrar in enorma mängder text (DoS-skydd)

import { z } from "zod"

export const newMemberSchema = z.object({
  name: z.string().trim().min(1).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{6,15}$/),
  // trim + toLowerCase sanerar värdet, sedan skickas det (pipe) till email-koll
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  address: z.string().trim().min(1).max(200),
  familySize: z.coerce.number().int().min(1).max(50),
  birthday: z.string().trim().min(1).max(20),
  category: z.enum(["adult", "youth", "leader", "other"]),
  preferredName: z.string().max(100).optional(),
  language: z.enum(["sv", "ar", "en", "el", "ru", "syr"]).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  familyRole: z.enum(["spouse", "child", "parent", "sibling"]).optional(),
  notes: z.string().max(500).optional(),
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
