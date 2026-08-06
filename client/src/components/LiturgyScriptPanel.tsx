// LiturgyScriptPanel — liturgi-manus på gudstjänstsidan med tre flikar
// Bibliotek (färdig liturgi), Ladda upp (egen fil) eller Manuellt (skriv in själv)
// Den fasta liturgin visas live utan AI — AI-tolkning behövs bara för predikan
//
// Används av: ServiceDetail
// Bygger på: LiturgyLibraryTab, LiturgyUploadTab, LiturgyManualTab

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { LiturgyLibraryTab } from "./LiturgyLibraryTab"
import { LiturgyUploadTab } from "./LiturgyUploadTab"
import { LiturgyManualTab } from "./LiturgyManualTab"

// Flikarnas ordning (texten översätts via t("liturgy.tabs." + tab))
const tabs = ["library", "upload", "manual"] as const
type Tab = (typeof tabs)[number]

interface Props {
  serviceId: string
  serviceFeast?: string | undefined
}

// Ritar panelen: flik-knappar + den aktiva flikens innehåll
// Tar emot serviceId (för manuellt-läget) och serviceFeast (för biblioteks-förval)
// Returnerar panelen som JSX
export function LiturgyScriptPanel({ serviceId, serviceFeast }: Props) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>("library")

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
      <h2 className="text-sm font-bold text-accent mb-4">{t("liturgy.title")}</h2>

      {/* Flikar */}
      <div role="tablist" aria-label={t("liturgy.title")} className="flex gap-2 mb-4 flex-wrap">
        {tabs.map((tabKey) => (
          <button
            key={tabKey}
            role="tab"
            aria-selected={tab === tabKey}
            onClick={() => setTab(tabKey)}
            className={
              "px-4 py-1.5 rounded-full text-sm font-semibold transition-colors " +
              (tab === tabKey
                ? "bg-amber-800 text-white"
                : "bg-white text-stone-600 border border-stone-200 hover:border-amber-800 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600")
            }
          >
            {t("liturgy.tabs." + tabKey)}
          </button>
        ))}
      </div>

      {/* Aktiv flik */}
      {tab === "library" && <LiturgyLibraryTab serviceFeast={serviceFeast} />}
      {tab === "upload" && <LiturgyUploadTab />}
      {tab === "manual" && <LiturgyManualTab serviceId={serviceId} />}

      <p className="text-xs text-faint mt-4">{t("liturgy.hint")}</p>
    </div>
  )
}
