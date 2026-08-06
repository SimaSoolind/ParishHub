// serviceNotes — ren logik för gudstjänst-noteringar (ingen React)
// Filtrerar noteringar på söktext så listan går att söka i
//
// Används av: NotesPanel

import type { ServiceNote } from "../domain/serviceNote"

// Filtrerar noteringar vars text innehåller söksträngen (skiftlägesokänsligt)
// Tar en lista med noteringar och en söksträng
// Returnerar alla om söksträngen är tom, annars de som matchar
export function filterServiceNotes(notes: ServiceNote[], query: string): ServiceNote[] {
  const q = query.trim().toLowerCase()
  if (!q) return notes
  return notes.filter((note) => note.text.toLowerCase().includes(q))
}
