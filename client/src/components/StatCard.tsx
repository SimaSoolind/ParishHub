// StatCard — färgat kort som visar en siffra med etikett
// Används på Dashboard för att visa statistik som medlemsantal, närvaro etc.
// Tar emot label, value, color och Icon som props
// Icon är en React-komponent från lucide-react (t.ex. Users, Check)

import type { LucideIcon } from "lucide-react"

// Definierar vilka props komponenten kräver
// TypeScript varnar om något saknas eller är fel typ
interface StatCardProps {
  label: string              // Text under siffran, t.ex. "Medlemmar"
  value: number              // Själva siffran som visas stort
  color: "blue" | "green" | "red"   // Endast dessa tre färger tillåtna
  Icon: LucideIcon           // Ikon-komponent från lucide-react
}

// Färg-mappning — kopplar färgnamn till Tailwind CSS-klasser
// Ligger utanför komponenten för att slippa återskapa vid varje rendering
const colorClasses = {
  blue: "bg-blue-50 border-blue-200 text-blue-800",
  green: "bg-green-50 border-green-200 text-green-800",
  red: "bg-red-50 border-red-200 text-red-800",
}

export function StatCard({ label, value, color, Icon }: StatCardProps) {
  // Plockar rätt CSS-klasser baserat på färg-prop
  const classes = colorClasses[color]

  return (
    <div className={`p-4 rounded-2xl border ${classes} text-center flex-1`}>
      {/* Ikonen — centrerad högst upp */}
      <div className="flex justify-center mb-2">
        <Icon size={24} />
      </div>

      {/* Själva siffran — stor och fetstil */}
      <div className="text-3xl font-bold mb-1">{value}</div>

      {/* Etikett under — mindre text som förklarar siffran */}
      <div className="text-xs opacity-75">{label}</div>
    </div>
  )
}