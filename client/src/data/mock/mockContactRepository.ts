// mockContactRepository — implementation som läser kontaktlistan från mock-datan
// Implementerar: ContactRepository. Byts mot apiContactRepository när backend finns

import type { ContactRepository } from "../../domain/repositories/contactRepository"
import { mockContacts } from "../contacts.mock"

export const mockContactRepository: ContactRepository = {
  async getAll() {
    return [...mockContacts]
  },
}
