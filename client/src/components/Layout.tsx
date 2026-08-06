// Layout — gemensam ram runt alla sidor
// Innehåller header, språkväxlare och en <Outlet> där aktuell sida sätts in
// Sätter även textriktning (RTL för arabiska) på hela sidan
//
// Används av: App.tsx (ramar in Dashboard, Members, Calendar, Services)

import { useEffect, Suspense } from "react"
import { Outlet, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Sun, Moon, Type } from "lucide-react"
import { ErrorBoundary } from "./ErrorBoundary"
import { PageLoader } from "./PageLoader"
import { BottomNav } from "./BottomNav"
import { useTheme } from "../hooks/useTheme"
import { useFontScale, type FontScale } from "../hooks/useFontScale"

// Ritar gemensam header med navigering, språkväxlare och en <Outlet>
// Tar inga props och returnerar sidramen som JSX
export function Layout() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { scale, setScale } = useFontScale()

  // Tillåtna textstorlekar i ordning (80–200 procent)
  const fontScales: FontScale[] = [0.8, 1, 1.2, 1.4, 2]

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

            {/* Språkväxlare — byter mellan svenska och arabiska */}
            <div className="flex gap-1 bg-stone-100 rounded-lg p-1 border border-stone-200 dark:bg-stone-700 dark:border-stone-600">
              {(["sv", "ar"] as const).map((lng) => (
                <button
                  key={lng}
                  onClick={() => i18n.changeLanguage(lng)}
                  className={
                    "px-2 py-1 rounded text-xs font-semibold " +
                    (i18n.language === lng ? "bg-amber-800 text-white" : "text-soft hover-accent")
                  }
                >
                  {lng === "sv" ? "SV" : "AR"}
                </button>
              ))}
            </div>

            {/* Tema-knapp — växlar mellan ljust och mörkt läge */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
              className="p-2 rounded-lg text-soft hover-accent row-hover"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Textstorlek — skalar all text (WCAG 1.4.4, bra vid nedsatt syn) */}
            <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-1 border border-stone-200 dark:bg-stone-700 dark:border-stone-600">
              <Type size={16} aria-hidden="true" className="text-faint" />
              {fontScales.map((s) => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  aria-pressed={scale === s}
                  aria-label={t("a11y.fontScale", { percent: Math.round(s * 100) })}
                  className={
                    "px-2 py-1 rounded text-xs font-semibold " +
                    (scale === s ? "bg-amber-800 text-white" : "text-soft hover-accent")
                  }
                >
                  {Math.round(s * 100)}%
                </button>
              ))}
            </div>
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
    </div>
  )
}
