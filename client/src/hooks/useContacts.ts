// useContacts — presentation-hook som hämtar prästens kontaktlista
// Använder ContactRepository, så komponenten slipper veta var datan kommer ifrån
// Returnerar en klar lista med kontakter
//
// Används av: Dashboard.tsx

import { useState, useEffect } from "react"
import type { Contact } from "../domain/contact"
import { mockContactRepository as repository } from "../data/mock/mockContactRepository"

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])

  // Hämtar kontakterna när hooken används första gången
  useEffect(() => {
    repository.getAll().then(setContacts)
  }, [])

  return contacts
}
