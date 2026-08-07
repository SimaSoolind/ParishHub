// SettingsDrawer — inställningar som utfällbar sido-panel (drawer)
// Öppnas från kugg-ikonen i headern och är därför nåbar från alla sidor
// Sektioner i kort med versala rubriker: utseende, språk & region, församling, GDPR
// Tema/språk/textstorlek bor HÄR (ett ställe) — headern har bara en kugg-ikon
//
// Används av: Layout
// Bygger på: useTheme, useFontScale, useCalendarSystem, i18n samt de återanvändbara
// komponenterna ToggleSwitch, SegmentedControl och IconBadge

import { useEffect } from "react"
import { Moon, Sun, Palette, Globe, Church, ShieldCheck, Download, Trash2, X } from "lucide-react"
import { useTranslation } from "react-i18next"
import { FocusTrap } from "focus-trap-react"
import { toast } from "sonner"
import { ToggleSwitch } from "./ToggleSwitch"
import { SegmentedControl } from "./SegmentedControl"
import { IconBadge } from "./IconBadge"
import { useTheme } from "../hooks/useTheme"
import { useFontScale, type FontScale } from "../hooks/useFontScale"
import { useCalendarSystem, type CalendarSystem } from "../hooks/useCalendarSystem"

// Tillåtna textstorlekar i ordning (80–200 procent, WCAG 1.4.4)
const fontScales: FontScale[] = [0.8, 1, 1.2, 1.4, 2]

// Gemensam stil för sektionsrubriker: liten, halvfet, versal med glesare bokstäver
const sectionHeading =
  "mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-accent"

interface Props {
  open: boolean
  onClose: () => void
}

// Ritar inställnings-panelen som glider in från sidan
// Tar emot open (om panelen visas) och onClose (stäng)
// Returnerar panelen som JSX, eller null när den är stängd
export function SettingsDrawer({ open, onClose }: Props) {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { scale, setScale } = useFontScale()
  const { system, setSystem } = useCalendarSystem()

  // Stänger panelen när Escape trycks (tillgänglighet)
  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  if (!open) return null

  // Nuvarande position i textstorleks-listan (för slidern) och procent för etiketten
  const currentIndex = Math.max(0, fontScales.indexOf(scale))
  const fontPercent = Math.round(scale * 100)

  // GDPR: laddar ner de inställningar som appen sparar lokalt som en JSON-fil
  // Fullständig dataexport (medlemsdata från databasen) byggs med backend
  const handleExport = () => {
    const data = {
      theme,
      fontScale: scale,
      language: i18n.language,
      calendarSystem: system,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "parishhub-mina-installningar.json"
    link.click()
    URL.revokeObjectURL(url)
    toast.success(t("settings.exported"))
  }

  return (
    <FocusTrap focusTrapOptions={{ returnFocusOnDeactivate: true, escapeDeactivates: false }}>
      <div className="drawer-enter fixed inset-0 z-50">
        {/* Bakgrund — mörkare så panelen sticker ut tydligt. Klick stänger panelen */}
        <div onClick={onClose} className="absolute inset-0 bg-black/60" aria-hidden="true" />

        {/* Panelen — varm sandton, glider in från slut-sidan (höger i LTR, vänster i RTL) */}
        {/* Tydlig kant + kraftig skugga skiljer panelen från den mörklagda bakgrunden */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={t("settings.title")}
          className="absolute top-0 ltr:right-0 rtl:left-0 h-full w-full max-w-sm overflow-y-auto border-s-2 border-stone-200 bg-[#FDFBF7] p-6 shadow-2xl dark:border-stone-700 dark:bg-stone-900"
        >
          {/* Rubrik-rad med rund stäng-knapp som reagerar vid hover */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-strong">{t("settings.title")}</h2>
            <button
              onClick={onClose}
              aria-label={t("form.close")}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-amber-100 hover:text-amber-800 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-amber-950 dark:hover:text-amber-300"
            >
              <X size={18} />
            </button>
          </div>

          {/* UTSEENDE — mörkt läge + textstorlek */}
          <section className="surface border rounded-xl p-4 mb-4">
            <h3 className={sectionHeading}>
              <IconBadge icon={Palette} />
              {t("settings.appearance")}
            </h3>

            <div className="flex items-center justify-between py-2">
              <span className="text-strong">{t("settings.darkMode")}</span>
              <ToggleSwitch
                checked={theme === "dark"}
                onChange={toggleTheme}
                ariaLabel={t("settings.darkMode")}
                iconOn={<Moon size={14} />}
                iconOff={<Sun size={14} />}
              />
            </div>

            <div className="py-2">
              <div className="mb-3 text-strong">{t("settings.fontSize")}</div>
              <div className="flex items-center gap-3">
                {/* Litet och stort A i ändarna visar reglagets riktning */}
                <span className="text-sm text-faint" aria-hidden="true">
                  A
                </span>
                <input
                  type="range"
                  min={0}
                  max={fontScales.length - 1}
                  step={1}
                  value={currentIndex}
                  onChange={(event) => {
                    const next = fontScales[Number(event.target.value)]
                    if (next) setScale(next)
                  }}
                  aria-label={t("settings.fontSize")}
                  aria-valuetext={fontPercent + "%"}
                  className="flex-1 accent-amber-800"
                />
                <span className="text-2xl text-faint" aria-hidden="true">
                  A
                </span>
              </div>
              <p className="mt-1 text-center text-xs text-faint">{fontPercent}%</p>
            </div>
          </section>

          {/* SPRÅK & REGION — språk + kalendersystem */}
          <section className="surface border rounded-xl p-4 mb-4">
            <h3 className={sectionHeading}>
              <IconBadge icon={Globe} />
              {t("settings.languageRegion")}
            </h3>

            <div className="flex items-center justify-between gap-3 flex-wrap py-2">
              <span className="text-strong">{t("settings.language")}</span>
              <SegmentedControl
                ariaLabel={t("settings.language")}
                value={i18n.language}
                onChange={(value) => i18n.changeLanguage(value)}
                options={[
                  { value: "sv", label: "Svenska" },
                  { value: "ar", label: "العربية" },
                ]}
              />
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap py-2">
              <span className="text-strong">{t("settings.calendar")}</span>
              <SegmentedControl
                ariaLabel={t("settings.calendar")}
                value={system}
                onChange={(value) => setSystem(value as CalendarSystem)}
                options={[
                  { value: "gregorian", label: t("settings.calendarSystem.gregorian") },
                  { value: "julian", label: t("settings.calendarSystem.julian") },
                ]}
              />
            </div>
            <p className="mt-1 text-xs text-faint">{t("settings.calendarHint")}</p>
          </section>

          {/* FÖRSAMLING — multi-kyrka (post-MVP) */}
          <section className="surface border rounded-xl p-4 mb-4">
            <h3 className={sectionHeading}>
              <IconBadge icon={Church} />
              {t("settings.church")}
            </h3>
            <p className="text-sm text-faint">{t("settings.churchComing")}</p>
          </section>

          {/* INTEGRITET / GDPR */}
          <section className="surface border rounded-xl p-4">
            <h3 className={sectionHeading}>
              <IconBadge icon={ShieldCheck} />
              {t("settings.privacy")}
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 btn-secondary text-soft w-fit transition-colors"
              >
                <Download size={16} />
                {t("settings.exportData")}
              </button>
              <p className="text-xs text-faint">{t("settings.exportHint")}</p>

              {/* Radera konto kräver inloggning — inaktiv tills backend finns */}
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-400 w-fit opacity-60 cursor-not-allowed dark:border-red-900"
              >
                <Trash2 size={16} />
                {t("settings.deleteAccount")}
              </button>
              <p className="text-xs text-faint">{t("settings.deleteHint")}</p>
            </div>
          </section>
        </aside>
      </div>
    </FocusTrap>
  )
}
