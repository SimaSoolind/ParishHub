// sermons — ren logik för predikobiblioteket (ingen React)
// Söker och filtrerar predikningar samt listar unika högtider för filtret
//
// Används av: Sermons-sidan

import type { Sermon } from "../domain/sermon"

// Filtrerar predikningar på söktext och (valfri) högtid, senast först
// Söktexten matchas mot titel, innehåll, bibeltext och högtid (skiftlägesokänsligt)
// Tom högtid ("") betyder alla högtider
// Returnerar en sorterad lista (nyaste datum överst)
export function filterSermons(sermons: Sermon[], query: string, feast: string): Sermon[] {
  const q = query.trim().toLowerCase()

  return sermons
    .filter((sermon) => feast === "" || sermon.feast === feast)
    .filter((sermon) => {
      if (q === "") return true
      const fields = [sermon.title, sermon.content, sermon.bibleText, sermon.feast]
      return fields.some((field) => field?.toLowerCase().includes(q))
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

// Plockar ut alla unika högtider som finns bland predikningarna (för filtret)
// Tar en lista med predikningar
// Returnerar högtiderna sorterade i bokstavsordning
export function getSermonFeasts(sermons: Sermon[]): string[] {
  const feasts = new Set<string>()
  for (const sermon of sermons) {
    if (sermon.feast) feasts.add(sermon.feast)
  }
  return [...feasts].sort()
}
