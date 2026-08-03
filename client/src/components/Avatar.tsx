// Avatar — visar en medlems profilbild eller initialer i en färgad cirkel
// Finns ingen bild-URL visas initialerna, med en färg som härleds från namnet
// Samma namn ger alltid samma färg (stabilt), så medlemmar går att känna igen
//
// Används av: MemberCard, MemberProfileModal

interface Props {
  name: string
  photoUrl?: string | undefined
  // "md" för listan, "lg" för profil-modalen
  size?: "md" | "lg"
}

// Färgpaletter för initial-cirkeln (ljust + mörkt läge)
// Statiska klass-strängar så Tailwind tar med dem i bygget
const palette = [
  "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
  "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
  "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
  "bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300",
]

// Plockar initialer ur ett namn (max två bokstäver)
// "Anna Lindgren" -> "AL", "Sima" -> "SI"
// Returnerar versaler
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"

  const first = parts[0] ?? ""
  if (parts.length === 1) return first.slice(0, 2).toUpperCase()

  const last = parts[parts.length - 1] ?? ""
  return (first.charAt(0) + last.charAt(0)).toUpperCase()
}

// Väljer en färg från paletten baserat på namnet
// Summerar teckenkoderna så samma namn alltid ger samma färg
function colorForName(name: string): string {
  let sum = 0
  for (const char of name) {
    sum += char.charCodeAt(0)
  }
  // Index är alltid inom paletten (modulo på en icke-tom lista) → aldrig undefined
  return palette[sum % palette.length]!
}

// Ritar avataren — bild om photoUrl finns, annars initialer
// Tar emot name (för initialer och färg), valfri photoUrl och storlek
// Returnerar avataren som JSX
export function Avatar({ name, photoUrl, size = "md" }: Props) {
  // Storleks-klasser: större cirkel i profil-modalen
  const sizeClass = size === "lg" ? "w-16 h-16 text-xl" : "w-10 h-10 text-sm"

  // Har medlemmen en bild visas den istället för initialerna
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className={sizeClass + " rounded-full object-cover flex-shrink-0"}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className={
        sizeClass +
        " rounded-full flex items-center justify-center font-semibold flex-shrink-0 " +
        colorForName(name)
      }
    >
      {getInitials(name)}
    </div>
  )
}
