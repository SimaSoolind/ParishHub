// messageTemplates — id:n för färdiga WhatsApp-meddelanden
// Sjalva texten och etiketten ligger i översättningarna (locales/sv.ts, ar.ts)
// {namn} byts mot medlemmens förnamn när meddelandet skapas
// Samlat på ett ställe (DRY) — används av profil och grupputskick

// Id:n för mallarna — texten hämtas via t("templates.<id>.text")
// Ligger här så profil och grupputskick använder exakt samma lista
export const messageTemplateIds = ["reminder", "birthday", "missed"] as const

// Byter ut {namn} mot förnamnet i en mall-text
// text är mallen (från översättningen), name är medlemmens fullständiga namn
// Returnerar den färdiga texten som kan skickas via WhatsApp
export function fillTemplate(text: string, name: string): string {
  const firstName = name.split(" ")[0]
  return text.replaceAll("{namn}", firstName)
}
