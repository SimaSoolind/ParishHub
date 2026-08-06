// UpcomingServices visar kommande gudstjänster (idag eller senare)
// Varje rad har en datum-box, titel och veckodag + tid
//
// Används av: Dashboard.tsx
// Bygger på: getDateBox och getWeekday (datum-hjälp)

import { CalendarDays } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import type { Service } from "../domain/service"
import { getDateBox, getWeekday } from "../utils/dateUtils"

interface Props {
  services: Service[]
}

// Ritar en lista med kommande gudstjänster, en rad per gudstjänst
// Tar emot en lista med Service-objekt som prop
// Returnerar listan som JSX (eller ett tomt tillstånd om inga finns)
export function UpcomingServices({ services }: Props) {
  const { t } = useTranslation()

  // Sant när inga kommande gudstjänster finns
  const isEmpty = services.length === 0

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mt-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays size={18} className="text-accent" />
        <h2 className="text-sm font-bold text-accent">{t("upcomingServices.title")}</h2>
      </div>

      {isEmpty ? (
        <p className="text-sm text-faint italic">{t("upcomingServices.empty")}</p>
      ) : (
        <ul className="divide-y divide-rows">
          {services.map((service) => {
            // Dag och månad till datum-boxen
            const box = getDateBox(service.date)

            return (
              <li key={service.id}>
                {/* Hela raden är en länk till Gudstjänster-sidan (semantisk, tangentbords-nåbar) */}
                <Link
                  to="/gudstjanster"
                  className="flex items-center gap-4 py-3 px-2 -mx-2 rounded-lg row-hover focus:outline-none focus:ring-2 focus:ring-amber-700"
                >
                  <div className="date-box">
                    <span className="text-lg font-bold leading-none">{box.day}</span>
                    <span className="text-xs font-semibold">{box.month}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-strong">{service.title}</div>
                    <div className="text-sm text-faint mt-1">
                      {getWeekday(service.date)} · {service.startTime}
                      {service.endTime ? "–" + service.endTime : ""}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
