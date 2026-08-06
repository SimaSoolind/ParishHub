// useSacraments — presentation-hook för en medlems sakrament
// Använder SacramentRepository, så komponenten slipper veta var datan kommer ifrån
// Returnerar sakramenten (sorterade) + funktioner för att ändra dem
//
// Används av: SacramentPanel

import { useState, useEffect } from "react"
import type { Sacrament, NewSacramentData } from "../domain/sacrament"
import { mockSacramentRepository as repository } from "../data/mock/mockSacramentRepository"
import { sortSacramentsByDate } from "../use-cases/sacraments"

// Ger en medlems sakrament (i tidslinje) och funktioner för att ändra dem
// Tar memberId (vilken medlem sakramenten hör till)
// Returnerar sacraments, loading, addSacrament, updateSacrament och removeSacrament
export function useSacraments(memberId: string) {
  const [sacraments, setSacraments] = useState<Sacrament[]>([])
  const [loading, setLoading] = useState(true)

  // Läser om sakramenten från repositoryt (sorterade i tidslinje)
  const reload = async () => {
    setSacraments(sortSacramentsByDate(await repository.getByMember(memberId)))
  }

  // Hämtar sakramenten när hooken används eller medlemmen byts
  useEffect(() => {
    repository.getByMember(memberId).then((list) => {
      setSacraments(sortSacramentsByDate(list))
      setLoading(false)
    })
  }, [memberId])

  // Lägger till ett sakrament och läser om listan
  const addSacrament = async (data: NewSacramentData) => {
    await repository.add(data)
    await reload()
  }

  // Uppdaterar ett sakrament och läser om listan
  const updateSacrament = async (id: string, changes: Partial<NewSacramentData>) => {
    await repository.update(id, changes)
    await reload()
  }

  // Tar bort ett sakrament och läser om listan
  const removeSacrament = async (id: string) => {
    await repository.remove(id)
    await reload()
  }

  return { sacraments, loading, addSacrament, updateSacrament, removeSacrament }
}
