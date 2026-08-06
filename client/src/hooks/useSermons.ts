// useSermons — presentation-hook för predikobiblioteket
// Använder SermonRepository, så sidan slipper veta var datan kommer ifrån
// Returnerar predikningar + funktioner för att lägga till, ändra och ta bort
//
// Används av: Sermons-sidan

import { useState, useEffect } from "react"
import type { Sermon, NewSermonData } from "../domain/sermon"
import { mockSermonRepository as repository } from "../data/mock/mockSermonRepository"

// Ger predikningarna och funktioner för att ändra dem, via repositoryt
// Tar inga argument
// Returnerar sermons, loading, addSermon, updateSermon och removeSermon
export function useSermons() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)

  // Hämtar alla predikningar när hooken används första gången
  useEffect(() => {
    repository.getAll().then((list) => {
      setSermons(list)
      setLoading(false)
    })
  }, [])

  // Lägger till en predikan och läser om listan
  const addSermon = async (data: NewSermonData) => {
    await repository.add(data)
    setSermons(await repository.getAll())
  }

  // Uppdaterar en predikan och läser om listan
  const updateSermon = async (id: string, changes: Partial<NewSermonData>) => {
    await repository.update(id, changes)
    setSermons(await repository.getAll())
  }

  // Tar bort en predikan och läser om listan
  const removeSermon = async (id: string) => {
    await repository.remove(id)
    setSermons(await repository.getAll())
  }

  return { sermons, loading, addSermon, updateSermon, removeSermon }
}
