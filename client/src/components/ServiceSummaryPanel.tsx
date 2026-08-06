// ServiceSummaryPanel — visar sammanfattningsrapport för en gudstjänst
// Närvarograd, antal närvarande/frånvarande och jämförelse mot snittet
//
// Används av: ServiceDetail
// Bygger på: useServiceSummary (data + logik), Badge och Skeleton

import { useTranslation } from "react-i18next"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useServiceSummary } from "../hooks/useServiceSummary"
import { Badge } from "./Badge"
import { Skeleton } from "./Skeleton"

interface Props {
  serviceId: string
}

// Ritar rapport-kortet: närvarograd, antal och skillnad mot snittet
// Tar emot serviceId (vilken gudstjänst rapporten gäller)
// Returnerar kortet som JSX
export function ServiceSummaryPanel({ serviceId }: Props) {
  const { t } = useTranslation()
  const { summary, loading } = useServiceSummary(serviceId)

  if (loading) return <Skeleton className="h-32 w-full mb-6" />

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
      <h2 className="text-sm font-bold text-accent mb-4">{t("serviceSummary.title")}</h2>

      {!summary || !summary.hasData ? (
        <p className="text-sm text-faint italic">{t("serviceSummary.noData")}</p>
      ) : (
        <div className="space-y-4">
          {/* Stora talet: närvarograd i procent */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-strong">{summary.rate}%</span>
            <span className="text-sm text-soft">{t("serviceSummary.rate")}</span>
          </div>

          {/* Antal närvarande, frånvarande och totalt avprickade */}
          <div className="flex gap-2 flex-wrap">
            <Badge color="green">{t("serviceSummary.present", { n: summary.present })}</Badge>
            <Badge color="red">{t("serviceSummary.absent", { n: summary.absent })}</Badge>
            <Badge color="blue">{t("serviceSummary.total", { n: summary.total })}</Badge>
          </div>

          {/* Jämförelse mot snittet — färg och ikon speglar riktningen */}
          <ComparisonRow diff={summary.diffFromAverage} average={summary.averageRate} />
        </div>
      )}
    </div>
  )
}

// Visar en rad som jämför gudstjänsten mot snittet
// Tar diff (procentenheter över/under snittet) och average (snittet)
// Returnerar raden med ikon, färg och text
function ComparisonRow({ diff, average }: { diff: number; average: number }) {
  const { t } = useTranslation()

  // Väljer ikon, färg och nyckel efter om gudstjänsten ligger över, under eller på snittet
  const Icon = diff > 0 ? TrendingUp : diff < 0 ? TrendingDown : Minus
  const colorClass =
    diff > 0
      ? "text-green-700 dark:text-green-400"
      : diff < 0
        ? "text-red-700 dark:text-red-400"
        : "text-soft"
  const messageKey =
    diff > 0 ? "serviceSummary.above" : diff < 0 ? "serviceSummary.below" : "serviceSummary.equal"

  return (
    <div className={"flex items-center gap-2 text-sm " + colorClass}>
      <Icon size={16} aria-hidden="true" />
      <span>{t(messageKey, { diff: Math.abs(diff), average })}</span>
    </div>
  )
}
