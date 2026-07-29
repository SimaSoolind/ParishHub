// BirthdayList visar personer som fyller år denna vecka
// Ring-knapp öppnar telefonens uppringningsapp
//
// Används av: Dashboard.tsx

import { Cake, Phone } from "lucide-react"
import type { Birthday } from "../types/birthday"

interface Props {
  birthdays: Birthday[]
}

// Ritar en lista med födelsedagar, en rad per person
// Tar emot en lista med Birthday-objekt som prop
// Returnerar listan som JSX
export function BirthdayList({ birthdays }: Props) {
  // Sant när ingen fyller år denna vecka
  const isEmpty = birthdays.length === 0

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
      <div className="flex items-center gap-2 mb-4">
        <Cake size={18} className="text-pink-700" />
        <h2 className="text-sm font-bold text-pink-700">Födelsedag denna vecka</h2>
      </div>

      {/* Visar ett meddelande om listan är tom, annars själva listan */}
      {isEmpty ? (
        <p className="text-sm text-stone-500 italic">Ingen fyller år denna vecka.</p>
      ) : (
        <ul className="divide-y divide-stone-200">
          {birthdays.map((person) => (
            <li key={person.id} className="flex items-center justify-between py-3">
              <div>
                <div className="font-semibold text-stone-800">{person.name}</div>
                <div className="text-sm text-stone-500">fyller {person.age} år</div>
              </div>

              <a
                href={"tel:" + person.phone}
                className="p-2 rounded-full hover:bg-stone-100"
                aria-label={"Ring " + person.name}
              >
                <Phone size={20} className="text-amber-800" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}