// LanguageDirectionSelector — väljer riktning på tolkningen (AR->SV eller SV->AR)
// Operatören byter manuellt när talaren växlar språk (ingen auto-detektion i v1)
//
// Används av: LiveControl

import { useTranslation } from "react-i18next"
import type { LanguageDirection } from "../domain/liveSession"

// De två möjliga riktningarna
const AR_TO_SV: LanguageDirection = { source: "ar", target: "sv" }
const SV_TO_AR: LanguageDirection = { source: "sv", target: "ar" }
const options = [AR_TO_SV, SV_TO_AR]

interface Props {
  direction: LanguageDirection
  onChange: (direction: LanguageDirection) => void
}

// Ritar två knappar för riktningen; den aktiva markeras i koppar
// Tar emot direction (vald riktning) och onChange (körs vid byte)
// Returnerar väljaren som JSX
export function LanguageDirectionSelector({ direction, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <div role="group" aria-label={t("live.direction")} className="flex gap-2 flex-wrap">
      {options.map((option) => {
        const isActive = direction.source === option.source
        return (
          <button
            key={option.source}
            onClick={() => onChange(option)}
            aria-pressed={isActive}
            className={
              "px-4 py-2 rounded-full border text-sm font-semibold " +
              (isActive
                ? "bg-amber-800 text-white border-amber-800"
                : "bg-white text-stone-600 border-stone-200 hover:border-amber-800 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600")
            }
          >
            {t("live.lang." + option.source)} → {t("live.lang." + option.target)}
          </button>
        )
      })}
    </div>
  )
}
