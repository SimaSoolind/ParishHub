// Birthday — domän-entitet för en födelsedag
// Ligger i domain/ — en ren datastruktur, oberoende av React och externa API:er
// Används av: BirthdayList

export type Birthday = {
  id: string
  name: string
  age: number
  when: string
  phone: string
}
