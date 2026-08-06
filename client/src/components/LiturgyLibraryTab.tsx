// LiturgyLibraryTab — väljer en färdig liturgi ur biblioteket och visar den
// Biblioteket kommer från data/liturgy/ (t.ex. Agbeya-samlingen, normaliserad)
//
// Används av: LiturgyScriptPanel
// Bygger på: useLiturgy (data), Dropdown, LiturgyBlockList

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { BookOpen } from "lucide-react"
import type { LiturgyScript } from "../domain/liturgy"
import { useLiturgy } from "../hooks/useLiturgy"
import { Dropdown } from "./Dropdown"
import { LiturgyBlockList } from "./LiturgyBlockList"
import { EmptyState } from "./EmptyState"
import { Skeleton } from "./Skeleton"

// Väljer förvald liturgi: den vars titel matchar gudstjänstens högtid, annars den första
// Tar liturgierna och gudstjänstens högtid (fritext)
// Returnerar liturgins id, eller tom sträng om inga finns
function defaultId(scripts: LiturgyScript[], serviceFeast?: string): string {
  const feast = serviceFeast?.toLowerCase()
  const match = feast ? scripts.find((s) => s.title.toLowerCase().includes(feast)) : undefined
  return match?.id ?? scripts[0]?.id ?? ""
}

interface Props {
  serviceFeast?: string | undefined
}

// Ritar biblioteks-fliken: väljare + vald liturgis block
// Tar emot serviceFeast (för förval)
// Returnerar fliken som JSX
export function LiturgyLibraryTab({ serviceFeast }: Props) {
  const { t } = useTranslation()
  const { scripts, loading } = useLiturgy()

  // Prästens egna val (null tills något klickas) — annars förvalet ovan
  const [chosenId, setChosenId] = useState<string | null>(null)

  if (loading) return <Skeleton className="h-32 w-full" />
  if (scripts.length === 0) {
    return (
      <EmptyState icon={BookOpen} title={t("liturgy.empty")} description={t("liturgy.emptyHint")} />
    )
  }

  const selectedId = chosenId ?? defaultId(scripts, serviceFeast)
  const selected = scripts.find((script) => script.id === selectedId)

  return (
    <>
      <div className="mb-4 max-w-xs">
        <Dropdown
          value={selectedId}
          onChange={setChosenId}
          ariaLabel={t("liturgy.pick")}
          options={scripts.map((script) => ({ value: script.id, label: script.title }))}
        />
      </div>
      <LiturgyBlockList blocks={selected?.blocks ?? []} emptyText={t("liturgy.empty")} />
    </>
  )
}
