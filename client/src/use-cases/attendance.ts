// buildAttendanceRecords — bygger Attendance-poster från prästens markeringar
// Ren affärslogik (use-case) — ingen React, lätt att testa separat
// Orsak och kontaktstatus tas bara med för frånvarande
//
// Används av: AttendanceModal

import type { Member } from "../domain/member"
import type { Attendance, AttendanceStatus, AbsenceReason } from "../domain/service"
import type { ContactStatus } from "../domain/contact"

interface AttendanceInput {
  serviceId: string
  members: Member[]
  marks: Record<string, AttendanceStatus>
  reasons: Record<string, AbsenceReason>
  contacts: Record<string, ContactStatus>
}

// Skapar en Attendance-post för varje markerad medlem (present/absent)
// Tar emot serviceId, medlemmar och prästens val (marks/reasons/contacts)
// Returnerar en lista med Attendance som kan sparas
export function buildAttendanceRecords(input: AttendanceInput): Attendance[] {
  // markedAt sätts för spårbarhet (vem-fältet läggs till när inloggning finns)
  const now = new Date().toISOString()
  const records: Attendance[] = []

  for (const member of input.members) {
    const status = input.marks[member.id]
    // Bara närvarande eller frånvarande sparas (hoppa över omarkerade/saknade)
    if (status !== "present" && status !== "absent") continue

    const record: Attendance = {
      serviceId: input.serviceId,
      memberId: member.id,
      status,
      markedAt: now,
    }

    // Orsak och kontaktstatus sparas bara för frånvarande
    if (status === "absent") {
      const reason = input.reasons[member.id]
      const contact = input.contacts[member.id]
      if (reason) record.absenceReason = reason
      if (contact) record.contactStatus = contact
    }

    records.push(record)
  }

  return records
}
