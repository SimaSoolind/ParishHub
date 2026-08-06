// useServiceSummary — presentation-hook för en gudstjänsts sammanfattningsrapport
// Hämtar gudstjänster + närvaro via repositoryt och räknar fram närvarograd + snitt
//
// Används av: ServiceSummaryPanel

import { useState, useEffect } from "react"
import { mockServiceRepository as repository } from "../data/mock/mockServiceRepository"
import { buildServiceSummary, type ServiceSummary } from "../use-cases/serviceSummary"

// Ger sammanfattningsrapporten för en gudstjänst
// Tar serviceId (vilken gudstjänst rapporten gäller)
// Returnerar summary (eller null medan datan laddas) och loading
export function useServiceSummary(serviceId: string) {
  const [summary, setSummary] = useState<ServiceSummary | null>(null)
  const [loading, setLoading] = useState(true)

  // Hämtar gudstjänster + närvaro och bygger rapporten
  useEffect(() => {
    Promise.all([repository.getAll(), repository.getAttendance()]).then(
      ([services, attendance]) => {
        setSummary(buildServiceSummary(services, attendance, serviceId))
        setLoading(false)
      }
    )
  }, [serviceId])

  return { summary, loading }
}
