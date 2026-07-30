// Test för ErrorBoundary
// Verifierar att ett generellt meddelande visas och att interna detaljer
// (t.ex. felmeddelande/stack trace) INTE läcker till gränssnittet

import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ErrorBoundary } from "./ErrorBoundary"

// En komponent som medvetet kraschar för att testa felfångaren
function Bomb(): never {
  throw new Error("HEMLIG intern stack trace")
}

describe("ErrorBoundary", () => {
  it("visar ett generellt meddelande utan att läcka interna detaljer", () => {
    // Tystar React/console-felutskriften under testet
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    )

    // Det generella meddelandet visas för användaren
    expect(screen.getByText("Något gick fel")).toBeTruthy()

    // Det interna felet läcker INTE till gränssnittet
    expect(screen.queryByText(/HEMLIG intern stack trace/)).toBeNull()

    spy.mockRestore()
  })
})
