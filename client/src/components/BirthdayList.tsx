// BirthdayList visar personer som fyller år denna vecka
// Ring-knapp öppnar telefonens uppringningsapp
//
// Används av: Dashboard.tsx

import { Cake, Phone } from "lucide-react"
import { useTranslation } from "react-i18next"
import type { Birthday } from "../domain/birthday"

interface Props {
  birthdays: Birthday[]
}

// Ritar en lista med födelsedagar, en rad per person
// Tar emot en lista med Birthday-objekt som prop
// Returnerar listan som JSX
export function BirthdayList({ birthdays }: Props) {
  const { t } = useTranslation()

  // Sant när ingen fyller år denna vecka
  const isEmpty = birthdays.length === 0

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Cake size={18} className="text-pink-700 dark:text-pink-400" />
        <h2 className="text-sm font-bold text-pink-700 dark:text-pink-400">
          {t("birthday.title")}
        </h2>
      </div>

      {/* Visar ett meddelande om listan är tom, annars själva listan */}
      {isEmpty ? (
        <p className="text-sm text-faint italic">{t("birthday.empty")}</p>
      ) : (
        <ul className="divide-y divide-rows">
          {birthdays.map((person) => (
            <li key={person.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-semibold text-strong">{person.name}</div>
                <div className="text-sm text-faint">{t("birthday.turns", { age: person.age })}</div>
              </div>

              <a
                href={"tel:" + person.phone}
                className="p-2 rounded-full row-hover"
                aria-label={t("common.call", { name: person.name })}
              >
                <Phone size={20} className="text-accent" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
