// LivePreparedLiturgy — operatörens panel för att visa FÖRBEREDD liturgi på projektorn
// Väljer en liturgi ur biblioteket; varje rad kan skickas till projektorn med "Visa"
// (utan AI — texten finns redan). Predikan tolkas istället live med Starta-knappen
//
// Används av: LiveControl
// Bygger på: useLiturgy (bibliotek), Dropdown

import { useState } from "react"
import { useTranslation } from "react-i18next"
import type { LiturgyBlock } from "../domain/liturgy"
import { useLiturgy } from "../hooks/useLiturgy"
import { Dropdown } from "./Dropdown"

interface Props {
  // Anropas när operatören vill visa en rad på projektorn
  onShow: (block: LiturgyBlock) => void
}

// Ritar väljare för liturgi + lista med rader som kan visas
// Tar emot onShow (skickar raden till projektorn)
// Returnerar panelen som JSX, eller null om biblioteket är tomt
export function LivePreparedLiturgy({ onShow }: Props) {
  const { t } = useTranslation()
  const { scripts, loading } = useLiturgy()
  const [chosenId, setChosenId] = useState<string | null>(null)

  // Inget bibliotek än — visa inget (kontrollpanelen funkar ändå för predikan)
  if (loading || scripts.length === 0) return null

  const selectedId = chosenId ?? scripts[0]?.id ?? ""
  const selected = scripts.find((script) => script.id === selectedId)

  return (
    <div className="surface border p-6 rounded-2xl shadow-sm mb-6">
      <h2 className="text-sm font-bold text-accent mb-1">{t("live.prepared")}</h2>
      <p className="text-xs text-faint mb-4">{t("live.preparedHint")}</p>

      <div className="mb-3 max-w-xs">
        <Dropdown
          value={selectedId}
          onChange={setChosenId}
          ariaLabel={t("liturgy.pick")}
          options={scripts.map((script) => ({ value: script.id, label: script.title }))}
        />
      </div>

      <ul className="space-y-1 max-h-72 overflow-y-auto">
        {selected?.blocks.map((block) => (
          <li
            key={block.id}
            className="flex items-center justify-between gap-3 border-b border-stone-100 py-2 dark:border-stone-700"
          >
            <span className="text-sm text-soft truncate">
              {block.kind === "sermon" ? t("liturgy.type.sermon") : block.sv || block.ar}
            </span>

            {block.kind === "sermon" ? (
              // Predikan tolkas live — hänvisa till Starta-knappen
              <span className="text-xs italic text-accent shrink-0">
                {t("live.sermonUseStart")}
              </span>
            ) : (
              <button
                onClick={() => onShow(block)}
                className="btn-secondary text-accent px-3 py-1 text-sm shrink-0"
              >
                {t("live.show")}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
