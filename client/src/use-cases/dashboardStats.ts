// dashboardStats — räknar fram dashboardens nyckeltal (KPI:er) från appens data
// Ren affärslogik (use-case) — ingen React, lätt att testa separat
// Dagens datum skickas in som argument så logiken blir förutsägbar i test
//
// Används av: useDashboardStats

import type { Member } from "../domain/member"
import type { Service, Attendance } from "../domain/service"
import type { Contact } from "../domain/contact"
import { formatShortDate } from "../utils/dateUtils"

// De tre nyckeltal som visas i dashboardens StatCard-kort
export interface DashboardStats {
  memberCount: number // Totalt antal medlemmar
  presentThisWeek: number // Antal närvarande de senaste sju dagarna
  toContactCount: number // Antal medlemmar som väntar på kontakt
}

interface DashboardStatsInput {
  members: Member[]
  services: Service[]
  attendance: Attendance[]
  absenceReminders: Contact[] // förberäknade frånvaro-påminnelser (se buildAbsenceReminders)
  today: Date
}

// Antal millisekunder på ett dygn (för veckoberäkningen)
const ONE_DAY_MS = 24 * 60 * 60 * 1000

// Bygger dashboardens tre nyckeltal från appens data
// Tar members, services, attendance, contacts och dagens datum
// Returnerar { memberCount, presentThisWeek, toContactCount }
// Kan återanvändas av vilken vy som helst som behöver samma siffror
export function buildDashboardStats(input: DashboardStatsInput): DashboardStats {
  return {
    memberCount: input.members.length,
    presentThisWeek: countPresentThisWeek(input.services, input.attendance, input.today),
    toContactCount: input.absenceReminders.length,
  }
}

// Räknar närvaro-poster (status "present") för gudstjänster de senaste sju dagarna
// Tar gudstjänster, närvaro-poster och dagens datum
// Returnerar antalet närvarande under veckan
function countPresentThisWeek(services: Service[], attendance: Attendance[], today: Date): number {
  // Id:n för de gudstjänster som ligger inom veckan — slås upp snabbt via Set
  const weekServiceIds = new Set(
    services.filter((service) => isWithinLastWeek(service.date, today)).map((service) => service.id)
  )

  return attendance.filter((a) => a.status === "present" && weekServiceIds.has(a.serviceId)).length
}

// Skapar kontaktuppgifter automatiskt för medlemmar som inte deltagit på X veckor
// Regel från kravspec: "ej närvarat på X veckor" (X standard 4, per kyrka via backend senare)
// Tar medlemmar, gudstjänster, närvaro, dagens datum och antal veckor
// Returnerar en lista med Contact (påminnelser) att visa i "Att kontakta"
export function buildAbsenceReminders(
  members: Member[],
  services: Service[],
  attendance: Attendance[],
  today: Date,
  weeks = 4
): Contact[] {
  // Gräns: äldsta tillåtna närvaro-datum. Senast närvarande före detta = frånvarande
  const cutoff = today.getTime() - weeks * 7 * ONE_DAY_MS

  // Uppslag serviceId -> datum, för att slippa leta i listan varje gång
  const serviceDate = new Map(services.map((service) => [service.id, service.date]))

  // Samlar påminnelserna med sitt allvar (antal veckor) för att kunna sortera
  const scored: Array<{ contact: Contact; weeks: number }> = []

  for (const member of members) {
    const records = attendance.filter((a) => a.memberId === member.id)
    // Medlemmar utan någon närvaro-data hoppas över (ingen grund att bedöma)
    if (records.length === 0) continue

    // Datum då medlemmen senast var närvarande (sista efter sortering = senaste)
    const presentDates = records
      .filter((a) => a.status === "present")
      .map((a) => serviceDate.get(a.serviceId))
      .filter((date): date is string => date !== undefined)
      .sort()
    const lastPresent = presentDates.length > 0 ? presentDates[presentDates.length - 1] : undefined
    const lastPresentTime = lastPresent ? new Date(lastPresent + "T00:00:00").getTime() : null

    // Var närvarande nyligen -> ingen påminnelse behövs
    if (lastPresentTime !== null && lastPresentTime >= cutoff) continue

    // Aldrig närvarande räknas som mest angeläget (Infinity sorteras överst)
    const weeks = lastPresent ? weeksSince(lastPresent, today) : Infinity

    scored.push({
      contact: {
        id: "absence-" + member.id,
        name: member.name,
        phone: member.phone,
        email: member.email,
        reason: lastPresent ? `Frånvarande ${weeks} veckor` : "Ingen närvaro registrerad",
        status: "not-contacted",
      },
      weeks,
    })
  }

  // Mest frånvarande överst, så "dagens lista" visar de viktigaste först
  return scored.sort((a, b) => b.weeks - a.weeks).map((entry) => entry.contact)
}

// Räknar antal hela veckor mellan ett datum och idag
// Tar ett datum som ISO-text och dagens datum
// Returnerar antal veckor (avrundat nedåt)
function weeksSince(dateIso: string, today: Date): number {
  const then = new Date(dateIso + "T00:00:00").getTime()
  return Math.floor((today.getTime() - then) / (7 * ONE_DAY_MS))
}

// Plockar ut kommande gudstjänster (idag eller senare), tidigast först
// Tar gudstjänster, dagens datum och hur många som ska visas (standard 3)
// Returnerar en sorterad lista med de närmaste gudstjänsterna
// Kan återanvändas av valfri vy som vill visa "vad händer härnäst"
export function getUpcomingServices(services: Service[], today: Date, limit = 3): Service[] {
  const todayIso = toIsoDate(today)
  return services
    .filter((service) => service.date >= todayIso)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit)
}

// Plockar ut de personer som senast kontaktats, senast först
// Tar kontaktlistan och hur många som ska visas (standard 3)
// Returnerar bara kontakter som faktiskt har ett kontakt-datum
export function getRecentContacts(contacts: Contact[], limit = 3): Contact[] {
  return contacts
    .filter((contact) => contact.lastContactedAt)
    .sort((a, b) => (b.lastContactedAt ?? "").localeCompare(a.lastContactedAt ?? ""))
    .slice(0, limit)
}

// En punkt i närvaro-grafen: en gudstjänst med antal närvarande av totalt
export interface AttendancePoint {
  serviceId: string
  label: string // Kort datum för x-axeln, t.ex. "2 aug"
  present: number // Antal närvarande
  total: number // Antal avprickade (närvarande + frånvarande)
}

// Bygger närvaro-trenden för de senaste gudstjänsterna med avprickad närvaro
// Tar gudstjänster, närvaro-poster och hur många punkter som ska visas (standard 6)
// Returnerar en lista sorterad äldst först — klar att skickas till grafen
export function getAttendanceTrend(
  services: Service[],
  attendance: Attendance[],
  limit = 6
): AttendancePoint[] {
  return services
    .filter((service) => attendance.some((a) => a.serviceId === service.id))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-limit)
    .map((service) => {
      const records = attendance.filter((a) => a.serviceId === service.id)
      return {
        serviceId: service.id,
        label: formatShortDate(service.date),
        present: records.filter((a) => a.status === "present").length,
        total: records.length,
      }
    })
}

// Formaterar ett Date-objekt till ISO-datum ("YYYY-MM-DD") i lokal tid
// Byggs från lokala delar för att undvika tidszonsförskjutning
function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

// Avgör om ett datum ligger inom de senaste sju dagarna fram till idag
// Tar ett datum som ISO-text ("YYYY-MM-DD") och dagens datum
// Returnerar true om datumet är inom veckan
function isWithinLastWeek(dateIso: string, today: Date): boolean {
  const date = new Date(dateIso + "T00:00:00").getTime()
  const end = today.getTime()
  const start = end - 6 * ONE_DAY_MS
  return date >= start && date <= end
}
