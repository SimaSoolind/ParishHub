// Sacrament — domän-entitet för ett registrerat sakrament kopplat till en medlem
// Ligger i domain/ — en ren datastruktur, oberoende av React och externa API:er
// Ortodoxa kyrkan har fyra sakrament som följer medlemmen genom livet
//
// Används av: repository, hook, SacramentPanel och SacramentModal

// SacramentType — de sakrament (och övrigt) som en medlem kan registrera
// Union type: bara dessa värden är tillåtna, annars varnar TypeScript
export type SacramentType =
  | "baptism" // Dop
  | "chrismation" // Myrrasmörjelse
  | "firstCommunion" // Första nattvard
  | "confession" // Bikt — bara datum, aldrig innehåll (sekretess)
  | "marriage" // Äktenskap — kopplar två medlemmar
  | "ordination" // Prästvigning
  | "unction" // Sjuksmörjelse
  | "funeral" // Begravning
  | "other" // Övrigt — prästen skriver fritt

// Ett registrerat sakrament. Vilka fält som används varierar per typ:
// - Dop/Myrrasmörjelse/Första nattvard/Äktenskap: officiant + vittnen
// - Äktenskap: kopplas dessutom till en annan medlem (partnerId)
// - Prästvigning: biskop (officiant) + grad, inga vittnen
// - Bikt: bara datum — innehållet lagras aldrig (sekretess)
// De valfria fälten fylls i beroende på typ
export type Sacrament = {
  id: string // Unikt id, skapas när sakramentet sparas
  memberId: string // Kopplar sakramentet till en medlem
  type: SacramentType // Vilket sakrament (eller övrigt) det är
  date: string // Datum i ISO-format, t.ex. "2019-05-12"
  officiant: string // Präst, eller biskop vid prästvigning
  place?: string | undefined // Kyrka/adress där sakramentet ägde rum
  witnesses?: string | undefined // Vittnen (fritext) — används bara för vissa typer
  grade?: string | undefined // Grad (diakon/präst/biskop) — bara vid prästvigning
  partnerId?: string | undefined // Äktenskap: id för den kopplade medlemmen (make/maka)
  certificateUrl?: string | undefined // Länk till officiellt intyg (PDF-generering kräver backend)
  notes?: string | undefined // Övrigt — fritext (används EJ för bikt, sekretess)
}

// NewSacramentData — formen på datan NÄR ett sakrament registreras (utan id än)
// Omit<Sacrament, "id"> betyder: samma fält som Sacrament, fast UTAN id (DRY)
export type NewSacramentData = Omit<Sacrament, "id">
