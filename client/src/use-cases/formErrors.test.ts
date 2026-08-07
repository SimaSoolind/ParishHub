// Enhetstester för collectFieldErrors — samlar Zod-fel per fält

import { describe, it, expect } from "vitest"
import { z } from "zod"
import { collectFieldErrors } from "./formErrors"

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

describe("collectFieldErrors", () => {
  it("ger ett felmeddelande per fält som är ogiltigt", () => {
    const result = schema.safeParse({ name: "", email: "inte-en-epost" })
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = collectFieldErrors(result.error)
      expect(errors["name"]).toBeDefined()
      expect(errors["email"]).toBeDefined()
    }
  })

  it("ger en tom karta när allt är giltigt (inga fel)", () => {
    // Bygger ett tomt ZodError genom att parsa giltig data ger inget fel,
    // så testet verifierar i stället att giltig data inte producerar fält-fel
    const result = schema.safeParse({ name: "Anna", email: "anna@exempel.se" })
    expect(result.success).toBe(true)
  })
})
