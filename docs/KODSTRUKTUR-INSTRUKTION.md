# Kodstruktur & Prestanda — Instruktion för Sima

Steg-för-steg-plan för de rekommendationer från kod-analys-rapporten som
fortfarande är kvar. Fokus på kodstruktur och prestanda-optimeringar.

Instruktionen är designad för ADHD- och dyslexi-vänligt arbete:
ett steg per session, korta stycken, konkreta filnamn och kodexempel.

Uppdaterad: 2026-08-03

**STATUS:** Steg 1–9 klara (7–9 CI-härdning: 4 aug 2026). Steg 10 (Sentry) är en framtida-påminnelse vid prod-deploy. Även valfritt kvar: konvertera resten av importerna till aliases, filvis.

---

## Så här läser du instruktionen

Varje steg är ett eget mini-projekt. Gör **ett steg per session**.
Bocka av när det är klart.

**Prioritet-nivåer:**

- **Kritisk** — påverkar bygget eller säkerheten direkt
- **Viktig** — förbättrar prestanda eller läsbarhet markant
- **Rekommenderad** — polering och framtidssäkring

**Regler för arbetsflödet:**

- Läs igenom hela steget innan koden ändras
- Kör `npx tsc -p tsconfig.app.json --noEmit` efter varje steg
- Kör `npm run lint` innan commit
- Skriv dags-logg i `DAGBOK.md` när sessionen är slut

---

## Steg 1: Path aliases

**Tid:** 25 min
**Prioritet:** Viktig

### VAD
Aktivera importer med kortnamn: `@/hooks/useMembers` istället för
`../../hooks/useMembers`.

### VARFÖR
- Kortare imports — mindre risk för fel vid flytt av filer
- Ingen `../../..`-röra som är svårläst vid dyslexi
- IDE-autocomplete blir bättre
- Standardpraxis i moderna React-projekt

### HUR
Öppna `client/tsconfig.app.json` och lägg till `baseUrl` + `paths`
i compilerOptions:

```json
{
  "compilerOptions": {
    // ... befintliga flaggor ...

    /* Path aliases — kortare imports (matchar vite.config.ts) */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@hooks/*": ["src/hooks/*"],
      "@pages/*": ["src/pages/*"],
      "@domain/*": ["src/domain/*"],
      "@data/*": ["src/data/*"],
      "@lib/*": ["src/lib/*"],
      "@utils/*": ["src/utils/*"],
      "@schemas/*": ["src/schemas/*"]
    }
  }
}
```

Öppna `client/vite.config.ts` och lägg till `resolve.alias`
(TypeScript behöver `paths`, Vite behöver `alias` — båda krävs):

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Kortnamn for imports — matchar tsconfig.app.json paths
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@domain': path.resolve(__dirname, './src/domain'),
      '@data': path.resolve(__dirname, './src/data'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@schemas': path.resolve(__dirname, './src/schemas'),
    },
  },
  test: {
    environment: 'jsdom',
  },
})
```

**Konvertera EN fil som exempel** — börja med `client/src/pages/Members.tsx`.

Före:

```tsx
import { MemberCard } from "../components/MemberCard"
import { useMemberSearch } from "../hooks/useMemberSearch"
import type { Member } from "../domain/member"
import { newMemberSchema } from "../schemas/memberSchema"
```

Efter:

```tsx
import { MemberCard } from "@components/MemberCard"
import { useMemberSearch } from "@hooks/useMemberSearch"
import type { Member } from "@domain/member"
import { newMemberSchema } from "@schemas/memberSchema"
```

Konvertera resten av importerna filvis över flera sessioner.
Inte allt på en gång.

### VERIFIERA
1. `npx tsc -p tsconfig.app.json --noEmit` — grönt
2. `npm run dev` — appen startar utan fel
3. Skriv `@` i en import i VS Code — autocomplete visar mappar

---

## Steg 2: React.memo på lista-komponenter

**Tid:** 20 min
**Prioritet:** Rekommenderad

### VAD
Slå in komponenter som renderas MÅNGA gånger i `React.memo()` — då
återrenderas de bara om deras props faktiskt ändrats.

### VARFÖR
`MemberCard` renderas EN gång per medlem. Med 100 medlemmar och en
liten state-ändring på Members-sidan renderas alla 100 kort igen —
även om ingen data ändrats. `React.memo` hoppar över dem.

**När ska React.memo INTE användas?**
- Små komponenter som renderas bara några gånger (t.ex. `Layout`)
- Komponenter vars props ändras vid varje render (då blir memo bara overhead)
- Komponenter med barn som re-renderar på annat sätt (t.ex. context)

### HUR

**Kandidater i ParishHub:**
- `MemberCard.tsx` — renderas per medlem i listan
- `Badge.tsx` — små stabila etiketter
- `StatCard.tsx` — dashboards-korten
- `EventCard.tsx` — om den börjar användas

Före (`MemberCard.tsx`):

```tsx
export function MemberCard({ member, onSelect }: Props) {
  // ... jsx ...
}
```

Efter:

```tsx
import { memo } from "react"

// Wrappar komponenten i memo — hoppar over rendering nar props ar oforandrade
// Anvands eftersom MemberCard renderas en gang per medlem i listan
function MemberCardBase({ member, onSelect }: Props) {
  // ... jsx ...
}

export const MemberCard = memo(MemberCardBase)
```

**Viktigt:** för att `memo` ska fungera måste `onSelect`-callbacken från
föräldern vara stabil — annars ändras props vid varje render. Det leder
oss till Steg 3 (`useCallback`).

### VERIFIERA
1. Öppna React DevTools → **Profiler**-fliken
2. Starta inspelning → tryck en filter-knapp → stoppa
3. Se att `MemberCard` visar "Did not render" (grå) för raderna vars data
   inte ändrats

---

## Steg 3: useCallback för handler-props

**Tid:** 15 min
**Prioritet:** Rekommenderad

### VAD
Slå in handler-funktioner som skickas till memo:ade barn i `useCallback`
så referensen är stabil mellan renderingar.

### VARFÖR
`React.memo` jämför props med `Object.is`. En ny funktion `() => {}`
skapas vid varje render → ny referens → memo:n gör INGEN nytta.
`useCallback` sparar samma referens tills dependencies ändras.

**Regel:** använd `useCallback` BARA för handlers som skickas som props
till `memo`-komponenter. Överanvändning är onödig komplexitet.

### HUR

I `Members.tsx` — handlers som skickas till `MemberCard`:

Före:

```tsx
export function Members() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  return (
    <ul>
      {filteredMembers.map(member => (
        <MemberCard
          key={member.id}
          member={member}
          onSelect={() => setSelectedMember(member)}
        />
      ))}
    </ul>
  )
}
```

Problem: `onSelect` skapas nytt vid varje render → `MemberCard` renderas
alltid om, även med `memo`.

Efter:

```tsx
import { useState, useCallback } from "react"

export function Members() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  // Stabil referens mellan renderingar — MemberCard hoppar over onodig rendering
  const handleSelect = useCallback((member: Member) => {
    setSelectedMember(member)
  }, [])

  return (
    <ul>
      {filteredMembers.map(member => (
        <MemberCard
          key={member.id}
          member={member}
          onSelect={handleSelect}
        />
      ))}
    </ul>
  )
}
```

Uppdatera `MemberCard`-signaturen så `onSelect` tar in `member` som argument:

```tsx
interface Props {
  member: Member
  // Kallar handlern med hela member — sa foraldern behover inte skapa en ny closure per rad
  onSelect: (member: Member) => void
}

function MemberCardBase({ member, onSelect }: Props) {
  return (
    <button onClick={() => onSelect(member)}>
      {/* ... */}
    </button>
  )
}
```

### VERIFIERA
React DevTools Profiler — MemberCard ska visa "Did not render" för
raderna som inte påverkats av en klick.

---

## Steg 4: lazy() + Suspense för route-nivå code splitting

**Tid:** 25 min
**Prioritet:** Viktig

### VAD
Ladda sidor som JavaScript-chunks bara när användaren navigerar till dem
— inte i initiala bundle.

### VARFÖR
Idag laddas ALL kod (Dashboard, Members, Calendar, Services,
DesignPreview) direkt när sidan öppnas. `DesignPreview.tsx` ensam är
36 kB. Med lazy laddas bara startsidan först, resten hämtas vid behov.

**Kandidater i ParishHub (störst först):**
- `DesignPreview.tsx` (36 kB) — bara för intern utveckling, ska INTE ligga i huvud-bundle
- `Calendar.tsx` (263 rader + react-big-calendar) — tung
- `Services.tsx` (263 rader + AttendanceModal + AddServiceModal) — tung
- `Members.tsx` (255 rader + 3 modaler) — medium

**Behåll utan lazy:** `Dashboard.tsx` — det är startsidan, behövs direkt.

### HUR
Öppna `client/src/App.tsx`:

Före:

```tsx
import { Dashboard } from "./pages/Dashboard"
import { Members } from "./pages/Members"
import { Calendar } from "./pages/Calendar"
import { Services } from "./pages/Services"
import DesignPreview from "./design/DesignPreview"
```

Efter:

```tsx
import { lazy, Suspense } from "react"
import { Dashboard } from "./pages/Dashboard"

// Sidor som lazy-laddas — bundlas i separata chunks och hamtas vid navigering
// Minskar startbundlen och forbattrar Time-to-Interactive
const Members = lazy(() =>
  import("./pages/Members").then(m => ({ default: m.Members }))
)
const Calendar = lazy(() =>
  import("./pages/Calendar").then(m => ({ default: m.Calendar }))
)
const Services = lazy(() =>
  import("./pages/Services").then(m => ({ default: m.Services }))
)
const DesignPreview = lazy(() => import("./design/DesignPreview"))
```

**OBS:** `Members`, `Calendar`, `Services` använder **named exports**
(`export function Members`) — därför behövs `.then(m => ({ default: m.Members }))`.
`DesignPreview` har `export default` — då räcker det med `lazy(() => import(...))`.

Wrappa `<Routes>` i `<Suspense>` med en fallback:

```tsx
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Toaster position="top-right" richColors closeButton />

        {/* Suspense visar fallback medan lazy-sidor laddas fran natverket */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="medlemmar" element={<Members />} />
              <Route path="kalender" element={<Calendar />} />
              <Route path="gudstjanster" element={<Services />} />
            </Route>
            <Route path="/design" element={<DesignPreview />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
```

Skapa en enkel `PageLoader`-komponent (kan bo i `App.tsx` eller egen fil):

```tsx
// Enkel laddningsindikator medan en lazy-laddad sida hamtas
// Anvander Skeleton-komponenten som redan finns i projektet
function PageLoader() {
  return (
    <div className="p-6 space-y-3" role="status" aria-label="Laddar sidan">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
```

### VERIFIERA
1. Kör `npm run build`
2. Titta i output — nu ska det finnas separata `.js`-chunks per sida
   (t.ex. `Members-abc123.js`, `Calendar-def456.js`)
3. Öppna appen i Network-fliken (Chrome DevTools) → klicka på en meny-länk
   → se att en ny `.js`-fil laddas just då

---

## Steg 5: DOMPurify — påminnelse (installera först vid rich-text)

**Tid:** 0 min nu — 15 min när det behövs
**Prioritet:** Rekommenderad (framtida)

### VAD
`DOMPurify` sanerar HTML för att förhindra XSS-attacker. Kan behövas i
framtiden om rich-text-anteckningar eller HTML-innehåll från användare
ska renderas.

### VARFÖR INTE NU?
ParishHub använder **inga** `dangerouslySetInnerHTML` idag — kollat i hela
`client/src/`, 0 träffar. Så länge appen inte renderar HTML från
användarinput är DOMPurify onödig komplexitet.

### NÄR SKA DET AKTIVERAS?
Så snart en av dessa funktioner läggs till:
- Prästens privata anteckningar visas som formatterad HTML
- Predikan-arkiv med formaterad text
- WhatsApp-mallar som stöder länkar eller listor
- Kommentarer från församlingsmedlemmar

### HUR (när dagen kommer)

```bash
cd client && npm install dompurify
npm install --save-dev @types/dompurify
```

Använd så här:

```tsx
import DOMPurify from "dompurify"

interface Props {
  html: string
}

// Renderar HTML som anvandaren skrivit — sanerar med DOMPurify forst
// Utan sanering kan angripare injicera <script>-taggar (XSS)
export function SafeHtml({ html }: Props) {
  const clean = DOMPurify.sanitize(html)
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

### KOMMANDE PÅMINNELSE
Lägg till en TODO i `ROADMAP.md` under "Fas 2 — Smartare funktioner":
`- DOMPurify när rich-text-fält läggs till (privata anteckningar, predikan-arkiv)`

---

## Steg 6: ErrorBase-klass-mönster ✅ KLAR (4 aug 2026)

**Tid:** 20 min
**Prioritet:** Viktig

### VAD
Skapa `client/src/lib/errors.ts` med basklass `AppError` + specialiserade
underklasser: `ValidationError`, `NetworkError`, `AuthError`.

### VARFÖR
Idag fångas fel som `unknown` i alla try/catch — inget sätt att veta VILKEN
sorts fel det är. Med ErrorBase-mönstret kan koden göra `instanceof`-kontroll
och behandla nätverksfel annorlunda än valideringsfel.

### HUR

Skapa `client/src/lib/errors.ts`:

```ts
// errors — samlade felklasser for typsaker felhantering
// Basklass AppError + specialiserade underklasser
// Anvands i lib/api.ts, hooks och komponenter dar fel behover behandlas per typ

// Basklass for alla appspecifika fel — gor instanceof-check mojlig
export class AppError extends Error {
  constructor(message: string) {
    super(message)
    // Sattet name till klassens namn — annars visar Chrome bara "Error"
    this.name = this.constructor.name
  }
}

// Kastas nar Zod-validering misslyckas eller data har fel form
export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message)
  }
}

// Kastas vid natverksfel — timeout, offline, felkoder
export class NetworkError extends AppError {
  constructor(message: string, public status?: number) {
    super(message)
  }
}

// Kastas vid autentiseringsfel — 401, saknad token, utgangen session
export class AuthError extends AppError {
  constructor(message: string) {
    super(message)
  }
}
```

Använd i `lib/api.ts`:

Före:
```ts
if (!response.ok) {
  throw new Error(`Anropet misslyckades (status ${response.status})`)
}
```

Efter:
```ts
import { NetworkError } from "./errors"

if (!response.ok) {
  // Kastar en typad felklass sa anroparen kan reagera specifikt
  throw new NetworkError(`Anropet misslyckades`, response.status)
}
```

I komponenten som anropar:

```tsx
import { NetworkError, ValidationError } from "../lib/errors"

try {
  await memberRepository.add(newMember)
} catch (error) {
  // Typsaker check pa fel-klass — reagera per typ
  if (error instanceof NetworkError) {
    toast.error(t("common.errorNetwork"))
  } else if (error instanceof ValidationError) {
    toast.error(t("common.errorValidation"))
  } else {
    toast.error(t("common.errorGeneric"))
  }
}
```

### VERIFIERA
1. `npx tsc -p tsconfig.app.json --noEmit` — grönt
2. Simulera nätverksfel (Chrome DevTools → Offline) → se att `NetworkError`-toasten visas
3. Fånga med `instanceof NetworkError` — kompilator ska INTE varna för `unknown`

---

## Steg 7: Semgrep SAST i CI ✅ KLAR (4 aug 2026)

**Tid:** 15 min
**Prioritet:** Rekommenderad

### VAD
Lägg till Semgrep community rules i `.github/workflows/ci.yml`.

### VARFÖR
Semgrep är en SAST-scanner (Static Application Security Testing) som fångar
säkerhetsmönster ESLint missar: hårdkodade tokens, osäker deserialisering,
farliga regex (ReDoS), XSS-mönster, hemligheter i koden.

Gratis för publika repon.

### HUR

Uppdatera `.github/workflows/ci.yml` — lägg till efter befintlig audit-step:

```yaml
      - name: Semgrep säkerhetsanalys
        uses: returntocorp/semgrep-action@v1
        with:
          # Anvander community-regler for React, TypeScript och sakerhet
          config: >-
            p/react
            p/typescript
            p/security-audit
```

### VERIFIERA
1. Skapa PR med testkod som har hårdkodad token (t.ex.
   `const API_KEY = "sk-abc123"`)
2. CI-jobbet ska fånga det och markera PR-varning
3. Ta bort testkoden — CI ska bli grönt igen

---

## Steg 8: Lighthouse CI ✅ KLAR (4 aug 2026)

**Tid:** 20 min
**Prioritet:** Rekommenderad

### VAD
Installera `@lhci/cli` + config-fil + CI-steg som mäter a11y, prestanda,
SEO och best practices per PR.

### VARFÖR
Automatisk kvalitetsmätning — inga regressioner slinker in obemärkta.
Sätter budget: PR fails om accessibility-score sjunker under 90.

### HUR

**Steg A — Installera:**

```bash
cd client && npm install --save-dev @lhci/cli
```

**Steg B — Skapa `client/lighthouserc.json`:**

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:5173"],
      "startServerCommand": "npm run preview",
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "categories:performance": ["warn", { "minScore": 0.8 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.8 }]
      }
    }
  }
}
```

**Steg C — Lägg till i `.github/workflows/ci.yml`:**

```yaml
      - name: Bygg for Lighthouse
        run: npm run build

      - name: Lighthouse CI
        run: npx lhci autorun
```

### VERIFIERA
- Lokalt: `cd client && npx lhci autorun` → rapport i konsolen
- I CI: PR-checks visar Lighthouse-score

---

## Steg 9: Snyk CLI för sårbarhetsscanning ✅ KLAR (4 aug 2026)

**Tid:** 15 min
**Prioritet:** Rekommenderad

### VAD
Registrera gratis Snyk-konto + installera CLI + lägg till i CI.

### VARFÖR
`npm audit` är bra men Snyk har bättre sårbarhetsdatabas och föreslår
konkreta fix-versioner. **Gratis för ensam utvecklare / publikt repo**:
200 open-source-tester/månad, obegränsat för egna repon.

### HUR

**Steg A — Registrera konto och installera:**

1. Skapa gratis konto på https://snyk.io
2. `npm install -g snyk`
3. `snyk auth` (öppnar webbläsare för login)

**Steg B — Testa lokalt:**

```bash
cd client && snyk test --severity-threshold=high
```

Visar sårbara paket + fix-förslag.

**Steg C — Lägg till i CI (`.github/workflows/ci.yml`):**

```yaml
      - name: Snyk sårbarhets-scan
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          # SNYK_TOKEN sparas som repository secret i GitHub-installningar
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

**Steg D — Lägg SNYK_TOKEN som secret:**
GitHub repo → Settings → Secrets → Actions → New secret → SNYK_TOKEN.
Token hämtas från snyk.io → Account Settings.

### VERIFIERA
- `snyk test` lokalt → rapport med sårbara paket och fix-versioner
- I CI: PR-checks visar Snyk-status

---

## Steg 10: Sentry — framtida-påminnelse (installera först vid prod-deploy)

**Tid:** 0 min nu — 30 min när det behövs
**Prioritet:** Rekommenderad (framtida)

### VAD
Sentry är strukturerad felövervakning i produktion. Fångar runtime-fel som
händer hos användare + skickar stack traces + kontext till en dashboard.

### VARFÖR INTE NU?
Sentry blir meningsfullt när:
- Backend finns (v.5-8)
- Appen är deployad till Vercel/Railway
- Riktiga användare kör den

I utvecklingsläge räcker `ErrorBoundary` + `console.error` — Sentry lägger
bara till overhead och kräver kontrouppsättning.

### NÄR SKA DET AKTIVERAS?
Efter första produktions-deploy. Lägg TODO i ROADMAP under Fas 3.

### HUR (när dagen kommer)

```bash
cd client && npm install @sentry/react
```

I `main.tsx`:

```tsx
import * as Sentry from "@sentry/react"

// Initialiseras bara i produktion — utvecklingslage anvander ErrorBoundary + console
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    // Skickar bara 10 % av transaktionerna for att halla kostnaden nere
    tracesSampleRate: 0.1,
  })
}
```

`DSN` (Data Source Name) skapas i Sentry-dashboarden. Läggs i `.env`
som `VITE_SENTRY_DSN` — aldrig committas.

### KOMMANDE PÅMINNELSE
Lägg till TODO i `ROADMAP.md` under "Fas 3 — Avancerat":
`- Sentry när prod-deploy sker (felövervakning + source maps upload)`

---

## Steg 11: useDebounce-hook för sökning (framtida — när backend finns)

**Tid:** 15 min (när tiden kommer)
**Prioritet:** Rekommenderad — aktiveras vecka 5-6

### VAD
Skapa en `useDebounce`-hook som dröjer värdet en kort stund efter senaste
ändring. Använd i `useMemberSearch` så filter-/API-anrop inte triggas vid
varje tangenttryck.

### VARFÖR
Utan debounce körs sökfiltret vid varje bokstav — omedvetet OK med mockdata
(~30 medlemmar) men skickar en API-request per bokstav när backend är på
plats. Med 100+ medlemmar och riktig databas → prestandaproblem och onödig
serverbelastning.

Just nu: **inte akut**. När backend byggs (vecka 5-6 enligt ROADMAP):
**kritiskt**.

### HUR

Skapa `client/src/hooks/useDebounce.ts`:

```tsx
// useDebounce — drojer vardet en kort stund efter senaste andring
// Anvands nar dyra operationer (API-anrop, tunga filter) ska vanta
// tills anvandaren slutat skriva
//
// Anvands av: useMemberSearch (aktiveras nar backend finns)

import { useState, useEffect } from "react"

// Returnerar det senaste vardet, men bara efter delayMs utan ny andring
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    // Startar en timer varje gang vardet andras
    const timer = setTimeout(() => setDebounced(value), delayMs)
    // Om vardet andras igen INNAN timern gar ut — avbryt och starta om
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}
```

Använd i `hooks/useMemberSearch.ts`:

Före:
```tsx
const matchesSearch = member.name
  .toLowerCase()
  .includes(searchText.toLowerCase())
```

Efter:
```tsx
import { useDebounce } from "./useDebounce"

// Vantar 300ms efter senaste tangenttryck — sedan filtreras listan
const debouncedSearch = useDebounce(searchText, 300)

const filteredMembers = useMemo(() => {
  return members.filter((member) => {
    const matchesSearch = member.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
    // ...
  })
}, [members, debouncedSearch, filter])
```

Ingången uppdateras direkt (`searchText`), men filtret använder
`debouncedSearch` som väntar 300ms.

### VERIFIERA
1. Skriv snabbt i sökfältet — se att listan INTE flackar för varje bokstav
2. Vänta 300ms efter senaste bokstav — listan filtreras
3. Ingen `npm install` behövs — 10 rader kod, noll deps

### KOMMANDE PÅMINNELSE
Aktivera detta samtidigt som backend + Prisma börjar användas i vecka 5-6.
Uppdatera `ROADMAP.md` under Fas 3 med:
`- useDebounce-hook för sökning (Members)`

---

## Sammanfattning

| # | Steg | Tid | Prioritet |
|---|---|---|---|
| 1 | Path aliases (tsconfig + vite.config) | 25 min | Viktig |
| 2 | React.memo på MemberCard, Badge, StatCard | 20 min | Rekommenderad |
| 3 | useCallback för handlers till memo-barn | 15 min | Rekommenderad |
| 4 | lazy() + Suspense för Members/Calendar/Services/DesignPreview | 25 min | Viktig |
| 5 | DOMPurify — bara påminnelse i ROADMAP | 0 min | Rekommenderad (framtida) |
| 6 | ErrorBase-klass-mönster (`lib/errors.ts`) | 20 min | Viktig |
| 7 | Semgrep SAST i CI | 15 min | Rekommenderad |
| 8 | Lighthouse CI (a11y + prestanda budget) | 20 min | Rekommenderad |
| 9 | Snyk CLI för sårbarhetsscanning | 15 min | Rekommenderad |
| 10 | Sentry — bara påminnelse i ROADMAP | 0 min | Rekommenderad (framtida) |
| 11 | useDebounce-hook för sökning | 15 min | Rekommenderad (framtida — v.5-6) |

**Total tid:** ungefär 175 min, uppdelat i 6-8 sessioner.

---

## Rekommenderad dag-ordning

**Session 1 — Setup (25 min)**
- Steg 1: Path aliases + konvertera Members.tsx som exempel

**Session 2 — Bundle-optimering (25 min)**
- Steg 4: lazy() + Suspense

**Session 3 — Memoization (35 min)**
- Steg 2: React.memo på 3-4 komponenter
- Steg 3: useCallback för handlers till dessa komponenter

**Session 4 — Framtidssäkring (5 min)**
- Steg 5: Lägg TODO för DOMPurify i ROADMAP.md
- Steg 10: Lägg TODO för Sentry i ROADMAP.md
- Steg 11: Lägg TODO för useDebounce i ROADMAP.md (aktiveras v.5-6)

**Session 5 — Felhantering (20 min)**
- Steg 6: ErrorBase-klass-mönster

**Session 6 — Säkerhet i CI (30 min)**
- Steg 7: Semgrep
- Steg 9: Snyk

**Session 7 — Kvalitetsmätning (20 min)**
- Steg 8: Lighthouse CI

---

## Efter varje session

1. Kör `npx tsc -p tsconfig.app.json --noEmit` — bygget måste vara grönt
2. Kör `npm run lint`
3. Kör `npm run test`
4. Kör `npm run build` (viktigt efter Steg 1 och Steg 4)
5. Skriv dags-logg i `DAGBOK.md`
6. Fråga: ska något loggas som milstolpe?
