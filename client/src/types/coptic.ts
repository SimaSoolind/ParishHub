// Coptic — typer för data från coptic.io-API:et
// Beskriver högtider och fastor i den koptiska kalendern
// Används av useCopticCelebrations

// En enskild högtid eller fasta en viss dag
// type kan vara t.ex. "lordlyFeast", "feast" eller "fast"
export interface CopticCelebration {
  id: number
  name: string
  type: string
  isMoveable: boolean
}

// En dag med dess högtider och fastor (från upcoming-listan)
export interface CopticCelebrationDay {
  date: string
  celebrations: CopticCelebration[]
}
