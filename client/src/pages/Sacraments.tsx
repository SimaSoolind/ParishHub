// Sacraments — översiktssida för alla sakrament (URL "/sacraments")
// Läs-endast tabell med filter (typ + år) för statistik, rapporter och export
// Själva registreringen sker från medlemmens profil — inte här
//
// Används av: App.tsx (route "sacraments")
// Bygger på: useAllSacraments (data), useMembers (namn), filterSacraments/getSacramentYears

import { useState } from "react"
import { ScrollText } from "lucide-react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Chip } from "../components/Chip"
import { Badge } from "../components/Badge"
import { Skeleton } from "../components/Skeleton"
import { EmptyState } from "../components/EmptyState"
import { useAllSacraments } from "../hooks/useAllSacraments"
import { useMembers } from "../hooks/useMembers"
import { filterSacraments, getSacramentYears } from "../use-cases/sacraments"
import type { SacramentType } from "../domain/sacrament"
import { formatShortDate } from "../utils/dateUtils"

// Alla typer i den ordning de visas som filter-chips
const sacramentTypes: SacramentType[] = [
  "baptism",
  "chrismation",
  "firstCommunion",
  "confession",
  "marriage",
  "ordination",
  "unction",
  "funeral",
  "other",
]

// Ritar översiktssidan: typ- och år-filter samt en läs-endast tabell
// Tar inga props och returnerar sidan som JSX
export function Sacraments() {
  const { t } = useTranslation()

  // Alla sakrament + alla medlemmar (för att visa medlemmens namn)
  const { sacraments, loading } = useAllSacraments()
  const { members } = useMembers()

  // Filter-state: tom typ/tomt år = alla
  const [type, setType] = useState<SacramentType | "">("")
  const [year, setYear] = useState("")

  // Tillgängliga år + den filtrerade listan (logik i use-case)
  const years = getSacramentYears(sacraments)
  const visible = filterSacraments(sacraments, type, year)

  // Snabb uppslagning medlemsnamn på id
  const nameById = new Map(members.map((member) => [member.id, member.name]))

  return (
    <>
      <header className="mb-2">
        <h1 className="text-4xl font-serif font-bold text-strong">
          {t("sacramentsOverview.title")}
        </h1>
      </header>
      <p className="text-soft mb-6">{t("sacramentsOverview.subtitle")}</p>

      {/* Filter: typ + år */}
      <div className="space-y-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <Chip active={type === ""} onClick={() => setType("")}>
            {t("sacramentsOverview.allTypes")}
          </Chip>
          {sacramentTypes.map((sacramentType) => (
            <Chip
              key={sacramentType}
              active={type === sacramentType}
              onClick={() => setType(sacramentType)}
            >
              {t("sacraments.type." + sacramentType)}
            </Chip>
          ))}
        </div>
        {years.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Chip active={year === ""} onClick={() => setYear("")}>
              {t("sacramentsOverview.allYears")}
            </Chip>
            {years.map((yearOption) => (
              <Chip
                key={yearOption}
                active={year === yearOption}
                onClick={() => setYear(yearOption)}
              >
                {yearOption}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div
          className="surface border p-6 rounded-2xl shadow-sm space-y-3"
          aria-label={t("common.loading")}
        >
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : sacraments.length === 0 ? (
        <div className="surface border p-6 rounded-2xl shadow-sm">
          <EmptyState icon={ScrollText} title={t("sacramentsOverview.empty")} />
        </div>
      ) : visible.length === 0 ? (
        <div className="surface border p-6 rounded-2xl shadow-sm">
          <p className="text-sm text-faint italic">{t("sacramentsOverview.noResults")}</p>
        </div>
      ) : (
        // Tabellen scrollar i sidled på små skärmar (bryter inte sid-layouten)
        <div className="surface border rounded-2xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-faint border-b border-stone-200 dark:border-stone-700">
                <th className="px-4 py-3 font-semibold">{t("sacramentsOverview.colMember")}</th>
                <th className="px-4 py-3 font-semibold">{t("sacramentsOverview.colType")}</th>
                <th className="px-4 py-3 font-semibold">{t("sacramentsOverview.colDate")}</th>
                <th className="px-4 py-3 font-semibold">{t("sacramentsOverview.colOfficiant")}</th>
                <th className="px-4 py-3 font-semibold">{t("sacramentsOverview.colPlace")}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((sacrament) => (
                <tr
                  key={sacrament.id}
                  className="border-b border-stone-200 last:border-b-0 dark:border-stone-700"
                >
                  <td className="px-4 py-3">
                    {/* Klick öppnar medlemmens profil (där registrering sker) */}
                    <Link
                      to={"/medlemmar/" + sacrament.memberId}
                      className="text-accent hover:underline"
                    >
                      {nameById.get(sacrament.memberId) ?? "—"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color="blue">{t("sacraments.type." + sacrament.type)}</Badge>
                  </td>
                  <td className="px-4 py-3 text-soft whitespace-nowrap">
                    {formatShortDate(sacrament.date)}
                  </td>
                  <td className="px-4 py-3 text-soft">{sacrament.officiant}</td>
                  <td className="px-4 py-3 text-faint">{sacrament.place ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Läs-endast: registrering och ändring sker från medlemsprofilen */}
      <p className="text-xs text-faint italic mt-4">{t("sacramentsOverview.readonly")}</p>
    </>
  )
}
