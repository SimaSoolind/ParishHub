// Tillfällig mockdata för sakrament
// Ersätts med riktig (krypterad) databas i vecka 5-6 — sakrament är GDPR art. 9

import type { Sacrament } from "../domain/sacrament"

export const mockSacraments: Sacrament[] = [
  {
    id: "sac1",
    memberId: "1",
    type: "baptism",
    date: "1990-06-10",
    officiant: "Fader Korollos",
    place: "S:t Markus koptiska kyrka",
    witnesses: "Maria Svensson, Johan Lindgren",
    certificateUrl: "https://exempel.se/intyg/dop-anna.pdf",
  },
  {
    id: "sac2",
    memberId: "1",
    type: "chrismation",
    date: "1990-06-10",
    officiant: "Fader Korollos",
    place: "S:t Markus koptiska kyrka",
    witnesses: "Maria Svensson",
  },
]
