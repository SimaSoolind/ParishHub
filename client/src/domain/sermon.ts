// Sermon — domän-entitet för en predikan i predikobiblioteket
// Ligger i domain/ — en ren datastruktur, oberoende av React och externa API:er
// Prästen sparar predikningar med metadata för att kunna söka och återanvända dem
//
// Används av: repository, hook, Sermons-sidan

// En predikan med metadata. Bara titel och datum är obligatoriska
export type Sermon = {
  id: string
  title: string
  date: string // ISO-format: "2026-08-02"
  bibleText?: string | undefined // Bibeltext-referens (t.ex. "Luk 6:36")
  feast?: string | undefined // Högtid (t.ex. Fastan, Påsk)
  church?: string | undefined // Kyrka (fritext nu, kopplas till multi-kyrka senare)
  mediaUrl?: string | undefined // Länk till ljud eller video (fil-uppladdning kräver backend)
  content?: string | undefined // Transkription eller anteckningar
}

// NewSermonData — formen på datan när en predikan skapas (utan id)
export type NewSermonData = Omit<Sermon, "id">
