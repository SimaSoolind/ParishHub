// Contact — domän-entitet för en person som prästen bör kontakta
// Ligger i domain/ — en ren datastruktur, oberoende av React och externa API:er
// Används av: PriorityList och Attendance (ContactStatus)

// De lägen en kontakt kan ha
export type ContactStatus = "not-contacted" | "attempted" | "answered"

// En person i prioritetslistan
export type Contact = {
  id: string
  name: string
  reason: string
  status: ContactStatus
  phone: string
  // E-post för mejl-knappen (valfri — alla kontakter har inte e-post)
  email?: string | undefined
  // Datum då personen senast kontaktades (ISO "YYYY-MM-DD") — saknas om ingen kontakt skett
  // Vem som kontaktade läggs till när inloggning finns (kräver användar-id)
  lastContactedAt?: string
  // Prästens anteckning om personen — visas som kontext inför kontakt
  note?: string | undefined
}
