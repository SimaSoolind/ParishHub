// Enhetstester för getActiveReminders (aktiva påminnelser + sortering)
// Ren funktion — inget React, ingen mock behövs

import { describe, it, expect } from "vitest"
import { getActiveReminders } from "./reminders"
import type { Reminder } from "../domain/reminder"

// Testdata: en klar, en daterad och en odaterad påminnelse
const reminders: Reminder[] = [
  {
    id: "done",
    name: "A",
    reason: "x",
    kind: "manual",
    done: true,
    createdAt: "2026-08-01T00:00:00.000Z",
  },
  {
    id: "dated",
    name: "B",
    reason: "x",
    kind: "commitment",
    dueDate: "2026-08-20",
    done: false,
    createdAt: "2026-08-05T00:00:00.000Z",
  },
  {
    id: "undated",
    name: "C",
    reason: "x",
    kind: "grief",
    done: false,
    createdAt: "2026-08-02T00:00:00.000Z",
  },
]

describe("getActiveReminders", () => {
  it("tar bort klara påminnelser", () => {
    const result = getActiveReminders(reminders)
    expect(result.map((r) => r.id)).not.toContain("done")
  })

  it("lägger daterade före odaterade", () => {
    const result = getActiveReminders(reminders)
    // "dated" (har datum) ska ligga före "undated" (saknar datum)
    expect(result.map((r) => r.id)).toEqual(["dated", "undated"])
  })
})
