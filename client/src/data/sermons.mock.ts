// Tillfällig mockdata för predikobiblioteket
// Ersätts med riktig databas i vecka 5-6

import type { Sermon } from "../domain/sermon"

export const mockSermons: Sermon[] = [
  {
    id: "ser1",
    title: "Barmhärtighetens väg",
    date: "2026-08-02",
    bibleText: "Luk 6:36",
    feast: "Vanlig söndag",
    church: "S:t Markus",
    content: "Om att möta varandra med barmhärtighet och tålamod i vardagen.",
  },
  {
    id: "ser2",
    title: "Ljuset i fastan",
    date: "2026-03-15",
    bibleText: "Joh 8:12",
    feast: "Fastan",
    church: "S:t Markus",
    content: "Fastan som en tid av rening, bön och inre ljus.",
  },
  {
    id: "ser3",
    title: "Uppståndelsens glädje",
    date: "2026-04-12",
    bibleText: "Matt 28:6",
    feast: "Påsk",
    church: "S:t Markus",
    mediaUrl: "https://youtu.be/exempel",
    content: "Kristus är uppstånden! Om hoppet som uppståndelsen ger.",
  },
]
