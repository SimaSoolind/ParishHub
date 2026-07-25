// PriorityList visar personer som prästen bör kontakta
// Varje rad har namn, anledning, statusetikett och en ring-knapp
// Ring-knappen öppnar telefonens uppringningsapp

import { PhoneCall } from "lucide-react"
import { Badge } from "./Badge"
import type { Contact, ContactStatus } from "../types/contact"

interface Props {
  contacts: Contact[]
}

// Kopplar varje status till färg och svensk text för Badge
// Ligger utanför komponenten för att slippa återskapa vid varje rendering
const statusInfo: Record<ContactStatus, { color: "red" | "amber" | "green"; label: string }> = {
  "not-contacted": { color: "red", label: "Ej kontaktad" },
  attempted: { color: "amber", label: "Försökt" },
  answered: { color: "green", label: "Svarat" }
}

export function PriorityList({ contacts }: Props) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <PhoneCall size={18} className="text-amber-800" />
        <h2 className="text-sm font-bold text-amber-800">Att kontakta</h2>
      </div>

      <ul className="divide-y divide-stone-200">
        {contacts.map((contact) => {
          // Plockar färg och text för personens status
          const status = statusInfo[contact.status]

          return (
            <li key={contact.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-semibold text-stone-800">{contact.name}</div>
                <div className="text-sm text-stone-500">{contact.reason}</div>
              </div>

              <div className="flex items-center gap-3">
                <Badge color={status.color}>{status.label}</Badge>

                <a
                  href={"tel:" + contact.phone}
                  className="p-2 rounded-full hover:bg-stone-100"
                  aria-label={"Ring " + contact.name}
                >
                  <PhoneCall size={20} className="text-amber-800" />
                </a>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
