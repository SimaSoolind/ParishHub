// youtube — ren logik för att göra en YouTube-länk till en inbäddnings-URL
// Stödjer vanliga format: watch?v=, youtu.be/, /live/ och /embed/
//
// Används av: StreamingPanel

// Plockar ut video-id (11 tecken) ur en YouTube-länk och bygger en embed-URL
// Tar en YouTube-länk som text
// Returnerar en embed-URL (https://www.youtube.com/embed/<id>) eller null om länken inte går att läsa
export function toYouTubeEmbed(url: string): string | null {
  const trimmed = url.trim()
  if (trimmed === "") return null

  // Olika YouTube-format — video-id:t är alltid 11 tillåtna tecken
  const patterns = [
    /[?&]v=([\w-]{11})/, // watch?v=ID
    /youtu\.be\/([\w-]{11})/, // youtu.be/ID
    /\/live\/([\w-]{11})/, // /live/ID
    /\/embed\/([\w-]{11})/, // /embed/ID
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`
  }

  return null
}
