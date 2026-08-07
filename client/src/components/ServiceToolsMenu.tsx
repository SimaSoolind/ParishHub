// ServiceToolsMenu — meny på gudstjänstsidan med genvägar till verktyg
// Samma kort-stil som startsidan så det är lätt att hitta för en icke-teknisk präst
// Länkar vidare till AI-tolkning live och predikobiblioteket
//
// Används av: ServiceDetail

import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Languages, BookOpen, type LucideIcon } from "lucide-react"
import { Card } from "./Card"

// Ett verktyg i menyn: vart det länkar, ikon och vilken i18n-nyckel som används
interface Tool {
  to: string
  icon: LucideIcon
  key: string
}

// Verktygen som visas — läggs till här om fler genvägar behövs (DRY, ingen upprepad JSX)
const tools: Tool[] = [
  { to: "/live", icon: Languages, key: "live" },
  { to: "/predikningar", icon: BookOpen, key: "sermons" },
]

// Ritar verktygs-menyn som en lista med länk-kort
// Tar inga props
// Returnerar menyn som JSX
export function ServiceToolsMenu() {
  const { t } = useTranslation()

  return (
    <Card title={t("serviceTools.title")}>
      <ul className="grid gap-3 sm:grid-cols-2">
        {tools.map(({ to, icon: Icon, key }) => (
          <li key={key}>
            <Link
              to={to}
              className="flex items-start gap-3 border border-stone-200 rounded-xl p-4 row-hover dark:border-stone-700"
            >
              <Icon size={22} className="text-accent flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <span className="block font-semibold text-strong">
                  {t("serviceTools." + key + ".label")}
                </span>
                <span className="block text-sm text-soft">
                  {t("serviceTools." + key + ".desc")}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  )
}
