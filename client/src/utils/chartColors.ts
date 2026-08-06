// chartColors — färgpalett för diagram (distinkta hues, färgblind-vänliga)
// Bygger på "Varm Olivsten"-temat med kompletterande färger
// Samlad här (DRY) så alla diagram använder samma palett
//
// Används av: DashboardPieChart

export const chartColors = [
  "#8B5E3C", // koppar (accent)
  "#3D6B3B", // grön
  "#3A5E8B", // blå
  "#5A4A7A", // lila
  "#7A4060", // plommon
  "#A8743A", // ljus koppar
]

// Ger en färg för ett index — loopar om paletten tar slut
// Tar ett index (t.ex. segmentets ordning)
// Returnerar en hex-färg
export function chartColor(index: number): string {
  return chartColors[index % chartColors.length] ?? "#8B5E3C"
}
