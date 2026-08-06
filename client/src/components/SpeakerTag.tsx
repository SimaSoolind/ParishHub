// SpeakerTag — liten färgad tagg som visar vem som talar (Präst/Diakon)
// Bryts ut så både transkript-listan och projektorn kan visa talare likadant (DRY)
//
// Används av: TranscriptFeed (och kan återanvändas i projektor-vyn)
// Bygger på: Badge

import { useTranslation } from "react-i18next"
import { Badge } from "./Badge"
import type { Speaker } from "../domain/liveSession"

// Färg per talare — präst och diakon har olika färg så publiken ser vem som talar
const colorBySpeaker: Record<Speaker, "blue" | "amber"> = {
  priest: "blue",
  deacon: "amber",
}

// Ritar en Badge med rätt färg och översatt namn för talaren
// Tar emot speaker (vem som talar)
// Returnerar taggen som JSX
export function SpeakerTag({ speaker }: { speaker: Speaker }) {
  const { t } = useTranslation()
  return <Badge color={colorBySpeaker[speaker]}>{t("live.speaker." + speaker)}</Badge>
}
