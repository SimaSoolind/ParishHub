// mockBirthdayRepository — implementation som läser födelsedagar från mock-datan
// Implementerar: BirthdayRepository. Byts mot apiBirthdayRepository när backend finns

import type { BirthdayRepository } from "../../domain/repositories/birthdayRepository"
import { mockBirthdays } from "../birthdays.mock"

export const mockBirthdayRepository: BirthdayRepository = {
  async getAll() {
    return [...mockBirthdays]
  },
}
