# PoC — Vecka 1

Första veckan enligt Deep Research 8-veckors plan. **Ingen backend.
Ingen Speechmatics. Ingen DeepL.** Bara frontend + mock.

Mål: bevisa att Clean Architecture-strukturen fungerar för live-tolkningen,
och att UI-flödet är korrekt.

Uppdaterad: 2026-08-05

---

## Mål (Definition of Done Vecka 1)

Sammanfattning av vecka-1-scope. Fullständiga tasks (över alla veckor):
se `docs/BACKLOG.md` sektion **AI-tolkning**.

Kärnkrav som ska vara uppfyllda efter vecka 1:

- Domänmodell finns i `client/src/domain/live-interpretation/`
- MockInterpretationRepository simulerar en session med segment
- Tre routes finns:
  - `/live-interpretation` — operatörens kontrollpanel (stub)
  - `/projector/:sessionId` — projektorvy (stub)
  - `/watch/:sessionId` — YouTube-vy (stub)
- `tsc` grön, `lint` grön, `test` grön

**Ingen kod för backend/API/mikrofon denna vecka.**

---

## Steg 1: Domänmodell

Skapa mappstruktur i `client/src/`:

```bash
mkdir -p client/src/domain/live-interpretation/{entities,repositories,types}
mkdir -p client/src/application/live-interpretation
mkdir -p client/src/infrastructure/live-interpretation
mkdir -p client/src/features/live-interpretation/{hooks,components}
```

### 1a: Typer

`client/src/domain/live-interpretation/types/interpretation.types.ts`:

```ts
// Centrala typer for live-tolkning — DRY, definieras EN gang
export type Language = "ar" | "sv"
export type Speaker = "priest" | "deacon"
export type SegmentStatus = "partial" | "final"

// Riktning: fran vilket sprak till vilket sprak
export interface LanguageDirection {
  source: Language
  target: Language
}
```

### 1b: Entiteter

`client/src/domain/live-interpretation/entities/TranscriptSegment.ts`:

```ts
// Ett textsegment i en pagaende session
// Skickas i realtid fran server via WebSocket
import type { Language, Speaker, SegmentStatus } from "../types/interpretation.types"

export interface TranscriptSegment {
  id: string
  sessionId: string
  speaker: Speaker
  sourceLanguage: Language
  targetLanguage: Language
  originalText: string
  translatedText?: string      // finns bara nar status = final
  status: SegmentStatus
  sequence: number             // monotont for deduplicering
  createdAt: string            // ISO-tid
}
```

`client/src/domain/live-interpretation/entities/InterpretationSession.ts`:

```ts
// En pagaende tolkningssession — kopplas till en gudstjanst
import type { LanguageDirection, Speaker } from "../types/interpretation.types"

export interface InterpretationSession {
  id: string
  serviceId: string
  startedAt: string
  endedAt?: string
  direction: LanguageDirection
  currentSpeaker: Speaker
}
```

### 1c: Repository-interface

`client/src/domain/live-interpretation/repositories/InterpretationRepository.ts`:

```ts
import type { InterpretationSession } from "../entities/InterpretationSession"
import type { TranscriptSegment } from "../entities/TranscriptSegment"
import type { LanguageDirection, Speaker } from "../types/interpretation.types"

// Kontrakt for tolkningsrepository
// Implementeras av MockInterpretationRepository (nu) och
// WebSocketInterpretationRepository (senare)
export interface InterpretationRepository {
  start(serviceId: string, direction: LanguageDirection, speaker: Speaker): Promise<InterpretationSession>
  stop(sessionId: string): Promise<void>
  updateSettings(sessionId: string, changes: Partial<Pick<InterpretationSession, "direction" | "currentSpeaker">>): Promise<void>
  subscribe(sessionId: string, onSegment: (segment: TranscriptSegment) => void): () => void
}
```

---

## Steg 2: Mock-repository

`client/src/infrastructure/live-interpretation/MockInterpretationRepository.ts`:

Simulerar en session — skickar dummy-segment var 3:e sekund så UI kan
byggas utan backend. Se `docs/examples/live-interpretation-mock/`
för fullständig kod.

Kort exempel:

```ts
import type { InterpretationRepository } from "@domain/live-interpretation/repositories/InterpretationRepository"

// Mock — simulerar session utan backend
// Skickar dummy-segment var 3:e sekund
export const mockInterpretationRepository: InterpretationRepository = {
  async start(serviceId, direction, speaker) {
    return {
      id: crypto.randomUUID(),
      serviceId,
      startedAt: new Date().toISOString(),
      direction,
      currentSpeaker: speaker,
    }
  },
  async stop(_sessionId) { /* no-op */ },
  async updateSettings(_sessionId, _changes) { /* no-op */ },
  subscribe(sessionId, onSegment) {
    let sequence = 0
    const timer = setInterval(() => {
      sequence++
      onSegment({
        id: crypto.randomUUID(),
        sessionId,
        speaker: "priest",
        sourceLanguage: "ar",
        targetLanguage: "sv",
        originalText: "باسم الآب والابن والروح القدس",
        translatedText: "I Faderns, Sonens och Helige Andes namn",
        status: "final",
        sequence,
        createdAt: new Date().toISOString(),
      })
    }, 3000)
    return () => clearInterval(timer)
  },
}
```

---

## Steg 3: Tre routes (stubs)

Skapa tre nya sid-komponenter — bara skelett den här veckan.

### 3a: `client/src/pages/LiveInterpretationPage.tsx`

```tsx
// Operatorens kontrollpanel — startar/stoppar/vaxlar sprak
// Bygger ut i Vecka 2 med state machine + kontroller
export function LiveInterpretationPage() {
  return (
    <main>
      <h1>Live-tolkning (kontrollpanel)</h1>
      <p>Kommer bli operatorens kontrollpanel.</p>
    </main>
  )
}
```

### 3b: `client/src/pages/ProjectorPage.tsx`

```tsx
import { useParams } from "react-router-dom"

// Projektorvy — fullskarm, ingen chrome
// Bygger ut i Vecka 3 med tema + typografi + AAA-kontrast
export function ProjectorPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  return (
    <main>
      <h1>Projektor — session {sessionId}</h1>
    </main>
  )
}
```

### 3c: `client/src/pages/StreamViewerPage.tsx`

```tsx
import { useParams } from "react-router-dom"

// YouTube-vy — video + text bredvid
// Bygger ut i Vecka 4 med iframe + layouts
export function StreamViewerPage() {
  const { sessionId } = useParams<{ sessionId: string }>()
  return (
    <main>
      <h1>Stream — session {sessionId}</h1>
    </main>
  )
}
```

### 3d: Rutter i App.tsx

Lägg till i `client/src/App.tsx` (lazy-load enligt befintlig konvention):

```tsx
const LiveInterpretation = lazy(() =>
  import("./pages/LiveInterpretationPage").then(m => ({ default: m.LiveInterpretationPage }))
)
const Projector = lazy(() =>
  import("./pages/ProjectorPage").then(m => ({ default: m.ProjectorPage }))
)
const StreamViewer = lazy(() =>
  import("./pages/StreamViewerPage").then(m => ({ default: m.StreamViewerPage }))
)

// I <Routes>:
<Route path="/live-interpretation" element={<LiveInterpretation />} />
<Route path="/projector/:sessionId" element={<Projector />} />
<Route path="/watch/:sessionId" element={<StreamViewer />} />
```

`/projector` och `/watch` ligger **utanför Layout** (som `/design`) —
inga headers eller nav ska visas.

---

## Steg 4: Verifiera

```bash
cd client
npx tsc -p tsconfig.app.json --noEmit
npm run lint
npm run test
npm run dev
```

Öppna:
- `http://localhost:5173/live-interpretation` → visar stub-sida
- `http://localhost:5173/projector/test-session` → visar stub-sida
- `http://localhost:5173/watch/test-session` → visar stub-sida

---

## När det fungerar

Bocka av Definition of Done ovan och gå vidare till **Vecka 2** i
`docs/AI-TOLKNING.md` sektion 14 — Operatörens kontrollpanel med
state machine.

**Kod-referens finns i:** `docs/examples/live-interpretation-mock/` — kompletta
körbara filer för alla steg ovan.

## Framtida versioner (referens)

Vecka 1 bygger BARA basen. Senare versioner lägger till:

- **v1.5:** Manuellt hymn-bibliotek (dropdown-val av kända hymner) +
  kyrko-upload av bakgrundsbilder
- **v2:** Auto-sync sång med Speechmatics + liturgiska säsong-bakgrunder
- **v3:** Karaoke-style word-highlighting + fler språk (EN, GR, RU, SYR)

Se `docs/AI-TOLKNING.md` sektion 10 (Sång/kör) och sektion 12
(Bakgrundsbild) för detaljer.
