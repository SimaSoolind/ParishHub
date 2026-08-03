// resolveFamilyId — räknar ut vilket familyId två medlemmar ska dela
// Återanvänder ett befintligt id om något finns, annars skapas ett nytt
// Ren affärslogik (use-case) — ingen React, lätt att testa separat
//
// Används av: Members (familjekoppling)

// Tar den valda medlemmens familyId och den andra medlemmens familyId
// Returnerar det id som båda ska dela (befintligt eller nytt unikt id)
export function resolveFamilyId(selectedFamilyId?: string, otherFamilyId?: string): string {
  return selectedFamilyId ?? otherFamilyId ?? crypto.randomUUID()
}
