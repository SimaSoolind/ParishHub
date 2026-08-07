// Card — återanvändbart kort (panel) med samma yta och valfri accent-rubrik
// Bryts ut eftersom exakt samma kort-skal (surface + border + padding + skugga)
// upprepades i ~30 paneler. Nu ändras kortets utseende på ETT ställe och alla
// kort följer med — mindre dubblering och lättare att hålla enhetligt
//
// Används av: ServiceSummaryPanel, ServiceToolsMenu, DashboardPieChart,
// LiturgyScriptPanel m.fl.

import type { ReactNode } from "react"

interface Props {
  title?: string // Valfri rubrik högst upp (liten versal accent-stil)
  children: ReactNode
  className?: string // Extra klasser när kortet behöver t.ex. flex-layout
}

// Ritar ett kort med valfri rubrik och innehållet inuti
// Tar emot title (rubrik), children (innehåll) och className (extra klasser)
// Returnerar kortet som JSX
export function Card({ title, children, className = "" }: Props) {
  return (
    <div className={"surface border p-6 rounded-2xl shadow-sm mb-6 " + className}>
      {title && <h2 className="text-sm font-bold text-accent mb-4">{title}</h2>}
      {children}
    </div>
  )
}
