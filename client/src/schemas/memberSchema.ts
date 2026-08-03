// memberSchema — Zod-validering för medlemsformuläret
// Ligger i egen fil så samma regler kan återanvändas senare (t.ex. på backend)
// Används av AddMemberModal
//
// Säkerhetstänk i reglerna:
// - trim + toLowerCase på e-post sanerar och förhindrar dubbletter (Anna vs anna)
// - regex på telefon släpper bara igenom siffror, +, mellanslag och bindestreck
// - max-gränser hindrar att någon klistrar in enorma mängder text (DoS-skydd)

import { z } from "zod"

export const newMemberSchema = z.object({
  name: z.string().trim().min(1, "Namn krävs").max(100, "För långt namn"),
  phone: z.string().trim().regex(/^[0-9+\s-]{6,15}$/, "Ogiltigt telefonnummer"),
  // trim + toLowerCase sanerar värdet, sedan skickas det (pipe) till email-koll
  email: z.string().trim().toLowerCase().pipe(z.email("Ogiltig e-post").max(254, "För lång e-post")),
  address: z.string().trim().min(1, "Adress krävs").max(200, "För lång adress"),
  familySize: z.coerce.number().int().min(1, "Minst 1 person").max(50, "För stor familj"),
  birthday: z.string().trim().min(1, "Födelsedag krävs").max(20, "För lång text"),
  category: z.enum(["adult", "youth", "leader", "other"]),
  notes: z.string().max(500, "Anteckningen är för lång").optional(),
  // Valfri profilbild — uppladdad fil sparad som data-URL (base64)
  // Stor max eftersom base64-bilder är långa
  photoUrl: z
    .string()
    .trim()
    .max(2_000_000, "Bilden är för stor")
    .refine((value) => value.startsWith("data:image/"), "Ogiltig bild")
    .optional(),
})
