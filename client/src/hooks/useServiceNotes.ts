// useServiceNotes — presentation-hook för en gudstjänsts noteringar
// Använder ServiceNoteRepository, så komponenten slipper veta var datan kommer ifrån
// Returnerar noteringar + funktioner för att lägga till och ta bort
//
// Används av: NotesPanel

import { useState, useEffect } from "react"
import type { ServiceNote, NewServiceNoteData } from "../domain/serviceNote"
import { mockServiceNoteRepository as repository } from "../data/mock/mockServiceNoteRepository"

// Ger noteringarna för en gudstjänst och funktioner för att ändra dem
// Tar serviceId (vilken gudstjänst noteringarna hör till)
// Returnerar notes, loading, addNote och removeNote
export function useServiceNotes(serviceId: string) {
  const [notes, setNotes] = useState<ServiceNote[]>([])
  const [loading, setLoading] = useState(true)

  // Hämtar noteringarna när hooken används eller gudstjänsten byts
  useEffect(() => {
    repository.getByService(serviceId).then((list) => {
      setNotes(list)
      setLoading(false)
    })
  }, [serviceId])

  // Lägger till en notering och läser om listan
  const addNote = async (data: NewServiceNoteData) => {
    await repository.add(data)
    setNotes(await repository.getByService(serviceId))
  }

  // Tar bort en notering och läser om listan
  const removeNote = async (id: string) => {
    await repository.remove(id)
    setNotes(await repository.getByService(serviceId))
  }

  return { notes, loading, addNote, removeNote }
}
