// GroupMessageModal — grupputskick via WhatsApp
// Prästen väljer en mall och skickar till varje vald medlem, en i taget
// (WhatsApp tillåter inte utskick till många på en gång via länk)
//
// TODO (backend, v.5-8): äkta grupputskick via WhatsApp Business API —
// skicka till alla valda på EN gång från servern istället för en i taget
//
// Används av: Members.tsx

import { useEffect, useState } from "react"
import { MessageCircle } from "lucide-react"
import { useTranslation } from "react-i18next"
import { ModalCloseButton } from "./ModalCloseButton"
import { FocusTrap } from "focus-trap-react"
import type { Member } from "../domain/member"
import { messageTemplateIds, fillTemplate } from "../data/messageTemplates"
import { buildWhatsAppLink } from "../lib/whatsapp"

interface Props {
  members: Member[] // de valda medlemmarna
  onClose: () => void
}

// Ritar utskicks-modalen med mall-val och en WhatsApp-knapp per medlem
// Tar emot members (valda) och onClose (stäng)
// Returnerar modalen som JSX
export function GroupMessageModal({ members, onClose }: Props) {
  const { t } = useTranslation()

  // Meddelande-texten — börjar med första mallen (i valt språk)
  const [text, setText] = useState(() => t("templates." + messageTemplateIds[0] + ".text"))

  // Escape stänger modalen — tangentbords-användare ska kunna stänga utan mus (WCAG)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  return (
    // Backdrop — klick utanför stänger modalen
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div onClick={onClose} className="modal-backdrop">
        {/* Själva modalen — stopPropagation förhindrar att klick stänger */}
        <div
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="modal-panel max-w-md w-full p-6 max-h-[90vh] flex flex-col"
        >
          {/* Rubrik-rad med stäng-knapp */}
          <div className="flex items-start justify-between mb-1">
            <h2 id="modal-title" className="text-xl font-bold text-strong">
              {t("group.title")}
            </h2>
            <ModalCloseButton onClose={onClose} />
          </div>
          <p className="text-sm text-faint mb-4">{t("group.subtitle", { n: members.length })}</p>

          {/* Välj en mall (fyller i textrutan) */}
          <div className="flex flex-wrap gap-2 mb-3">
            {messageTemplateIds.map((id) => {
              const templateText = t("templates." + id + ".text")
              return (
                <button
                  key={id}
                  onClick={() => setText(templateText)}
                  className={
                    "px-3 py-1 rounded-full text-xs font-semibold border " +
                    (text === templateText
                      ? "bg-amber-800 text-white border-amber-800"
                      : "bg-white text-stone-600 border-stone-200 hover:border-amber-800 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600")
                  }
                >
                  {t("templates." + id + ".label")}
                </button>
              )
            })}
          </div>

          {/* Redigera texten fritt ({namn} byts mot förnamn per person) */}
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={3}
            className="field resize-none mb-4"
          />

          {/* Lista med valda — en WhatsApp-knapp per person */}
          <ul className="overflow-y-auto divide-y divide-rows">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-strong">{member.name}</span>
                <a
                  href={buildWhatsAppLink(member.phone, fillTemplate(text, member.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border border-green-200 text-green-700 hover:bg-green-50 dark:border-green-900 dark:text-green-400 dark:hover:bg-green-950"
                >
                  <MessageCircle size={14} />
                  {t("group.send")}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </FocusTrap>
  )
}
