// memberStats — ren logik för medlemsstatistik (ingen React)
// Aggregerar medlemmar per kategori för cirkeldiagrammet på Dashboard
//
// Används av: MemberDistributionCard

import type { Member, MemberCategory } from "../domain/member"

// En stapel/segment: en kategori och hur många medlemmar den har
export interface CategoryCount {
  key: MemberCategory
  value: number
}

// Kategorierna i visningsordning
const categories: MemberCategory[] = ["adult", "youth", "leader", "other"]

// Räknar antal medlemmar per kategori
// Tar hela medlemslistan
// Returnerar en post per kategori som har minst en medlem
export function countByCategory(members: Member[]): CategoryCount[] {
  return categories
    .map((key) => ({ key, value: members.filter((m) => m.category === key).length }))
    .filter((count) => count.value > 0)
}
