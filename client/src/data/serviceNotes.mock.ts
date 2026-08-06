// Tillfällig mockdata för gudstjänst-noteringar
// Ersätts med riktig databas i vecka 5-6

import type { ServiceNote } from "../domain/serviceNote"

export const mockServiceNotes: ServiceNote[] = [
  {
    id: "n1",
    serviceId: "s3",
    type: "prayer",
    visibility: "private",
    text: "Be för Anna som varit sjuk en tid.",
    createdAt: "2026-08-01T09:00:00.000Z",
  },
  {
    id: "n2",
    serviceId: "s3",
    type: "sermon",
    visibility: "public",
    text: "Tema: barmhärtighet. Utgå från Luk 6:36.",
    createdAt: "2026-08-01T09:05:00.000Z",
  },
  {
    id: "n3",
    serviceId: "s3",
    type: "sacrament",
    visibility: "public",
    text: "Påminnelse: dop av Elias direkt efter gudstjänsten.",
    createdAt: "2026-08-01T09:10:00.000Z",
  },
]
