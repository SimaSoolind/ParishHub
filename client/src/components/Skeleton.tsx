// Skeleton — grå platshållare med pulserande animation
// Används medan data hämtas från API eller mock-repository
// Ger användaren visuell återkoppling att något laddas (känns snabbare än text)
//
// Används av: sidor med laddnings-läge

interface Props {
  className?: string
  // aria-label för skärmläsare — beskriver vad som laddas
  ariaLabel?: string
}

// Ritar ett pulserande grått block
// Tar emot valfria extra klasser (storlek) och en aria-label
// Returnerar platshållaren som JSX
export function Skeleton({ className = "", ariaLabel = "Laddar" }: Props) {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={"animate-pulse bg-stone-200 rounded dark:bg-stone-700 " + className}
    />
  )
}
