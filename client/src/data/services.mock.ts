// Tillfällig mockdata för gudstjänster och närvaro
// Ersätts med riktig databas i vecka 5-6

import type { Service, Attendance } from "../domain/service"

// Gudstjänster: fyra tidigare (med avprickad närvaro) och två kommande
export const mockServices: Service[] = [
  {
    id: "s0",
    title: "Söndagsgudstjänst",
    date: "2026-06-28",
    startTime: "10:00",
    endTime: "12:00",
  },
  {
    id: "s1",
    title: "Söndagsgudstjänst",
    date: "2026-07-19",
    startTime: "10:00",
    endTime: "12:00",
    notes: "Predikan om barmhärtighet",
  },
  {
    id: "s2",
    title: "Söndagsgudstjänst",
    date: "2026-07-26",
    startTime: "10:00",
    endTime: "12:00",
  },
  {
    id: "s3",
    title: "Söndagsgudstjänst",
    date: "2026-08-02",
    startTime: "10:00",
    endTime: "12:00",
  },
  {
    id: "s4",
    title: "Söndagsgudstjänst",
    date: "2026-08-09",
    startTime: "10:00",
    endTime: "12:00",
  },
  {
    id: "s5",
    title: "Ungdomsmöte",
    date: "2026-08-13",
    startTime: "18:30",
    endTime: "20:00",
  },
]

// Närvaro för de fyra tidigare gudstjänsterna (medlemmar med id 1-5)
// Johan (3) har aldrig deltagit, David (5) senast 28 juni -> båda flaggas av frånvaro-regeln
// Kommande gudstjänster (s4, s5) saknar närvaro tills prästen bockar av
export const mockAttendance: Attendance[] = [
  { serviceId: "s0", memberId: "1", status: "present" },
  { serviceId: "s0", memberId: "2", status: "present" },
  { serviceId: "s0", memberId: "3", status: "absent", absenceReason: "unknown" },
  { serviceId: "s0", memberId: "4", status: "present" },
  { serviceId: "s0", memberId: "5", status: "present" },

  { serviceId: "s1", memberId: "1", status: "present" },
  { serviceId: "s1", memberId: "2", status: "present" },
  { serviceId: "s1", memberId: "3", status: "absent", absenceReason: "unknown" },
  { serviceId: "s1", memberId: "4", status: "present" },
  { serviceId: "s1", memberId: "5", status: "absent", absenceReason: "sick" },

  { serviceId: "s2", memberId: "1", status: "present" },
  { serviceId: "s2", memberId: "2", status: "present" },
  { serviceId: "s2", memberId: "3", status: "absent", absenceReason: "unknown" },
  { serviceId: "s2", memberId: "4", status: "present" },
  { serviceId: "s2", memberId: "5", status: "absent", absenceReason: "travel" },

  { serviceId: "s3", memberId: "1", status: "absent", absenceReason: "unknown" },
  { serviceId: "s3", memberId: "2", status: "present" },
  { serviceId: "s3", memberId: "3", status: "absent", absenceReason: "unknown" },
  { serviceId: "s3", memberId: "4", status: "present" },
  { serviceId: "s3", memberId: "5", status: "absent", absenceReason: "other" },
]
