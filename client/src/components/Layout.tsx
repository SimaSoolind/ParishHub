// Layout — gemensam ram runt alla sidor
// Innehåller header, språkväxlare och en <Outlet> där aktuell sida sätts in
// Sätter även textriktning (RTL för arabiska) på hela sidan
//
// Används av: App.tsx (ramar in Dashboard, Members, Calendar, Services)

import { useEffect, useState, Suspense } from "react"
import { Outlet, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Settings as SettingsIcon } from "lucide-react"
import { ErrorBoundary } from "./ErrorBoundary"
import { PageLoader } from "./PageLoader"
import { BottomNav } from "./BottomNav"
import { SettingsDrawer } from "./SettingsDrawer"
import { useTheme } from "../hooks/useTheme"
import { useFontScale } from "../hooks/useFontScale"

// Ritar gemensam header med navigering, språkväxlare och en <Outlet>
// Tar inga props och returnerar sidramen som JSX
export function Layout() {
  const { t, i18n } = useTranslation()

  // Styr om inställnings-panelen (drawer) är öppen — nåbar från alla sidor
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Läser + applicerar sparade inställningar (tema, textstorlek) på hela appen
  // Själva reglagen finns i inställnings-panelen (SettingsDrawer)
  useTheme()
  useFontScale()

  // Sätter språk-kod och textriktning på hela sidan (RTL för arabiska)
  // Körs varje gång språket byts
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr"
  }, [i18n.language])

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-900 pb-20 md:pb-0">
      {/* Header — samma på alla sidor */}
      <header className="surface border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <Link to="/" className="text-2xl font-bold text-accent">
            ✝ {t("app.name")}
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex gap-4 text-sm text-soft">
              <Link to="/" className="hover-accent">
                {t("nav.dashboard")}
              </Link>
              <Link to="/medlemmar" className="hover-accent">
                {t("nav.members")}
              </Link>
              <Link to="/kalender" className="hover-accent">
                {t("nav.calendar")}
              </Link>
              <Link to="/gudstjanster" className="hover-accent">
                {t("nav.services")}
              </Link>
              <Link to="/predikningar" className="hover-accent">
                {t("nav.sermons")}
              </Link>
              <Link to="/sacraments" className="hover-accent">
                {t("nav.sacraments")}
              </Link>
            </nav>

            {/* Kugg-ikon → öppnar inställnings-panelen (språk, tema, textstorlek m.m.) */}
            <button
              onClick={() => setSettingsOpen(true)}
              aria-label={t("nav.settings")}
              className="p-2 rounded-lg text-soft hover-accent row-hover"
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Här sätts den aktuella sidan in */}
      <main className="max-w-4xl mx-auto p-6">
        {/* ErrorBoundary fångar fel i sidan så menyn lever kvar */}
        {/* Suspense visar PageLoader medan en lazy-sida laddas — header och main står kvar */}
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Fast bottennavigering — visas bara på mobil (md:hidden) */}
      <BottomNav />

      {/* Inställnings-panel — öppnas av kugg-ikonen, ligger över alla sidor */}
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
