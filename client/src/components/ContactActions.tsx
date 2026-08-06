// ContactActions visar tre kontaktknappar för en person: Ring, Mejla och WhatsApp
// Ring öppnar telefonen (tel:), Mejla öppnar e-postprogrammet (mailto:)
// WhatsApp öppnar en wa.me-länk via buildWhatsAppLink (delad hjälp-funktion)
// Mejl-knappen visas bara om personen har en e-postadress
//
// Används av: PriorityList (och andra listor som behöver kontaktknappar)
// Bygger på: buildWhatsAppLink (lib/whatsapp)

import { Phone, Mail, MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { buildWhatsAppLink } from "../lib/whatsapp"

interface Props {
  name: string // Namn används i aria-label (t.ex. "Ring Anna")
  phone: string
  email?: string | undefined
}

// Ritar kontaktknapparna för en person
// Tar emot name, phone och (valfritt) email
// Returnerar de tre ikon-knapparna som JSX
export function ContactActions({ name, phone, email }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-1">
      <a
        href={"tel:" + phone}
        className="p-2 rounded-full row-hover"
        aria-label={t("common.call", { name })}
      >
        <Phone size={18} className="text-accent" />
      </a>

      {email && (
        <a
          href={"mailto:" + email}
          className="p-2 rounded-full row-hover"
          aria-label={t("common.email", { name })}
        >
          <Mail size={18} className="text-blue-700 dark:text-blue-400" />
        </a>
      )}

      <a
        href={buildWhatsAppLink(phone, "")}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-full row-hover"
        aria-label={t("common.whatsapp", { name })}
      >
        <MessageCircle size={18} className="text-green-700 dark:text-green-400" />
      </a>
    </div>
  )
}
