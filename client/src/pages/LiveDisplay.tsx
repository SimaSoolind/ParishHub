// LiveDisplay — publik projektor-vy för AI-tolkning live (URL "/live/display")
// Visar ett rullande flöde: källtext och översättning sida vid sida, rad för rad
// Texten försvinner INTE direkt — äldre rader tonas ner men stannar kvar så
// långsamma läsare hinner med. Vyn rullar mjukt till den senaste raden
// Ligger utanför Layout (helskärm, alltid mörkt "Varm Olivsten"-tema)
//
// Används av: App.tsx (route "/live/display", utanför Layout)
// Bygger på: useLiveDisplay (lyssnar), LiveStatusBadge

import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useLiveDisplay } from "../hooks/useLiveDisplay"
import { LiveStatusBadge } from "../components/LiveStatusBadge"

// Ger klass för arabisk text (RTL + Cairo) eller Cormorant (svenska) på projektorn
// Tar ett språk ("ar" eller "sv")
// Returnerar en klass-sträng för textelementet
function scriptClass(language: "ar" | "sv"): string {
  return language === "ar" ? "arabic-text" : "font-serif"
}

// Färg på talar-etiketten per roll — olika färg för präst och diakon,
// ljusa toner med AAA-kontrast mot den mörka projektor-bakgrunden
const speakerColor: Record<"priest" | "deacon", string> = {
  priest: "text-sky-300",
  deacon: "text-amber-300",
}

// Ritar projektor-vyn som ett rullande transkript-flöde
// Tar inga props (all data kommer via useLiveDisplay)
// Returnerar helskärms-vyn som JSX
export function LiveDisplay() {
  const { t } = useTranslation()
  const { status, segments } = useLiveDisplay()

  // Rullar mjukt ner till senaste raden varje gång ett nytt segment kommer
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [segments])

  return (
    <main className="projector-surface min-h-screen flex flex-col p-8">
      {/* Statusmärke i hörnet så publiken ser om sändningen är live eller pausad */}
      <div className="absolute top-6 right-6">
        <LiveStatusBadge status={status} />
      </div>

      {segments.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-2xl text-stone-400 italic">{t("live.displayWaiting")}</p>
        </div>
      ) : (
        <div className="flex-1 w-full max-w-6xl mx-auto overflow-y-auto flex flex-col gap-8 py-8">
          {segments.map((segment, index) => {
            const isLatest = index === segments.length - 1
            return (
              <div
                key={segment.id}
                // Senaste raden i full styrka, äldre nedtonade men fortfarande läsbara
                className={
                  "projector-fade transition-opacity " + (isLatest ? "opacity-100" : "opacity-50")
                }
              >
                {/* Talare — olika färg för präst och diakon */}
                <p
                  className={
                    speakerColor[segment.speaker] + " uppercase tracking-widest text-sm mb-3"
                  }
                >
                  {t("live.speaker." + segment.speaker)}
                </p>

                {/* Källtext och översättning sida vid sida (staplas på små skärmar) */}
                <div className="grid gap-6 md:grid-cols-2 items-start">
                  <p
                    lang={segment.sourceLanguage}
                    className={
                      scriptClass(segment.sourceLanguage) +
                      " projector-accent projector-shadow text-2xl md:text-4xl"
                    }
                  >
                    {segment.sourceText}
                  </p>
                  <p
                    lang={segment.targetLanguage}
                    className={
                      scriptClass(segment.targetLanguage) +
                      " projector-shadow font-semibold text-2xl md:text-4xl leading-tight"
                    }
                  >
                    {/* Partial saknar översättning — visar prickar tills final kommer */}
                    {segment.translatedText ?? "…"}
                  </p>
                </div>
              </div>
            )
          })}
          {/* Ankarpunkt som vyn rullar till */}
          <div ref={endRef} />
        </div>
      )}
    </main>
  )
}
