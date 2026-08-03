// useBirthdays — presentation-hook som hämtar veckans födelsedagar
// Använder BirthdayRepository, så komponenten slipper veta var datan kommer ifrån
// Returnerar en klar lista med födelsedagar
//
// Används av: Dashboard.tsx

import { useState, useEffect } from "react"
import type { Birthday } from "../domain/birthday"
import { mockBirthdayRepository as repository } from "../data/mock/mockBirthdayRepository"

export function useBirthdays() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([])

  // Hämtar födelsedagarna när hooken används första gången
  useEffect(() => {
    repository.getAll().then(setBirthdays)
  }, [])

  return birthdays
}
