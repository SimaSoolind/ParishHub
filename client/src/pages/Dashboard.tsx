// Dashboard - startsidan for Kyrko-appen
// Visar statistik, fodelsedagar och prioritetslista for prasten
// Datum och halsning kommer fran useDateTime-hooken

import { Users, Check, AlertTriangle } from "lucide-react"
import { StatCard } from "../components/StatCard"
import { BirthdayList } from "../components/BirthdayList"
import { PriorityList } from "../components/PriorityList"
import { mockBirthdays } from "../data/birthdays.mock"
import { mockContacts } from "../data/contacts.mock"
import { useDateTime } from "../hooks/useDateTime"

export function Dashboard() {
  const { date, greeting } = useDateTime()

  return (
    <div>
      <h1 className="text-3xl font-bold text-stone-800 mb-2">
        {greeting}, Fader Korollos
      </h1>
      <p className="text-stone-600 mb-6">{date}</p>

      <div className="flex gap-4 mb-6">
        <StatCard label="Medlemmar" value={47} color="blue" Icon={Users} />
        <StatCard label="Narvarande idag" value={38} color="green" Icon={Check} />
        <StatCard label="Att kontakta" value={5} color="red" Icon={AlertTriangle} />
      </div>

      <BirthdayList birthdays={mockBirthdays} />
      <PriorityList contacts={mockContacts} />
    </div>
  )
}