// PageLoader — laddningsindikator medan en lazy-laddad sida hämtas
// Visar pulserande platshållare (Skeleton) i innehålls-ytan
//
// Används av: Layout.tsx (sidorna under Layout) och App.tsx (/design)

import { useTranslation } from "react-i18next"
import { Skeleton } from "./Skeleton"

// Ritar tre platshållar-block medan en sida laddas från nätverket
// Tar inga props och returnerar laddnings-vyn som JSX
export function PageLoader() {
  const { t } = useTranslation()

  return (
    <div className="space-y-3" role="status" aria-label={t("common.loading")}>
      {/* Dold rubrik så sidan alltid har en h1 — även medan innehållet laddas */}
      <h1 className="sr-only">{t("common.loading")}</h1>
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
