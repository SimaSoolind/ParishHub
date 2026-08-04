// PriorityList visar personer som prästen bör kontakta
// Varje rad har namn, anledning, statusetikett och en ring-knapp
// Ring-knappen öppnar telefonens uppringningsapp
//
// Används av: Dashboard.tsx
// Bygger på: Badge (visar status med färg)

import { PhoneCall, AlertCircle, PhoneOutgoing, CheckCircle2 } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "./Badge"
import type { Contact, ContactStatus } from "../domain/contact"

interface Props {
  contacts: Contact[]
}

// Kopplar varje status till färg, ikon och en översättnings-nyckel för Badge
// Ikonen gör statusen läsbar även för färgblinda (inte bara färg)
// Ligger utanför komponenten för att slippa återskapa vid varje rendering
const statusInfo: Record<
  ContactStatus,
  { color: "red" | "amber" | "green"; key: string; Icon: LucideIcon }
> = {
  "not-contacted": { color: "red", key: "notContacted", Icon: AlertCircle },
  attempted: { color: "amber", key: "attempted", Icon: PhoneOutgoing },
  answered: { color: "green", key: "answered", Icon: CheckCircle2 },
}

// Ritar en lista med kontakter, en rad per person
// Tar emot en lista med Contact-objekt som prop
// Returnerar listan som JSX
export function PriorityList({ contacts }: Props) {
  const { t } = useTranslation()

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4">
        <PhoneCall size={18} className="text-accent" />
        <h2 className="text-sm font-bold text-accent">{t("priority.title")}</h2>
      </div>

      <ul className="divide-y divide-rows">
        {contacts.map((contact) => {
          // Plockar färg och text för personens status
          const status = statusInfo[contact.status]

          return (
            <li key={contact.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-semibold text-strong">{contact.name}</div>
                <div className="text-sm text-faint">{contact.reason}</div>
              </div>

              <div className="flex items-center gap-3">
                <Badge color={status.color}>
                  <status.Icon size={12} aria-hidden="true" />
                  {t("priority.status." + status.key)}
                </Badge>

                <a
                  href={"tel:" + contact.phone}
                  className="p-2 rounded-full row-hover"
                  aria-label={t("common.call", { name: contact.name })}
                >
                  <PhoneCall size={20} className="text-accent" />
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
