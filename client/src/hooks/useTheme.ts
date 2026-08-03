// useTheme — custom hook som håller reda på ljust/mörkt läge
// Sparar valet i localStorage så det kommer ihåg mellan besök
// Sätter data-theme på <html> så alla dark:-klasser slår till
//
// Används av: Layout.tsx (tema-knappen i headern)

import { useState, useEffect } from "react"

// De enda tillåtna temavärdena
type Theme = "light" | "dark"

// Nyckeln som temat sparas under i localStorage
const STORAGE_KEY = "parishhub-theme"

// Läser sparat tema från localStorage och validerar det i runtime
// Returnerar "light" eller "dark" — faller tillbaka till "light" om värdet saknas eller är ogiltigt
// Validering behövs eftersom localStorage kan innehålla vad som helst (säkerhet)
function readStoredTheme(): Theme {
  const saved: unknown = localStorage.getItem(STORAGE_KEY)
  if (saved === "light" || saved === "dark") {
    return saved
  }
  return "light"
}

// Håller aktuellt tema och en funktion för att växla mellan ljust och mörkt
// Tar inga argument
// Returnerar theme (nuvarande läge) och toggleTheme (växlar läge)
// Kan återanvändas av valfri komponent som behöver läsa eller ändra temat
export function useTheme() {
  // Startvärde läses direkt från localStorage (bara en gång)
  const [theme, setTheme] = useState<Theme>(readStoredTheme)

  // Sätter data-theme på <html> och sparar valet varje gång temat ändras
  useEffect(() => {
    document.documentElement.dataset["theme"] = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  // Växlar mellan ljust och mörkt läge
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return { theme, toggleTheme }
}
