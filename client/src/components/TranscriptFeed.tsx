// TranscriptFeed — återanvändbar lista över transkript-segment
// Visar talare, källtext och (för final) översättning. Senaste segmentet överst
// Preliminära (partial) rader visas nedtonade och kursiva tills översättningen kommer
// Används av både kontrollpanelen och YouTube-vyn så samma JSX inte upprepas (DRY)
//
// Används av: LiveControl och StreamViewer

import type { TranscriptSegment } from "../domain/liveSession"
import { SpeakerTag } from "./SpeakerTag"

interface Props {
  segments: TranscriptSegment[]
  emptyText: string
}

// Ger klass för arabisk text (RTL + Cairo) om språket är arabiska, annars tom
// Tar ett språk ("ar" eller "sv")
// Returnerar en klass-sträng som kan läggas till på ett textelement
function scriptClass(language: "ar" | "sv"): string {
  return language === "ar" ? "arabic-text" : ""
}

// Ritar transkript-listan (senaste först) eller en tom-text om inget finns
// Tar emot segments (raderna) och emptyText (text när listan är tom)
// Returnerar listan som JSX
export function TranscriptFeed({ segments, emptyText }: Props) {
  if (segments.length === 0) {
    return <p className="text-faint italic">{emptyText}</p>
  }

  // Senaste segmentet visas överst — kopia så originalet inte muteras
  const newestFirst = [...segments].reverse()

  return (
    <ul className="space-y-3">
      {newestFirst.map((segment) => (
        <li
          key={segment.id}
          className={
            "border-b border-stone-100 pb-3 dark:border-stone-700 " +
            (segment.status === "partial" ? "opacity-60 italic" : "")
          }
        >
          <div className="mb-1">
            <SpeakerTag speaker={segment.speaker} />
          </div>
          {/* Källtext (det som sägs) — RTL om arabiska */}
          <p
            lang={segment.sourceLanguage}
            className={scriptClass(segment.sourceLanguage) + " text-soft"}
          >
            {segment.sourceText}
          </p>
          {/* Översättning visas bara för final (partial saknar översättning) */}
          {segment.translatedText && (
            <p
              lang={segment.targetLanguage}
              className={scriptClass(segment.targetLanguage) + " text-strong"}
            >
              {segment.translatedText}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
