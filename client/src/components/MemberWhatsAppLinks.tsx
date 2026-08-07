// MemberWhatsAppLinks — snabbmeddelanden till en medlem via WhatsApp
// Mall-knappar (fyllda med medlemmens namn) + ett tomt meddelande. Bryts ut ur
// MemberDetail så profil-kortet blir kortare och meddelande-delen samlas
//
// Används av: MemberProfileCard

import { useTranslation } from "react-i18next"
import { MessageCircle } from "lucide-react"
import { messageTemplateIds, fillTemplate } from "../data/messageTemplates"
import { buildWhatsAppLink } from "../lib/whatsapp"

interface Props {
  phone: string
  name: string
}

// Ritar WhatsApp-mallarna som länkar
// Tar emot phone (mottagare) och name (fyller i mallens hälsning)
// Returnerar meddelande-blocket som JSX
export function MemberWhatsAppLinks({ phone, name }: Props) {
  const { t } = useTranslation()

  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-faint uppercase mb-2 flex items-center gap-1">
        <MessageCircle size={12} />
        {t("profile.whatsappTitle")}
      </div>
      <div className="flex flex-col gap-2">
        {messageTemplateIds.map((templateId) => (
          <a
            key={templateId}
            href={buildWhatsAppLink(
              phone,
              fillTemplate(t("templates." + templateId + ".text"), name)
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 border border-stone-200 rounded-xl text-sm font-semibold text-green-700 hover:bg-green-50 dark:border-stone-600 dark:text-green-400 dark:hover:bg-green-950"
          >
            {t("templates." + templateId + ".label")}
          </a>
        ))}
        {/* Tomt meddelande — prästen skriver själv i WhatsApp */}
        <a
          href={buildWhatsAppLink(phone, "")}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 btn-secondary text-soft text-sm"
        >
          {t("profile.emptyMessage")}
        </a>
      </div>
    </div>
  )
}
