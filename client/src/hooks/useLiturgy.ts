// useLiturgy — presentation-hook som ger alla tillgängliga liturgier
// Använder LiturgyRepository, så komponenten slipper veta var datan kommer ifrån
//
// Används av: LiturgyScriptPanel

import { useState, useEffect } from "react"
import type { LiturgyScript } from "../domain/liturgy"
import { mockLiturgyRepository as repository } from "../data/mock/mockLiturgyRepository"

// Ger listan med förberedda liturgier (en per högtid)
// Tar inga argument
// Returnerar scripts (alla liturgier) och loading
export function useLiturgy() {
  const [scripts, setScripts] = useState<LiturgyScript[]>([])
  const [loading, setLoading] = useState(true)

  // Hämtar liturgierna en gång när hooken används
  useEffect(() => {
    repository.getAll().then((list) => {
      setScripts(list)
      setLoading(false)
    })
  }, [])

  return { scripts, loading }
}
