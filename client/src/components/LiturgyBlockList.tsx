// LiturgyBlockList — visar en liturgis block (rubrik/text/predikan) tvåspråkigt
// Återanvänds av alla tre flikarna (bibliotek, uppladdning, manuellt) så samma
// visning inte upprepas (DRY). Källa och översättning står sida vid sida
//
// Används av: LiturgyLibraryTab, LiturgyUploadTab, LiturgyManualTab

import { useTranslation } from "react-i18next"
import { Trash2 } from "lucide-react"
import { Badge } from "./Badge"
import type { LiturgyBlock } from "../domain/liturgy"

interface Props {
  blocks: LiturgyBlock[]
  emptyText: string
  // Om satt visas en radera-knapp per block (används i manuellt-läget)
  onRemove?: (blockId: string) => void
}

// Ritar blocken i ordning, eller en tom-text om listan är tom
// Tar emot blocks, emptyText och (valfritt) onRemove
// Returnerar listan som JSX
export function LiturgyBlockList({ blocks, emptyText, onRemove }: Props) {
  const { t } = useTranslation()

  if (blocks.length === 0) {
    return <p className="text-faint italic">{emptyText}</p>
  }

  return (
    <ol className="space-y-2">
      {blocks.map((block) => (
        <li
          key={block.id}
          className="flex items-start gap-2 border-b border-stone-100 py-2 dark:border-stone-700"
        >
          <div className="flex-1">
            {block.kind === "sermon" ? (
              // Predikan tolkas live med AI — ingen förberedd text
              <div className="flex items-center gap-2">
                <Badge color="red">{t("liturgy.type.sermon")}</Badge>
                <span className="text-xs italic text-accent">{t("liturgy.liveHint")}</span>
              </div>
            ) : block.kind === "heading" ? (
              // Rubrik — framhävs så prästen ser liturgins struktur och inte
              // förväxlar den med en vanlig textrad
              <div className="pt-1">
                {block.sv && (
                  <p className="text-sm font-bold uppercase tracking-wide text-accent">
                    {block.sv}
                  </p>
                )}
                {block.ar && (
                  <p lang="ar" className="arabic-text font-bold text-strong">
                    {block.ar}
                  </p>
                )}
              </div>
            ) : (
              // Vanlig textrad — källa och översättning sida vid sida
              <div className="grid gap-2 md:grid-cols-2">
                {block.ar && (
                  <p lang="ar" className="arabic-text text-soft">
                    {block.ar}
                  </p>
                )}
                {block.sv && <p className="text-strong">{block.sv}</p>}
              </div>
            )}
            {block.bibleRef && <p className="text-xs text-faint mt-1">{block.bibleRef}</p>}
          </div>

          {onRemove && (
            <button
              onClick={() => onRemove(block.id)}
              aria-label={t("liturgy.removeBlock")}
              className="p-1 rounded-full row-hover text-stone-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          )}
        </li>
      ))}
    </ol>
  )
}
