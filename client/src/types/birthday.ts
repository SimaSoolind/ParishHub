// Birthday — beskriver en födelsedag i systemet
// Används av BirthdayList-komponenten och senare av backend

export type Birthday = {
  id: string
  name: string
  age: number
  when: string
  phone: string
}