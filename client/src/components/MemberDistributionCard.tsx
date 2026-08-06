// MemberDistributionCard — cirkeldiagram över medlemsfördelning per kategori
// Klick på ett segment tar prästen till medlemslistan filtrerad på kategorin
//
// Används av: Dashboard.tsx
// Bygger på: useMembers (data), countByCategory (logik), DashboardPieChart

import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { DashboardPieChart } from "./DashboardPieChart"
import { useMembers } from "../hooks/useMembers"
import { countByCategory } from "../use-cases/memberStats"

// Ritar medlemsfördelnings-diagrammet
// Tar inga props (hämtar själv data via hooken)
// Returnerar diagram-kortet som JSX
export function MemberDistributionCard() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { members } = useMembers()

  // Översätter kategori-nycklarna till etiketter för diagrammet
  const data = countByCategory(members).map((count) => ({
    key: count.key,
    label: t("members.filter." + count.key),
    value: count.value,
  }))

  return (
    <DashboardPieChart
      title={t("dashboard.distribution")}
      data={data}
      onSliceClick={(key) => navigate("/medlemmar?kategori=" + key)}
    />
  )
}
