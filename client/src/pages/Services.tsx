// Services — visar lista över alla gudstjänster grupperade i kommande och tidigare
// Klick på en gudstjänst öppnar närvaro-avprickningen (AttendanceModal)
//
// Används av: App.tsx (sidan för URL "/gudstjanster")
// Bygger på: useServices (data via repository) och AttendanceModal
// Data: kommer från useServices — sidan vet INTE om det är mock eller databas

import { useState } from "react"
import { Plus, Calendar, FileText } from "lucide-react"
import { useTranslation } from "react-i18next"
import { AddServiceModal } from "../components/AddServiceModal"
import { AttendanceModal } from "../components/AttendanceModal"
import { Badge } from "../components/Badge"
import { useServices } from "../hooks/useServices"
import { useMembers } from "../hooks/useMembers"
import type { Service, NewServiceData, Attendance } from "../domain/service"
import { getTodayString, getDateBox, getWeekday } from "../utils/dateUtils"

// ServiceRow — en rad för en gudstjänst med datum-box, titel och status-badge
// Tar emot service, presentCount (antal närvarande), isMarked (om avprickad) och onClick
// Returnerar raden som JSX
function ServiceRow({
  service,
  presentCount,
  isMarked,
  onClick,
}: {
  service: Service
  presentCount: number
  isMarked: boolean
  onClick: () => void
}) {
  const { t } = useTranslation()
  const box = getDateBox(service.date)
  const weekday = getWeekday(service.date)

  return (
    <li
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
      role="button"
      tabIndex={0}
      className="flex items-center justify-between py-3 border-b border-stone-200 dark:border-stone-700 last:border-b-0 cursor-pointer row-hover rounded-lg px-2 -mx-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
    >
      <div className="flex items-center gap-3">
        {/* Datum-box för snabb visuell skanning */}
        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex-shrink-0 dark:bg-amber-950 dark:border-amber-900 dark:text-amber-300">
          <span className="text-lg font-bold leading-none">{box.day}</span>
          <span className="text-xs font-semibold">{box.month}</span>
        </div>
        <div>
          <div className="font-semibold text-strong">{service.title}</div>
          <div className="text-sm text-faint flex items-center gap-2 mt-1">
            <Calendar size={14} />
            {weekday} · {service.startTime}
            {service.endTime ? "–" + service.endTime : ""}
          </div>
          {/* Kort anteckning visas bara om den finns */}
          {service.notes && (
            <div className="text-xs text-faint flex items-center gap-1 mt-1">
              <FileText size={12} className="flex-shrink-0" />
              {service.notes}
            </div>
          )}
        </div>
      </div>

      {/* Status-badge: grön om avprickad, annars gul */}
      {isMarked ? (
        <Badge color="green">{t("services.marked", { n: presentCount })}</Badge>
      ) : (
        <Badge color="amber">{t("services.notMarked")}</Badge>
      )}
    </li>
  )
}

// Ritar gudstjänst-sidan: grupperad lista, Ny-gudstjänst-modal och närvaro-modal
// Tar inga props och returnerar sidan som JSX
export function Services() {
  const { t } = useTranslation()

  // Gudstjänster, närvaro och funktioner kommer från hooken (via repositoryt)
  const { services, attendance, loading, addService, saveNote, saveAttendance } = useServices()

  // Medlemslistan (för närvaro-modalen) hämtas också via repository
  const { members } = useMembers()

  const [addModalOpen, setAddModalOpen] = useState(false)

  // Gudstjänsten vars närvaro prickas av — null när modalen är stängd
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  const today = getTodayString()

  // Kommande gudstjänster (idag och framåt) — närmast först
  const upcoming = services
    .filter((s) => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))

  // Tidigare gudstjänster — senast genomförda först
  const past = services.filter((s) => s.date < today).sort((a, b) => b.date.localeCompare(a.date))

  // Räknar antal närvarande för en gudstjänst (läser från närvaro-listan)
  const getPresentCount = (serviceId: string) =>
    attendance.filter((a) => a.serviceId === serviceId && a.status === "present").length

  // Sant om närvaron är avprickad (det finns minst en post för gudstjänsten)
  const getIsMarked = (serviceId: string) => attendance.some((a) => a.serviceId === serviceId)

  // Körs när prästen sparar en ny gudstjänst — repositoryt skapar id:t
  const handleAddService = (newService: NewServiceData) => {
    addService(newService)
    setAddModalOpen(false)
  }

  // Sparar närvaron för den valda gudstjänsten
  const handleSaveAttendance = (records: Attendance[]) => {
    if (!selectedService) return
    saveAttendance(selectedService.id, records)
    setSelectedService(null)
  }

  // Sparar gudstjänstens anteckning (kortnotering)
  const handleSaveNote = (note: string) => {
    if (!selectedService) return
    saveNote(selectedService.id, note)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-strong">{t("services.title")}</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900"
        >
          <Plus size={16} />
          {t("services.add")}
        </button>
      </div>
      <p className="text-soft mb-6">{t("services.total", { total: services.length })}</p>

      {loading ? (
        <div className="surface border p-6 rounded-2xl shadow-sm">
          <p className="text-sm text-faint italic text-center py-4">{t("common.loading")}</p>
        </div>
      ) : services.length === 0 ? (
        <div className="surface border p-6 rounded-2xl shadow-sm">
          <p className="text-sm text-faint italic text-center py-4">{t("services.empty")}</p>
        </div>
      ) : (
        <>
          {/* Kommande gudstjänster */}
          {upcoming.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold text-faint uppercase mb-2">
                {t("services.upcoming")}
              </h2>
              <div className="surface border p-4 rounded-2xl shadow-sm">
                <ul>
                  {upcoming.map((service) => (
                    <ServiceRow
                      key={service.id}
                      service={service}
                      presentCount={getPresentCount(service.id)}
                      isMarked={getIsMarked(service.id)}
                      onClick={() => setSelectedService(service)}
                    />
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Tidigare gudstjänster */}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-faint uppercase mb-2">{t("services.past")}</h2>
              <div className="surface border p-4 rounded-2xl shadow-sm">
                <ul>
                  {past.map((service) => (
                    <ServiceRow
                      key={service.id}
                      service={service}
                      presentCount={getPresentCount(service.id)}
                      isMarked={getIsMarked(service.id)}
                      onClick={() => setSelectedService(service)}
                    />
                  ))}
                </ul>
              </div>
            </section>
          )}
        </>
      )}

      {addModalOpen && (
        <AddServiceModal onSave={handleAddService} onClose={() => setAddModalOpen(false)} />
      )}

      {/* Närvaro-modal visas när en gudstjänst klickats */}
      {selectedService && (
        <AttendanceModal
          service={selectedService}
          members={members}
          attendance={attendance.filter((a) => a.serviceId === selectedService.id)}
          onSave={handleSaveAttendance}
          onSaveNote={handleSaveNote}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  )
}
