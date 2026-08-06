// usePriorityContacts — "dagens lista": visar högst `limit` påminnelser och låter
// prästen markera Klar eller snooza en rad (döljer den från listan)
// Utan backend sparas inte valen — de nollställs vid omladdning
//
// Används av: PriorityList

import { useState } from "react"
import type { Contact } from "../domain/contact"

// Ger den begränsade, filtrerade listan + funktioner för att dölja rader
// Tar hela påminnelse-listan och hur många som ska visas (standard 5)
// Returnerar visible, remainingCount, total, markDone och snooze
export function usePriorityContacts(reminders: Contact[], limit = 5) {
  // Id:n som prästen har markerat Klar eller snoozat — döljs från listan
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  // Kvar att kontakta (efter dolda), samt de som faktiskt visas idag
  const remaining = reminders.filter((reminder) => !dismissed.has(reminder.id))
  const visible = remaining.slice(0, limit)

  // Döljer en rad (samma effekt för Klar och Snooza tills backend finns)
  const dismiss = (id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  return {
    visible,
    remainingCount: remaining.length,
    total: reminders.length,
    markDone: dismiss,
    snooze: dismiss,
  }
}
