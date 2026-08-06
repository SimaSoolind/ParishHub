// ServiceNote — domän-entitet för en notering kopplad till en gudstjänst
// Ligger i domain/ — en ren datastruktur, oberoende av React och externa API:er
// Prästen skriver noteringar (bönepunkter, predikotankar, sakrament, reflektioner)
//
// Används av: repository, hook, NotesPanel

// Typ av notering — styr färg/etikett i listan
export type ServiceNoteType =
  | "prayer" // Bönepunkt
  | "sermon" // Predikotanke
  | "sacrament" // Sakrament (dop, nattvard m.m.)
  | "reflection" // Personlig reflektion

// Synlighet — privat (bara prästen) eller offentlig (kan delas)
export type ServiceNoteVisibility = "private" | "public"

// En notering kopplad till EN gudstjänst
export type ServiceNote = {
  id: string
  serviceId: string
  type: ServiceNoteType
  visibility: ServiceNoteVisibility
  text: string
  createdAt: string // ISO-tid när noteringen skapades
}

// NewServiceNoteData — formen på datan när en notering skapas (utan id och tid)
export type NewServiceNoteData = Omit<ServiceNote, "id" | "createdAt">
