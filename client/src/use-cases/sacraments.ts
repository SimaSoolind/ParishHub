// sacraments — ren logik för sakrament (ingen React)
// Sorterar sakrament i tidslinje och avgör vilka fält en viss typ använder
// Fält-reglerna delas mellan formuläret (visa/dölj) och sparningen (vad som sparas)
//
// Används av: SacramentPanel, SacramentModal, useSacraments

import type { Sacrament, SacramentType } from "../domain/sacrament"

// Sorterar sakrament i tidslinje, äldst först
// Tar en lista med sakrament
// Returnerar en ny sorterad lista (muterar inte originalet)
export function sortSacramentsByDate(sacraments: Sacrament[]): Sacrament[] {
  return [...sacraments].sort((first, second) => first.date.localeCompare(second.date))
}

// Avgör om en typ använder vittnen (dop, myrrasmörjelse, första nattvard, äktenskap)
// De övriga (bikt, prästvigning, sjuksmörjelse, begravning, övrigt) har inga vittnen
export function usesWitnesses(type: SacramentType): boolean {
  return (
    type === "baptism" || type === "chrismation" || type === "firstCommunion" || type === "marriage"
  )
}

// Avgör om en typ använder grad (bara prästvigning)
export function usesGrade(type: SacramentType): boolean {
  return type === "ordination"
}

// Avgör om en typ kopplas till en annan medlem (bara äktenskap)
export function usesPartner(type: SacramentType): boolean {
  return type === "marriage"
}

// Avgör om en typ får ha innehåll/anteckningar
// Bikt får ALDRIG ha innehåll — det är sekretessbelagt och lagras aldrig
export function usesContent(type: SacramentType): boolean {
  return type !== "confession"
}

// Filtrerar sakrament på typ och år (för översiktssidan), senaste datum först
// Tom typ ("") = alla typer, tomt år ("") = alla år
// Returnerar en sorterad lista
export function filterSacraments(
  sacraments: Sacrament[],
  type: SacramentType | "",
  year: string
): Sacrament[] {
  return sacraments
    .filter((sacrament) => type === "" || sacrament.type === type)
    .filter((sacrament) => year === "" || sacrament.date.startsWith(year))
    .sort((first, second) => second.date.localeCompare(first.date))
}

// Plockar ut alla unika år som finns bland sakramenten (för år-filtret)
// Tar en lista med sakrament
// Returnerar åren som text, senaste först
export function getSacramentYears(sacraments: Sacrament[]): string[] {
  const years = new Set(sacraments.map((sacrament) => sacrament.date.slice(0, 4)))
  return [...years].sort((first, second) => second.localeCompare(first))
}
