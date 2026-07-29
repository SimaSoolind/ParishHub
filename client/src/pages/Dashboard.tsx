// Dashboard — startsidan för Kyrko-appen
// Visar statistik, födelsedagar och prioritetslista för prästen
// Datum och hälsning kommer från useDateTime-hooken
//
// Används av: App.tsx (sidan för URL "/")
// Bygger på: StatCard, BirthdayList, PriorityList och useDateTime
// Data: mockBirthdays och mockContacts (byts mot backend senare)

import { Users, Check, AlertTriangle } from "lucide-react"
import { StatCard } from "../components/StatCard"
import { BirthdayList } from "../components/BirthdayList"
import { PriorityList } from "../components/PriorityList"
import { mockBirthdays } from "../data/birthdays.mock"
import { mockContacts } from "../data/contacts.mock"
import { useDateTime } from "../hooks/useDateTime"

// Sätter ihop startsidan: hälsning, tre StatCard, BirthdayList och PriorityList
// Tar inga props
// Returnerar hela sidan som JSX
export function Dashboard() {
  // Hämtar datum och hälsning från hooken — ingen logik i JSX
  const { date, greeting } = useDateTime()

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">
        {greeting}, Fader Korollos
      </h1>
      <p className="text-stone-600 mb-6">{date}</p>

      <div className="flex gap-4 mb-6">
        <StatCard label="Medlemmar" value={47} color="blue" Icon={Users} />
        <StatCard label="Närvarande idag" value={38} color="green" Icon={Check} />
        <StatCard label="Att kontakta" value={5} color="red" Icon={AlertTriangle} />
      </div>

      <BirthdayList birthdays={mockBirthdays} />
      <PriorityList contacts={mockContacts} />
    </div>
  )
}