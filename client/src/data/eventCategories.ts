// Kategori-data för händelser — EN gemensam källa för hela appen
// Sjalva texterna ligger i översättningarna (locales) — hämtas via t("eventCategory.<värde>")
// Här finns bara listan med värden prästen kan välja i formuläret (DRY)

import type { LifeEventCategory } from "../types/event"

// Kategorier prästen kan välja i formuläret för nytt event
// Endast livs-händelser — kyrkliga högtider och fastor skapas inte manuellt
// Texten visas via t("eventCategory." + värde) i komponenten
export const lifeEventCategoryValues: LifeEventCategory[] = [
  "baptism",
  "wedding",
  "funeral",
  "sick-visit",
  "other",
]
