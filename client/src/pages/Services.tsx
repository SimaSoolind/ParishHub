// Services — visar lista över alla gudstjänster grupperade i kommande och tidigare
// Klick på en gudstjänst öppnar dess detaljsida (planering + noteringar)
// Närvaro finns INTE här längre — den ligger på Dashboard
//
// Används av: App.tsx (sidan för URL "/gudstjanster")
// Bygger på: useServices (data via repository) och navigering till detaljsidan

import { useState } from "react"
import { Calendar, FileText, Trash2, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "../lib/errorHandler"
import { AddButton } from "../components/AddButton"
import { AddServiceModal } from "../components/AddServiceModal"
import { Skeleton } from "../components/Skeleton"
import { EmptyState } from "../components/EmptyState"
import { useServices } from "../hooks/useServices"
import type { Service, NewServiceData } from "../domain/service"
import { getTodayString, getDateBox, getWeekday } from "../utils/dateUtils"

// ServiceRow — en rad för en gudstjänst med datum-box, titel samt öppna/radera
// Tar emot service, onOpen (öppnar detaljsidan) och onDelete
// Returnerar raden som JSX
function ServiceRow({
  service,
  onOpen,
  onDelete,
}: {
  service: Service
  onOpen: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const box = getDateBox(service.date)
  const weekday = getWeekday(service.date)

  // Sant när prästen klickat radera och ska bekräfta borttagningen
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  return (
    <li
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onOpen()
        }
      }}
      role="button"
      tabIndex={0}
      className="flex items-center justify-between py-3 border-b border-stone-200 dark:border-stone-700 last:border-b-0 cursor-pointer row-hover rounded-lg px-2 -mx-2 focus:outline-none focus:ring-2 focus:ring-amber-700"
    >
      <div className="flex items-center gap-3">
        {/* Datum-box för snabb visuell skanning (delad klass i index.css) */}
        <div className="date-box">
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

      {/* Höger sida: radera-knapp (eller bekräftelse) + chevron som visar att raden öppnar */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {confirmingDelete ? (
          // stopPropagation så klick och tangent inte öppnar detaljsidan bakom
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
            {/* Radera-knapp — stopPropagation så raden inte öppnar detaljsidan */}
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
            <ChevronRight size={18} className="text-faint" aria-hidden="true" />
          </>
        )}
      </div>
    </li>
  )
}

// Ritar gudstjänst-sidan: grupperad lista och Ny-gudstjänst-modal
// Tar inga props och returnerar sidan som JSX
export function Services() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Gudstjänster och funktioner kommer från hooken (via repositoryt)
  const { services, loading, addService, removeService } = useServices()

  const [addModalOpen, setAddModalOpen] = useState(false)

  const today = getTodayString()

  // Kommande gudstjänster (idag och framåt) — närmast först
  const upcoming = services
    .filter((s) => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))

  // Tidigare gudstjänster — senast genomförda först
  const past = services.filter((s) => s.date < today).sort((a, b) => b.date.localeCompare(a.date))

  // Öppnar detaljsidan för en gudstjänst
  const openService = (id: string) => navigate("/gudstjanster/" + id)

  // Körs när prästen sparar en ny gudstjänst — repositoryt skapar id:t
  const handleAddService = async (newService: NewServiceData) => {
    try {
      await addService(newService)
      setAddModalOpen(false)
      toast.success(t("common.added"))
    } catch (error) {
      logError("Services.handleAddService", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  // Tar bort en gudstjänst med felhantering och toast
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
        <AddButton label={t("services.add")} onClick={() => setAddModalOpen(true)} />
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
            action={<AddButton label={t("services.add")} onClick={() => setAddModalOpen(true)} />}
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
                      onOpen={() => openService(service.id)}
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
                      onOpen={() => openService(service.id)}
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
    </>
  )
}
