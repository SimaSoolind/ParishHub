// LiveStatusBadge — visar live-sessionens läge som en färgad Badge
// Bryts ut så både kontrollpanelen och projektor-vyn visar status likadant (DRY)
//
// Används av: LiveControl och LiveDisplay
// Bygger på: Badge

import { useTranslation } from "react-i18next"
import { Badge } from "./Badge"
import type { LiveStatus } from "../domain/liveSession"

// Färg per läge (Badge stödjer red/blue/green/amber)
const colorByStatus: Record<LiveStatus, "red" | "blue" | "green" | "amber"> = {
  idle: "blue",
  live: "red",
  paused: "amber",
  ended: "green",
}

// Ritar en Badge med rätt färg och översatt text för läget
// Tar emot status (sessionens läge)
// Returnerar badgen som JSX
export function LiveStatusBadge({ status }: { status: LiveStatus }) {
  const { t } = useTranslation()
  return <Badge color={colorByStatus[status]}>{t("live.status." + status)}</Badge>
}
