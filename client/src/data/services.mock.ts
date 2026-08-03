// Tillfällig mockdata för gudstjänster
// Ersätts med riktig databas i vecka 5-6

import type { Service, Attendance } from "../domain/service"

export const mockServices: Service[] = [
  {
    id: "s1",
    title: "Söndagsgudstjänst",
    date: "2026-07-27",
    startTime: "10:00",
    endTime: "12:00",
    notes: "Predikan om barmhärtighet",
  },
  {
    id: "s2",
    title: "Ungdomsmöte",
    date: "2026-07-30",
    startTime: "18:30",
    endTime: "20:00",
  },
  {
    id: "s3",
    title: "Söndagsgudstjänst",
    date: "2026-08-03",
    startTime: "10:00",
    endTime: "12:00",
  },
]

// Tomma listor för närvaro — fylls i när prästen bockar av
export const mockAttendance: Attendance[] = []
