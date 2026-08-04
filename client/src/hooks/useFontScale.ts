// useFontScale — custom hook som håller vald textstorlek (font-scale)
// Sparar valet i localStorage så det kommer ihåg mellan besök
// Sätter CSS-variabeln --font-scale på <html> så all text skalar
//
// Används av: Layout.tsx (skalväljaren i headern)

import { useState, useEffect } from "react"

// De enda tillåtna skalvärdena (80–200 procent)
export type FontScale = 0.8 | 1 | 1.2 | 1.4 | 2

// Nyckeln som skalan sparas under i localStorage
const STORAGE_KEY = "parishhub-font-scale"

// Läser sparad skala från localStorage och validerar den i runtime
// Returnerar ett giltigt FontScale-värde, annars 1 (100 procent)
// Validering behövs eftersom localStorage kan innehålla vad som helst (säkerhet)
function readStoredScale(): FontScale {
  const raw: unknown = localStorage.getItem(STORAGE_KEY)
  if (raw === "0.8" || raw === "1" || raw === "1.2" || raw === "1.4" || raw === "2") {
    return Number(raw) as FontScale
  }
  return 1
}

// Håller aktuell textstorlek och en funktion för att ändra den
// Tar inga argument
// Returnerar scale (nuvarande skala) och setScale (byter skala)
// Kan återanvändas av valfri komponent som behöver läsa eller ändra textstorleken
export function useFontScale() {
  // Startvärde läses direkt från localStorage (bara en gång)
  const [scale, setScale] = useState<FontScale>(readStoredScale)

  // Uppdaterar CSS-variabeln på <html> och sparar valet varje gång skalan ändras
  // Alla rem-baserade text-storlekar multipliceras med denna variabel
  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", String(scale))
    localStorage.setItem(STORAGE_KEY, String(scale))
  }, [scale])

  return { scale, setScale }
}
