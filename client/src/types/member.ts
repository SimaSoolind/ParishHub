// Member — beskriver en medlem i systemet
// TODO: kategorier ska bli helt dynamiska när backend (PostgreSQL) finns

export type MemberCategory =
  | "adult"
  | "youth"
  | "leader"
  | "other"

export type Member = {
  id: string
  name: string
  phone: string
  email: string
  familySize: number
  birthday: string
  category: MemberCategory
}