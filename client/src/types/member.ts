// Member — beskriver en medlem i systemet
// Innehåller kontaktuppgifter, familjestorlek, kategori och anteckningar
// Används av MemberCard, Members-sidan och useMemberSearch
// TODO: kategorier ska bli helt dynamiska när backend (PostgreSQL) finns

// MemberCategory — de fasta kategorier en medlem kan tillhöra
// Union type: bara dessa fyra värden är tillåtna, annars varnar TypeScript
export type MemberCategory =
  | "adult"    // Vuxen
  | "youth"    // Ungdom
  | "leader"   // Ledare
  | "other"    // Övrig

// Komplett Member — används när medlemmen redan finns i systemet
// Varje fält beskriver en uppgift om personen
export type Member = {
  id: string               // Unikt id, skapas när medlemmen sparas
  name: string             // Fullständigt namn
  phone: string            // Telefonnummer, används av ring-knappen
  email: string            // E-post, används av mejla-knappen
  address: string          // Gatuadress (gata, nummer, ort)
  familySize: number       // Antal personer i familjen
  birthday: string         // Födelsedag som text, t.ex. "5 aug"
  category: MemberCategory  // Kategori (vuxen, ungdom, ledare eller övrig)
  notes?: string           // Frivilligt fält för prästens egna anteckningar
  familyId?: string        // Kod som kopplar ihop familjemedlemmar (samma kod = samma familj)
  photoUrl?: string        // Länk till profilbild (valfritt) — annars visas initialer
}

// NewMemberData — formen på datan NÄR formuläret skickas in
// Vid det läget finns inget id än — det skapas först vid sparning
// Omit<Member, "id"> betyder: samma fält som Member, fast UTAN id
// Fördel: Member är enda källan — ändras Member följer NewMemberData med (DRY)
export type NewMemberData = Omit<Member, "id">
