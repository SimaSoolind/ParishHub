// Event — domän-entiteter för kyrko-kalendern
// Ligger i domain/ — rena datastrukturer, oberoende av React och externa API:er
//
// TODO: När backend finns ska prästen kunna skapa egna kategorier för LifeEvent

// Kategorier för kyrko-händelser (högtid eller fasta)
export type ChurchEventCategory = "feast" | "fast"

// Kategorier för livs-händelser i församlingen
export type LifeEventCategory =
  | "baptism" // Dop
  | "wedding" // Bröllop
  | "funeral" // Begravning
  | "sick-visit" // Sjukbesök
  | "other" // Övrigt

// En koptisk högtid eller fasta (källdata — statisk)
export type ChurchEvent = {
  id: string
  name: string
  date: string
  category: ChurchEventCategory
}

// En händelse i församlingen som prästen planerar (källdata — dynamisk)
export type LifeEvent = {
  id: string
  title: string
  date: string
  category: LifeEventCategory
  notes?: string | undefined
}

// CalendarEvent — det ENHETLIGA eventet som appen visar och hanterar
// start/end är Date eftersom react-big-calendar kräver det
export type CalendarEvent = {
  id: string
  title: string
  start: Date
  end: Date
  category: string
  notes?: string | undefined
  // Sant för koptiska högtider — dessa kan inte ändras eller raderas
  isReadOnly?: boolean
}

// NewEventData — formen på datan när prästen skapar eller ändrar ett event
export type NewEventData = {
  title: string
  date: string
  category: string
  notes?: string | undefined
}
