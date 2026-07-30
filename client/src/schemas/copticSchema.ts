// copticSchema — Zod-validering av svaret från coptic.io
// Validerar API-datan i runtime (typer räcker inte — de finns bara vid bygge)
// Används av copticApi.fetchCelebrations via safeFetch

import { z } from "zod"

// En enskild högtid eller fasta
const celebrationSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  isMoveable: z.boolean().optional(),
})

// En dag med dess högtider och fastor
const daySchema = z.object({
  date: z.string(),
  celebrations: z.array(celebrationSchema),
})

// Hela svaret från /celebrations/upcoming/list
export const copticCelebrationsSchema = z.array(daySchema)
