// Event — beskriver alla typer av händelser i kyrko-kalendern
// Innehåller två olika event-typer:
//   1. ChurchEvent  — koptisk-ortodoxa högtider och fastor
//   2. LifeEvent    — händelser i församlingen (dop, bröllop, etc.)
//
// TODO: När backend finns ska prästen kunna skapa egna kategorier för LifeEvent

// Kategorier för kyrko-händelser (högtid eller fasta)
export type ChurchEventCategory = "feast" | "fast"

// Kategorier för livs-händelser i församlingen
// Kan utökas när prästen får skapa egna via UI
export type LifeEventCategory =
  | "baptism"      // Dop
  | "wedding"      // Bröllop
  | "funeral"      // Begravning
  | "sick-visit"   // Sjukbesök
  | "other"        // Övrigt — placeholder för framtida kategorier

// En koptisk högtid eller fasta i kyrko-kalendern
// Statisk data — samma varje år
export type ChurchEvent = {
  id: string
  name: string
  date: string
  category: ChurchEventCategory
}

// En händelse i församlingen som prästen planerar
// Dynamisk data — nya läggs till löpande
export type LifeEvent = {
  id: string
  title: string
  date: string
  category: LifeEventCategory
  notes?: string   // Frivilligt fält för anteckningar
}