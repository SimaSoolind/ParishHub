// ErrorBoundary — fångar fel i barn-komponenter så hela appen inte kraschar
// Visar ett generellt meddelande och loggar felet internt (aldrig till användaren)
//
// OBS: Error Boundaries MÅSTE vara class components — React stödjer inte detta
// som hook. Detta är det ENDA undantaget från regeln "aldrig class components".
//
// Används av: Layout.tsx (runt den aktuella sidan)

import { Component } from "react"
import type { ReactNode, ErrorInfo } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false }

  // Körs när ett barn kastar ett fel — växlar till fel-läget
  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  // Loggar felet internt (till konsolen) — visas aldrig för användaren
  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary fångade ett fel:", error, info)
  }

  override render() {
    // Vid fel visas ett generellt meddelande istället för en vit skärm
    if (this.state.hasError) {
      return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 text-center">
          <p className="text-stone-800 font-semibold mb-2">Något gick fel</p>
          <p className="text-sm text-stone-500 mb-4">Försök igen.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-900"
          >
            Ladda om sidan
          </button>
        </div>
      )
    }

    // Inget fel — visa barnen som vanligt
    return this.props.children
  }
}
