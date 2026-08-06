// Reminder — domän-entitet för en manuell påminnelse som prästen skapar
// Ligger i domain/ — en ren datastruktur, oberoende av React och externa API:er
// Täcker manuella påminnelser, sorg (dödsfall) och åtaganden (löfte som löper ut)
//
// Används av: repository, hook, ReminderCard och ReminderModal

// Typ av påminnelse — styr etiketten som visas
export type ReminderKind =
  | "manual" // Egen påminnelse (prästen skriver fritt)
  | "grief" // Sorg — någon har förlorat en anhörig
  | "commitment" // Åtagande — ett löfte eller uppdrag löper ut

// En påminnelse som prästen skapat manuellt
export type Reminder = {
  id: string // Unikt id, skapas när påminnelsen sparas
  name: string // Vem påminnelsen gäller (namn eller familj)
  reason: string // Varför prästen ska höra av sig
  kind: ReminderKind // Typ (påminnelse/sorg/åtagande)
  dueDate?: string | undefined // Valfritt datum då kontakt ska ske (ISO)
  phone?: string | undefined // Valfritt telefonnummer (för Ring/WhatsApp)
  email?: string | undefined // Valfri e-post (för Mejla)
  done: boolean // Sant när prästen markerat påminnelsen som klar
  createdAt: string // När påminnelsen skapades (ISO-tid)
}

// NewReminderData — formen på datan NÄR en påminnelse skapas
// Id, createdAt och done sätts av systemet — inte i formuläret
export type NewReminderData = Omit<Reminder, "id" | "createdAt" | "done">
