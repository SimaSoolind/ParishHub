// Member — domän-entitet för en medlem
// Ligger i domain/ — en REN datastruktur, oberoende av React och externa API:er
// Detta är "sanningen" om hur en medlem ser ut, samlad på ETT ställe
//
// Används av: repository, hooks, komponenter och sidor

// MemberCategory — de fasta kategorier en medlem kan tillhöra
// Union type: bara dessa fyra värden är tillåtna, annars varnar TypeScript
export type MemberCategory =
  | "adult" // Vuxen
  | "youth" // Ungdom
  | "leader" // Ledare
  | "other" // Övrig

// MemberStatus — om medlemmen är aktiv eller inaktiv i församlingen
export type MemberStatus = "active" | "inactive"

// MemberLanguage — medlemmens språkpreferens (för kontakt och meddelanden)
// Flera språk stöds — kan utökas när fler språkgrupper finns i församlingen
export type MemberLanguage = "sv" | "ar" | "en" | "el" | "ru" | "syr"

// FamilyRole — medlemmens roll i hushållet/familjen
export type FamilyRole =
  | "spouse" // Make/maka
  | "child" // Barn
  | "parent" // Förälder
  | "sibling" // Syskon

// Komplett Member — används när medlemmen redan finns i systemet
// Varje fält beskriver en uppgift om personen
export type Member = {
  id: string // Unikt id, skapas när medlemmen sparas
  name: string // Fullständigt namn
  phone: string // Telefonnummer, används av ring-knappen
  email: string // E-post, används av mejla-knappen
  address: string // Gatuadress (gata, nummer, ort)
  familySize: number // Antal personer i familjen
  birthday: string // Födelsedag som text, t.ex. "5 aug"
  category: MemberCategory // Kategori (vuxen, ungdom, ledare eller övrig)
  notes?: string | undefined // Frivilligt fält för prästens egna anteckningar
  familyId?: string | undefined // Kod som kopplar ihop familjemedlemmar (samma kod = samma familj)
  photoUrl?: string | undefined // Länk till profilbild (valfritt) — annars visas initialer
  preferredName?: string | undefined // Föredraget namn (smeknamn) — visas vid sidan av namnet
  language?: MemberLanguage | undefined // Språkpreferens för kontakt (flera språk stöds)
  status?: MemberStatus | undefined // Aktiv eller inaktiv medlem (saknas = aktiv)
  familyRole?: FamilyRole | undefined // Roll i familjen (make/maka, barn, förälder, syskon)
}

// NewMemberData — formen på datan NÄR formuläret skickas in
// Vid det läget finns inget id än — det skapas först vid sparning
// Omit<Member, "id"> betyder: samma fält som Member, fast UTAN id (DRY)
export type NewMemberData = Omit<Member, "id">
