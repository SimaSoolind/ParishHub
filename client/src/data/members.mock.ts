// Tillfällig mockdata för medlemmar
// Ersätts med riktig databas i vecka 5-6

import type { Member } from "../types/member"

export const mockMembers: Member[] = [
  {
    id: "1",
    name: "Anna Lindgren",
    phone: "0701234567",
    email: "anna@example.com",
    address: "Storgatan 12, Stockholm",
    familySize: 3,
    birthday: "5 aug",
    category: "adult"
  },
  {
    id: "2",
    name: "Maria Svensson",
    phone: "0709876543",
    email: "maria@example.com",
    address: "Kyrkvägen 5, Uppsala",
    familySize: 1,
    birthday: "27 jul",
    category: "adult"
  },
  {
    id: "3",
    name: "Johan Berg",
    phone: "0705555555",
    email: "johan@example.com",
    address: "Björkgatan 8, Göteborg",
    familySize: 4,
    birthday: "12 sep",
    category: "leader"
  },
  {
    id: "4",
    name: "Sofia Karim",
    phone: "0706666666",
    email: "sofia@example.com",
    address: "Ringvägen 22, Malmö",
    familySize: 2,
    birthday: "3 mar",
    category: "youth"
  },
  {
    id: "5",
    name: "David Nasr",
    phone: "0707777777",
    email: "david@example.com",
    address: "Parkgatan 3, Solna",
    familySize: 2,
    birthday: "18 nov",
    category: "other"
  }
]
