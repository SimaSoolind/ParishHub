// LiturgyManualTab — låter prästen skriva in liturgin manuellt, rad för rad
// Varje rad är ett block: rubrik, text (ar+sv) eller predikan (live). Sparas per
// gudstjänst i en mock (nollställs vid omladdning tills backend finns)
//
// Används av: LiturgyScriptPanel
// Bygger på: useLiturgyDraft (data), Dropdown, LiturgyBlockList

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Plus } from "lucide-react"
import type { LiturgyBlockKind } from "../domain/liturgy"
import type { NewLiturgyBlock } from "../domain/repositories/liturgyDraftRepository"
import { useLiturgyDraft } from "../hooks/useLiturgyDraft"
import { Dropdown } from "./Dropdown"
import { LiturgyBlockList } from "./LiturgyBlockList"
import { Skeleton } from "./Skeleton"

interface Props {
  serviceId: string
}

// Ritar manuellt-fliken: formulär för att lägga till rader + listan med rader
// Tar emot serviceId (vilken gudstjänst raderna hör till)
// Returnerar fliken som JSX
export function LiturgyManualTab({ serviceId }: Props) {
  const { t } = useTranslation()
  const { blocks, loading, addBlock, removeBlock } = useLiturgyDraft(serviceId)

  // Lokala fält medan prästen fyller i — töms först när raden lagts till,
  // så formuläret är redo för nästa rad utan att blanda ihop värden
  const [kind, setKind] = useState<LiturgyBlockKind>("text")
  const [ar, setAr] = useState("")
  const [sv, setSv] = useState("")
  const [bibleRef, setBibleRef] = useState("")

  // Lägger till en rad. Predikan behöver ingen text; övriga kräver minst ett språk
  const handleAdd = async () => {
    if (kind !== "sermon" && !ar.trim() && !sv.trim()) return

    const block: NewLiturgyBlock = {
      kind,
      // Fälten läggs bara till om de har innehåll (exactOptionalPropertyTypes)
      ...(ar.trim() ? { ar: ar.trim() } : {}),
      ...(sv.trim() ? { sv: sv.trim() } : {}),
      ...(bibleRef.trim() ? { bibleRef: bibleRef.trim() } : {}),
    }
    await addBlock(block)
    setAr("")
    setSv("")
    setBibleRef("")
  }

  if (loading) return <Skeleton className="h-32 w-full" />

  return (
    <>
      <div className="grid gap-2 mb-4">
        <Dropdown
          value={kind}
          onChange={(value) => setKind(value as LiturgyBlockKind)}
          ariaLabel={t("liturgy.manual.kind")}
          options={[
            { value: "heading", label: t("liturgy.kind.heading") },
            { value: "text", label: t("liturgy.kind.text") },
            { value: "sermon", label: t("liturgy.kind.sermon") },
          ]}
        />

        {/* Predikan tolkas live — då behövs ingen inskriven text */}
        {kind !== "sermon" && (
          <>
            <input
              value={ar}
              onChange={(event) => setAr(event.target.value)}
              placeholder={t("liturgy.manual.ar")}
              lang="ar"
              className="field arabic-text"
            />
            <input
              value={sv}
              onChange={(event) => setSv(event.target.value)}
              placeholder={t("liturgy.manual.sv")}
              className="field"
            />
            <input
              value={bibleRef}
              onChange={(event) => setBibleRef(event.target.value)}
              placeholder={t("liturgy.manual.bibleRef")}
              className="field"
            />
          </>
        )}

        <button
          onClick={handleAdd}
          className="btn-primary px-4 py-2 inline-flex items-center gap-2 w-fit"
        >
          <Plus size={16} aria-hidden="true" />
          {t("liturgy.manual.add")}
        </button>
      </div>

      <LiturgyBlockList
        blocks={blocks}
        emptyText={t("liturgy.manual.empty")}
        onRemove={removeBlock}
      />
    </>
  )
}
