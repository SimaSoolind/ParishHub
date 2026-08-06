// Enhetstester för zodErrorMap
// Bevisar att Zod-fel får översatta meddelanden (svenska) via den globala felkartan

import { describe, it, expect, beforeAll } from "vitest"
import "../i18n" // startar i18n (standardspråk svenska)
import { installZodErrorMap } from "./zodErrorMap"
import { newServiceSchema } from "./serviceSchema"

// Kopplar in felkartan en gång innan testerna körs
beforeAll(() => installZodErrorMap())

// Plockar ut felmeddelandet för ett visst fält ur ett misslyckat parse
function messageFor(input: unknown, field: string): string | undefined {
  const result = newServiceSchema.safeParse(input)
  if (result.success) return undefined
  return result.error.issues.find((issue) => issue.path[0] === field)?.message
}

describe("zodErrorMap", () => {
  it("ger 'Obligatoriskt fält' för tomt textfält", () => {
    const message = messageFor({ title: "", date: "", startTime: "" }, "title")
    expect(message).toBe("Obligatoriskt fält")
  })

  it("ger 'Högst {max} tecken' när texten är för lång", () => {
    const message = messageFor(
      { title: "x".repeat(101), date: "2026-01-01", startTime: "10:00" },
      "title"
    )
    expect(message).toBe("Högst 100 tecken")
  })
})
