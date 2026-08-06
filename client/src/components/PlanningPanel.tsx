// PlanningPanel — låter prästen sätta högtid och bibeltexter för en gudstjänst
// Del av gudstjänst-planeringen (Modul 2): "Välj högtid -> Koppla bibeltexter"
//
// Används av: ServiceDetail
// Bygger på: updateService (skickas in som onSave från ServiceDetail)

import { useState } from "react"
import { CalendarHeart, Save } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { logError, getErrorMessageKey } from "../lib/errorHandler"
import type { Service, NewServiceData } from "../domain/service"

interface Props {
  service: Service
  onSave: (changes: Partial<NewServiceData>) => Promise<void>
}

// Ritar planerings-panelen med fält för högtid och bibeltexter
// Tar emot service (nuvarande värden) och onSave (sparar ändringarna)
// Returnerar panelen som JSX
export function PlanningPanel({ service, onSave }: Props) {
  const { t } = useTranslation()

  // Formulär-state, förifyllt med gudstjänstens nuvarande värden
  const [feast, setFeast] = useState(service.feast ?? "")
  const [bibleText, setBibleText] = useState(service.bibleText ?? "")

  // Sparar högtid och bibeltexter (tomt fält blir undefined)
  const handleSave = async () => {
    try {
      await onSave({ feast: feast.trim() || undefined, bibleText: bibleText.trim() || undefined })
      toast.success(t("common.saved"))
    } catch (error) {
      logError("PlanningPanel.handleSave", error)
      toast.error(t(getErrorMessageKey(error)))
    }
  }

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <CalendarHeart size={18} className="text-accent" />
        <h2 className="text-sm font-bold text-accent">{t("planning.title")}</h2>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="planning-feast" className="block text-sm text-soft mb-1">
            {t("planning.feast")}
          </label>
          <input
            id="planning-feast"
            value={feast}
            onChange={(e) => setFeast(e.target.value)}
            placeholder={t("planning.feastPlaceholder")}
            className="field"
          />
        </div>
        <div>
          <label htmlFor="planning-bible" className="block text-sm text-soft mb-1">
            {t("planning.bibleText")}
          </label>
          <textarea
            id="planning-bible"
            value={bibleText}
            onChange={(e) => setBibleText(e.target.value)}
            placeholder={t("planning.biblePlaceholder")}
            rows={2}
            className="field"
          />
        </div>
        <button onClick={handleSave} className="btn-primary inline-flex items-center gap-2">
          <Save size={16} aria-hidden="true" />
          {t("planning.save")}
        </button>
      </div>
    </div>
  )
}
