// RecentContacts visar de medlemmar som senast kontaktats (kontakthistorik)
// Varje rad har namn, datum för kontakt och en statusetikett
// Notering: "av vem" läggs till när inloggning finns (kräver användar-id)
//
// Används av: Dashboard.tsx
// Bygger på: Badge, contactStatusInfo (delad status) och formatShortDate

import { History } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "./Badge"
import { contactStatusInfo } from "./contactStatus"
import type { Contact } from "../domain/contact"
import { formatShortDate } from "../utils/dateUtils"

interface Props {
  contacts: Contact[]
}

// Ritar en lista med senast kontaktade personer, en rad per person
// Tar emot en lista med Contact-objekt som prop
// Returnerar listan som JSX (eller ett tomt tillstånd om inga finns)
export function RecentContacts({ contacts }: Props) {
  const { t } = useTranslation()

  // Sant när ingen har kontaktats ännu
  const isEmpty = contacts.length === 0

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4">
        <History size={18} className="text-accent" />
        <h2 className="text-sm font-bold text-accent">{t("recentContacts.title")}</h2>
      </div>

      {isEmpty ? (
        <p className="text-sm text-faint italic">{t("recentContacts.empty")}</p>
      ) : (
        <ul className="divide-y divide-rows">
          {contacts.map((contact) => {
            // Plockar färg, ikon och text för personens status
            const status = contactStatusInfo[contact.status]

            return (
              <li key={contact.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-semibold text-strong">{contact.name}</div>
                  <div className="text-sm text-faint">
                    {contact.lastContactedAt
                      ? t("recentContacts.contactedOn", {
                          date: formatShortDate(contact.lastContactedAt),
                        })
                      : contact.reason}
                  </div>
                </div>

                <Badge color={status.color}>
                  <status.Icon size={12} aria-hidden="true" />
                  {t("priority.status." + status.key)}
                </Badge>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
