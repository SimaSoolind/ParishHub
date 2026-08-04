// Services — visar lista över alla gudstjänster grupperade i kommande och tidigare
// Klick på en gudstjänst öppnar närvaro-avprickningen (AttendanceModal)
//
// Används av: App.tsx (sidan för URL "/gudstjanster")
// Bygger på: useServices (data via repository) och AttendanceModal
// Data: kommer från useServices — sidan vet INTE om det är mock eller databas

import { useState } from "react"
import { Plus, Calendar, FileText, Trash2, Check, Clock } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "../lib/errorHandler"
import { AddServiceModal } from "../components/AddServiceModal"
import { AttendanceModal } from "../components/AttendanceModal"
import { Badge } from "../components/Badge"
import { Skeleton } from "../components/Skeleton"
import { EmptyState } from "../components/EmptyState"
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
  onDelete,
}: {
  service: Service
  presentCount: number
  isMarked: boolean
  onClick: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const box = getDateBox(service.date)
  const weekday = getWeekday(service.date)

  // Sant när prästen klickat radera och ska bekräfta borttagningen
  const [confirmingDelete, setConfirmingDelete] = useState(false)

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

      {/* Höger sida: status-badge + radera-knapp, eller bekräftelse-läge */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {confirmingDelete ? (
          // stopPropagation så klick och tangent inte öppnar närvaro-modalen bakom
          <div
            className="flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <span className="text-xs text-soft hidden sm:inline">
              {t("profile.deleteQ", { name: service.title })}
            </span>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="px-3 py-1 rounded-lg text-xs btn-secondary text-soft"
            >
              {t("form.cancel")}
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 rounded-lg text-xs bg-red-700 text-white font-semibold hover:bg-red-800"
            >
              {t("profile.confirmDelete")}
            </button>
          </div>
        ) : (
          <>
            {isMarked ? (
              <Badge color="green">
                <Check size={12} aria-hidden="true" />
                {t("services.marked", { n: presentCount })}
              </Badge>
            ) : (
              <Badge color="amber">
                <Clock size={12} aria-hidden="true" />
                {t("services.notMarked")}
              </Badge>
            )}
            {/* Radera-knapp — stopPropagation så raden inte öppnar modalen */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setConfirmingDelete(true)
              }}
              onKeyDown={(e) => e.stopPropagation()}
              aria-label={t("services.delete")}
              className="p-1.5 rounded-full text-soft hover:text-red-700 dark:hover:text-red-400 row-hover"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </li>
  )
}

// Ritar gudstjänst-sidan: grupperad lista, Ny-gudstjänst-modal och närvaro-modal
// Tar inga props och returnerar sidan som JSX
export function Services() {
  const { t } = useTranslation()

  // Gudstjänster, närvaro och funktioner kommer från hooken (via repositoryt)
  const { services, attendance, loading, addService, saveNote, saveAttendance, removeService } =
    useServices()

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
  const handleAddService = async (newService: NewServiceData) => {
    try {
      await addService(newService)
      setAddModalOpen(false)
      toast.success(t("common.added"))
    } catch (error) {
      // Loggar internt och visar ett generellt fel — aldrig interna detaljer
      logError("Services.handleAddService", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Sparar närvaron för den valda gudstjänsten
  const handleSaveAttendance = async (records: Attendance[]) => {
    if (!selectedService) return
    try {
      await saveAttendance(selectedService.id, records)
      setSelectedService(null)
      toast.success(t("common.saved"))
    } catch (error) {
      logError("Services.handleSaveAttendance", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Sparar gudstjänstens anteckning (kortnotering)
  const handleSaveNote = async (note: string) => {
    if (!selectedService) return
    try {
      await saveNote(selectedService.id, note)
    } catch (error) {
      logError("Services.handleSaveNote", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Tar bort en gudstjänst (och dess närvaro) med felhantering och toast
  const handleDeleteService = async (id: string) => {
    try {
      await removeService(id)
      toast.success(t("common.removed"))
    } catch (error) {
      logError("Services.handleDeleteService", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  return (
    <>
      <header className="flex items-center justify-between mb-2">
        <h1 className="text-4xl font-serif font-bold text-strong">{t("services.title")}</h1>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800 text-white text-sm font-semibold hover:bg-amber-900"
        >
          <Plus size={16} />
          {t("services.add")}
        </button>
      </header>
      <p className="text-soft mb-6">{t("services.total", { total: services.length })}</p>

      {loading ? (
        <div
          className="surface border p-6 rounded-2xl shadow-sm space-y-3"
          aria-label={t("common.loading")}
        >
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : services.length === 0 ? (
        <div className="surface border p-6 rounded-2xl shadow-sm">
          <EmptyState
            icon={Calendar}
            title={t("services.empty")}
            action={
              <button
                onClick={() => setAddModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus size={16} aria-hidden="true" />
                {t("services.add")}
              </button>
            }
          />
        </div>
      ) : (
        <>
          {/* Kommande gudstjänster */}
          {upcoming.length > 0 && (
            <section className="mb-6">
              <h2 className="text-sm font-bold text-soft uppercase mb-2">
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
                      onDelete={() => handleDeleteService(service.id)}
                    />
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Tidigare gudstjänster */}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-soft uppercase mb-2">{t("services.past")}</h2>
              <div className="surface border p-4 rounded-2xl shadow-sm">
                <ul>
                  {past.map((service) => (
                    <ServiceRow
                      key={service.id}
                      service={service}
                      presentCount={getPresentCount(service.id)}
                      isMarked={getIsMarked(service.id)}
                      onClick={() => setSelectedService(service)}
                      onDelete={() => handleDeleteService(service.id)}
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
    </>
  )
}
