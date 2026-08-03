// Enhetstester för buildAttendanceRecords (närvaro-logik)
// Ren funktion — inget React, ingen mock behövs

import { describe, it, expect } from "vitest"
import { buildAttendanceRecords } from "./attendance"
import type { Member } from "../domain/member"

// Tre testmedlemmar med minsta möjliga giltiga data
const members: Member[] = [
  {
    id: "1",
    name: "Anna",
    phone: "0701",
    email: "a@x.se",
    address: "X",
    familySize: 1,
    birthday: "1 jan",
    category: "adult",
  },
  {
    id: "2",
    name: "Bo",
    phone: "0702",
    email: "b@x.se",
    address: "Y",
    familySize: 1,
    birthday: "2 jan",
    category: "adult",
  },
  {
    id: "3",
    name: "Cia",
    phone: "0703",
    email: "c@x.se",
    address: "Z",
    familySize: 1,
    birthday: "3 jan",
    category: "adult",
  },
]

describe("buildAttendanceRecords", () => {
  it("hoppar över medlemmar som inte är markerade", () => {
    const records = buildAttendanceRecords({
      serviceId: "s1",
      members,
      marks: { "1": "present", "2": "not-marked", "3": "absent" },
      reasons: {},
      contacts: {},
    })
    expect(records).toHaveLength(2)
    expect(records.map((r) => r.memberId).sort()).toEqual(["1", "3"])
  })

  it("tar med orsak och kontaktstatus endast för frånvarande", () => {
    const records = buildAttendanceRecords({
      serviceId: "s1",
      members,
      marks: { "1": "present", "3": "absent" },
      reasons: { "1": "sick", "3": "travel" },
      contacts: { "1": "answered", "3": "attempted" },
    })
    const present = records.find((r) => r.memberId === "1")!
    const absent = records.find((r) => r.memberId === "3")!

    // Närvarande får INTE orsak/kontaktstatus
    expect(present.absenceReason).toBeUndefined()
    expect(present.contactStatus).toBeUndefined()

    // Frånvarande får orsak + kontaktstatus
    expect(absent.absenceReason).toBe("travel")
    expect(absent.contactStatus).toBe("attempted")
  })

  it("sätter serviceId och markedAt på varje post", () => {
    const records = buildAttendanceRecords({
      serviceId: "s9",
      members: [members[0]!],
      marks: { "1": "present" },
      reasons: {},
      contacts: {},
    })
    expect(records[0]!.serviceId).toBe("s9")
    expect(records[0]!.markedAt).toBeTruthy()
  })
})
