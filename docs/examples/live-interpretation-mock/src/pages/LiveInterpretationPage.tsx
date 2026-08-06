// Operatorens kontrollpanel — startar/stoppar/vaxlar sprak
// Vecka 1: stub. Utokar i Vecka 2 med:
//   - Start/Stopp-knapp med state machine
//   - LanguageDirectionSelector (AR-SV toggle)
//   - SpeakerSelector (priest/deacon toggle)
//   - ConnectionStatus-badge
//   - TranscriptFeed-preview
//
// Rutt: /live-interpretation
// Anvands av: App.tsx (utanfor Layout — kraver ingen inloggning i v1)

export function LiveInterpretationPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-serif font-bold text-strong mb-4">
        Live-tolkning
      </h1>
      <p className="text-soft">
        Denna sida byggs ut i Vecka 2 med kontrollpanel enligt Deep Research-spec.
      </p>
    </main>
  )
}
