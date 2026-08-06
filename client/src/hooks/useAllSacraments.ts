// useAllSacraments — presentation-hook som hämtar ALLA sakrament (läs-endast)
// Används av översiktssidan för statistik och rapporter
// Själva registreringen sker per medlem via useSacraments — inte här
//
// Används av: Sacraments-sidan

import { useState, useEffect } from "react"
import type { Sacrament } from "../domain/sacrament"
import { mockSacramentRepository as repository } from "../data/mock/mockSacramentRepository"

// Ger alla sakrament i systemet
// Tar inga argument
// Returnerar sacraments och loading
export function useAllSacraments() {
  const [sacraments, setSacraments] = useState<Sacrament[]>([])
  const [loading, setLoading] = useState(true)

  // Hämtar alla sakrament när hooken används första gången
  useEffect(() => {
    repository.getAll().then((list) => {
      setSacraments(list)
      setLoading(false)
    })
  }, [])

  return { sacraments, loading }
}
