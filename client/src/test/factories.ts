// factories — bygger testdata med rimliga standardvärden (DRY)
// Testet anger bara de fält som spelar roll; resten fylls i här
// Samlas på ETT ställe så flera tester kan dela samma testdata
//
// Används av: hook- och use-case-tester

import type { Member } from "../domain/member"
import type { Contact } from "../domain/contact"

// Bygger en medlem — testet skickar in id, namn och kategori, resten får standard
export function makeMember(
  over: Partial<Member> & Pick<Member, "id" | "name" | "category">
): Member {
  return {
    phone: "0700000000",
    email: "test@test.se",
    address: "Gatan 1",
    familySize: 1,
    birthday: "1 jan",
    ...over,
  }
}

// Bygger en kontakt (prioritetslistan) med bara de fält logiken behöver
export function makeContact(id: string): Contact {
  return { id, name: "Namn " + id, reason: "Frånvaro", status: "not-contacted", phone: "070" }
}
