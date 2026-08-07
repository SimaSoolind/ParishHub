// AttendanceCard — låter prästen pricka av närvaro direkt från Dashboard
// Listar gudstjänster med status; klick på "Pricka av" öppnar AttendanceModal
// Flyttat hit från Gudstjänst-sidan så den sidan kan fokusera på planering
//
// Används av: Dashboard.tsx
// Bygger på: useServices, useMembers, AttendanceModal, Badge

import { useState } from "react"
import { ClipboardCheck, Check, Clock } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "../lib/errorHandler"
import { AttendanceModal } from "./AttendanceModal"
import { Badge } from "./Badge"
import { useServices } from "../hooks/useServices"
import { useMembers } from "../hooks/useMembers"
import type { Service, Attendance } from "../domain/service"
import { getDateBox, getWeekday } from "../utils/dateUtils"

// Ritar närvaro-kortet med en lista gudstjänster och avprickning via modal
// Tar inga props (hämtar själv data via hooks)
// Returnerar kortet som JSX
export function AttendanceCard() {
  const { t } = useTranslation()

  // Gudstjänster + närvaro och funktioner för att spara, via repositoryt
  const { services, attendance, saveAttendance, saveNote } = useServices()

  // Medlemslistan behövs i närvaro-modalen
  const { members } = useMembers()

  // Gudstjänsten vars närvaro prickas av — null när modalen är stängd
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // Senast först — närvaro prickas oftast av efter gudstjänsten (visar högst sex)
  const recentFirst = [...services]
    .sort((first, second) => second.date.localeCompare(first.date))
    .slice(0, 6)

  // Räknar antal närvarande för en gudstjänst
  const getPresentCount = (serviceId: string) =>
    attendance.filter((record) => record.serviceId === serviceId && record.status === "present")
      .length

  // Sant om närvaron redan är avprickad (minst en post finns)
  const getIsMarked = (serviceId: string) =>
    attendance.some((record) => record.serviceId === serviceId)

  // Sparar närvaron för den valda gudstjänsten
  const handleSaveAttendance = async (records: Attendance[]) => {
    if (!selectedService) return
    try {
      await saveAttendance(selectedService.id, records)
      setSelectedService(null)
      toast.success(t("common.saved"))
    } catch (error) {
      logError("AttendanceCard.handleSaveAttendance", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Sparar gudstjänstens kortnotering (från modalen)
  const handleSaveNote = async (note: string) => {
    if (!selectedService) return
    try {
      await saveNote(selectedService.id, note)
    } catch (error) {
      logError("AttendanceCard.handleSaveNote", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardCheck size={18} className="text-accent" />
        <h2 className="text-sm font-bold text-accent">{t("attendanceCard.title")}</h2>
      </div>

      {recentFirst.length === 0 ? (
        <p className="text-sm text-faint italic">{t("attendanceCard.empty")}</p>
      ) : (
        <ul className="divide-y divide-rows">
          {recentFirst.map((service) => {
            const box = getDateBox(service.date)
            const marked = getIsMarked(service.id)

            return (
              <li key={service.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="date-box">
                    <span className="text-lg font-bold leading-none">{box.day}</span>
                    <span className="text-xs font-semibold">{box.month}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-strong truncate">{service.title}</div>
                    <div className="text-sm text-faint">
                      {getWeekday(service.date)} · {service.startTime}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {marked ? (
                    <Badge color="green">
                      <Check size={12} aria-hidden="true" />
                      {t("services.marked", { n: getPresentCount(service.id) })}
                    </Badge>
                  ) : (
                    <Badge color="amber">
                      <Clock size={12} aria-hidden="true" />
                      {t("services.notMarked")}
                    </Badge>
                  )}
                  <button
                    onClick={() => setSelectedService(service)}
                    className="px-3 py-1 rounded-full btn-secondary text-accent text-xs font-semibold"
                  >
                    {t("attendanceCard.cta")}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      {/* Närvaro-modal visas när en gudstjänst valts för avprickning */}
      {selectedService && (
        <AttendanceModal
          service={selectedService}
          members={members}
          attendance={attendance.filter((record) => record.serviceId === selectedService.id)}
          onSave={handleSaveAttendance}
          onSaveNote={handleSaveNote}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  )
}
