// Kategori-data för händelser — EN gemensam källa för hela appen
// Undviker att samma mappning upprepas i flera filer (DRY)

import type { LifeEventCategory } from "../types/event"

// Kopplar internt kategori-värde (engelska) till svensk text som visas
// Nyckel = värdet som sparas, värde = texten användaren ser
// Används av EventModal och AddEventModal
export const categoryLabels: Record<string, string> = {
  feast: "Högtid",
  fast: "Fasta",
  baptism: "Dop",
  wedding: "Bröllop",
  funeral: "Begravning",
  "sick-visit": "Sjukbesök",
  other: "Övrigt",
  "coptic-feast": "Koptisk högtid",
}

// Kategorier som prästen kan välja i formuläret för nytt event
// Endast livs-händelser — kyrkliga högtider och fastor skapas inte manuellt
// Etiketterna hämtas från categoryLabels så texten bara finns på ett ställe
export const lifeEventCategoryOptions: { value: LifeEventCategory; label: string }[] = [
  { value: "baptism", label: categoryLabels.baptism },
  { value: "wedding", label: categoryLabels.wedding },
  { value: "funeral", label: categoryLabels.funeral },
  { value: "sick-visit", label: categoryLabels["sick-visit"] },
  { value: "other", label: categoryLabels.other },
]
