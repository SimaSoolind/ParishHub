// BottomNav — fast navigering längst ned på mobil
// Visas bara på små skärmar (md:hidden) och döljs på desktop där header-nav räcker
// Fyra flikar: Hem, Medlemmar, Kalender, Gudstjänster
//
// Används av: Layout.tsx

import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Home, Users, Calendar as CalendarIcon, Church, BookOpen } from "lucide-react"

// Fast ikon-navigation längst ned på mobil-skärmen
// Tar inga props — aktiv route hämtas via NavLink
export function BottomNav() {
  const { t } = useTranslation()

  // Touch-yta minst 56px hög (WCAG 2.5.5 kräver minst 44x44)
  const linkClass =
    "flex-1 flex flex-col items-center justify-center min-h-[56px] text-xs text-soft hover-accent"

  // Aktiv flik markeras med kopparfärg och fetstil (färg + fetstil, inte bara färg)
  const activeClass = "text-accent font-semibold"

  // Bygger className beroende på om fliken är aktiv (undviker upprepning per flik)
  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    isActive ? linkClass + " " + activeClass : linkClass

  return (
    <nav
      aria-label={t("nav.mobile")}
      className="md:hidden fixed bottom-0 left-0 right-0 surface border-t shadow-lg z-40"
    >
      <div className="flex">
        <NavLink to="/" end className={linkClassName}>
          <Home size={22} aria-hidden="true" />
          <span className="mt-1">{t("nav.dashboard")}</span>
        </NavLink>
        <NavLink to="/medlemmar" className={linkClassName}>
          <Users size={22} aria-hidden="true" />
          <span className="mt-1">{t("nav.members")}</span>
        </NavLink>
        <NavLink to="/kalender" className={linkClassName}>
          <CalendarIcon size={22} aria-hidden="true" />
          <span className="mt-1">{t("nav.calendar")}</span>
        </NavLink>
        <NavLink to="/gudstjanster" className={linkClassName}>
          <Church size={22} aria-hidden="true" />
          <span className="mt-1">{t("nav.services")}</span>
        </NavLink>
        <NavLink to="/predikningar" className={linkClassName}>
          <BookOpen size={22} aria-hidden="true" />
          <span className="mt-1">{t("nav.sermons")}</span>
        </NavLink>
      </div>
    </nav>
  )
}
