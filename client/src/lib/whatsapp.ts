// whatsapp — hjälp-funktioner för att bygga WhatsApp-länkar (wa.me)
// Används av MemberProfileModal och grupputskick

// Gör om ett svenskt telefonnummer till internationellt format för WhatsApp
// "0701234567" -> "46701234567" (tar bort 0:an och lägger till landskoden 46)
// phone är numret som ska omvandlas, returnerar bara siffror
export function toWhatsAppNumber(phone: string): string {
  // Tar bort allt utom siffror (mellanslag, bindestreck, plus)
  const digits = phone.replace(/\D/g, "")
  // Svenskt format börjar med 0 -> byt ut nollan mot landskoden 46
  if (digits.startsWith("0")) return "46" + digits.slice(1)
  // Numret är redan i internationellt format
  return digits
}

// Bygger en färdig WhatsApp-länk med mottagare och förifylld text
// phone är medlemmens nummer, message är texten som ska skickas
// Returnerar en URL som öppnar WhatsApp
export function buildWhatsAppLink(phone: string, message: string): string {
  const number = toWhatsAppNumber(phone)
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
