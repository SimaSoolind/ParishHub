// PriorityList visar prästens "dagens lista" — personer som bör kontaktas
// Varje rad har namn, anledning, statusetikett, kontaktknappar och Klar/Snooza
// Klar och Snooza döljer raden (sparas när backend finns)
//
// Används av: Dashboard.tsx
// Bygger på: Badge, ContactActions, contactStatusInfo och usePriorityContacts

import { PhoneCall, Check, Clock, PartyPopper } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "./Badge"
import { ContactActions } from "./ContactActions"
import { contactStatusInfo } from "./contactStatus"
import { usePriorityContacts } from "../hooks/usePriorityContacts"
import type { Contact } from "../domain/contact"

interface Props {
  contacts: Contact[]
}

// Ritar dagens kontaktlista med Klar/Snooza per rad
// Tar emot en lista med Contact-objekt (frånvaro-påminnelser) som prop
// Returnerar listan som JSX, eller ett positivt tomt läge när allt är avklarat
export function PriorityList({ contacts }: Props) {
  const { t } = useTranslation()

  // Hooken sköter "dagens X" + Klar/Snooza (döljer rader)
  const { visible, remainingCount, markDone, snooze } = usePriorityContacts(contacts)

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <PhoneCall size={18} className="text-accent" />
          <h2 className="text-sm font-bold text-accent">{t("priority.title")}</h2>
        </div>
        {/* Antal kvar att kontakta (efter dolda) */}
        {remainingCount > 0 && (
          <span className="text-xs text-faint">
            {t("priority.remaining", { count: remainingCount })}
          </span>
        )}
      </div>

      {remainingCount === 0 ? (
        <div className="flex items-center gap-2 text-sm text-faint italic py-2">
          <PartyPopper
            size={16}
            className="text-green-700 dark:text-green-400"
            aria-hidden="true"
          />
          {t("priority.allDone")}
        </div>
      ) : (
        <ul className="divide-y divide-rows">
          {visible.map((contact) => {
            // Plockar färg och text för personens status
            const status = contactStatusInfo[contact.status]

            return (
              <li key={contact.id} className="flex items-center justify-between gap-2 py-3">
                <div className="min-w-0">
                  <div className="font-semibold text-strong truncate">{contact.name}</div>
                  <div className="text-sm text-faint">{contact.reason}</div>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <Badge color={status.color}>
                    <status.Icon size={12} aria-hidden="true" />
                    {t("priority.status." + status.key)}
                  </Badge>

                  <ContactActions name={contact.name} phone={contact.phone} email={contact.email} />

                  {/* Klar och Snooza döljer raden från dagens lista */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => markDone(contact.id)}
                      className="p-2 rounded-full row-hover text-green-700 dark:text-green-400"
                      aria-label={t("priority.markDone", { name: contact.name })}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => snooze(contact.id)}
                      className="p-2 rounded-full row-hover text-faint"
                      aria-label={t("priority.snooze", { name: contact.name })}
                    >
                      <Clock size={18} />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
