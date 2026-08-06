// useServices — presentation-hook för gudstjänster och närvaro
// Använder ServiceRepository, så sidan slipper veta var datan kommer ifrån
// Returnerar services, attendance, loading + funktioner för att ändra
//
// Används av: Services.tsx

import { useState, useEffect } from "react"
import type { Service, NewServiceData, Attendance } from "../domain/service"
import { mockServiceRepository as repository } from "../data/mock/mockServiceRepository"

// Ger gudstjänster + närvaro och funktioner för att ändra dem, via repositoryt
// Tar inga argument
// Returnerar services, attendance, loading, addService, saveNote, saveAttendance
export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  // Hämtar gudstjänster och närvaro när hooken används första gången
  useEffect(() => {
    Promise.all([repository.getAll(), repository.getAttendance()]).then(
      ([serviceList, attendanceList]) => {
        setServices(serviceList)
        setAttendance(attendanceList)
        setLoading(false)
      }
    )
  }, [])

  // Lägger till en gudstjänst
  const addService = async (data: NewServiceData) => {
    await repository.add(data)
    setServices(await repository.getAll())
  }

  // Sparar (eller nollställer) en gudstjänsts anteckning
  const saveNote = async (id: string, note: string) => {
    await repository.updateNote(id, note)
    setServices(await repository.getAll())
  }

  // Uppdaterar valda fält på en gudstjänst (t.ex. planering) och läser om listan
  const updateService = async (id: string, changes: Partial<NewServiceData>) => {
    await repository.update(id, changes)
    setServices(await repository.getAll())
  }

  // Tar bort en gudstjänst och läser om listorna (även närvaron påverkas)
  const removeService = async (id: string) => {
    await repository.remove(id)
    setServices(await repository.getAll())
    setAttendance(await repository.getAttendance())
  }

  // Sparar närvaron för en gudstjänst
  const saveAttendance = async (serviceId: string, records: Attendance[]) => {
    await repository.saveAttendance(serviceId, records)
    setAttendance(await repository.getAttendance())
  }

  return {
    services,
    attendance,
    loading,
    addService,
    saveNote,
    updateService,
    saveAttendance,
    removeService,
  }
}
