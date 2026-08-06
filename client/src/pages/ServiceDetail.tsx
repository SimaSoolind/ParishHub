// ServiceDetail — detaljsida för EN gudstjänst (URL "/gudstjanster/:id")
// Ren yta för planering: visar gudstjänstens info och dess noteringar
// Närvaro finns INTE här — den ligger på Dashboard
//
// Används av: App.tsx (route "gudstjanster/:id")
// Bygger på: useServices (hittar gudstjänsten) och NotesPanel

import { useParams, Link } from "react-router-dom"
import { ArrowLeft, Calendar } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useServices } from "../hooks/useServices"
import { PlanningPanel } from "../components/PlanningPanel"
import { StreamingPanel } from "../components/StreamingPanel"
import { NotesPanel } from "../components/NotesPanel"
import { ServiceSummaryPanel } from "../components/ServiceSummaryPanel"
import { ServiceToolsMenu } from "../components/ServiceToolsMenu"
import { LiturgyScriptPanel } from "../components/LiturgyScriptPanel"
import { Skeleton } from "../components/Skeleton"
import { getWeekday } from "../utils/dateUtils"

// Ritar detaljsidan: tillbaka-länk, gudstjänstens rubrik och noterings-panelen
// Tar inga props (id kommer från URL:en via useParams)
// Returnerar sidan som JSX
export function ServiceDetail() {
  const { t } = useTranslation()

  // Id från URL:en, t.ex. "/gudstjanster/s3"
  const { id } = useParams()

  // Gudstjänsterna hämtas via hooken; rätt gudstjänst plockas ut på id
  const { services, loading, updateService } = useServices()
  const service = services.find((s) => s.id === id)

  return (
    <>
      <Link
        to="/gudstjanster"
        className="inline-flex items-center gap-1 text-sm text-accent hover:underline mb-4"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        {t("serviceDetail.back")}
      </Link>

      {loading ? (
        <Skeleton className="h-24 w-full" />
      ) : !service ? (
        <p className="text-soft">{t("serviceDetail.notFound")}</p>
      ) : (
        <>
          <header className="mb-6">
            <h1 className="text-4xl font-serif font-bold text-strong mb-2">{service.title}</h1>
            <p className="text-soft flex items-center gap-2">
              <Calendar size={16} aria-hidden="true" />
              {getWeekday(service.date)} · {service.startTime}
              {service.endTime ? "–" + service.endTime : ""}
            </p>
          </header>

          <ServiceToolsMenu />
          <ServiceSummaryPanel serviceId={service.id} />
          <PlanningPanel
            service={service}
            onSave={(changes) => updateService(service.id, changes)}
          />
          <LiturgyScriptPanel serviceId={service.id} serviceFeast={service.feast} />
          <StreamingPanel
            service={service}
            onSave={(changes) => updateService(service.id, changes)}
          />
          <NotesPanel serviceId={service.id} />
        </>
      )}
    </>
  )
}
