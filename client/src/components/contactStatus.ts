// contactStatus — kopplar en kontaktstatus till färg, ikon och översättnings-nyckel
// Samlat på ETT ställe (DRY) så flera listor visar status på samma sätt
// Ikonen gör statusen läsbar även för färgblinda (inte bara färg)
//
// Används av: PriorityList, RecentContacts

import { AlertCircle, PhoneOutgoing, CheckCircle2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { ContactStatus } from "../domain/contact"

// Uppslag: status → färg (för Badge), nyckel (för i18n) och ikon
export const contactStatusInfo: Record<
  ContactStatus,
  { color: "red" | "amber" | "green"; key: string; Icon: LucideIcon }
> = {
  "not-contacted": { color: "red", key: "notContacted", Icon: AlertCircle },
  attempted: { color: "amber", key: "attempted", Icon: PhoneOutgoing },
  answered: { color: "green", key: "answered", Icon: CheckCircle2 },
}
