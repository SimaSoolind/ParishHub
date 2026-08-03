# Kodstruktur & Prestanda — Instruktion för Sima

Steg-för-steg-plan för de rekommendationer från kod-analys-rapporten som
fortfarande är kvar. Fokus på kodstruktur och prestanda-optimeringar.

Instruktionen är designad för ADHD- och dyslexi-vänligt arbete:
ett steg per session, korta stycken, konkreta filnamn och kodexempel.

Uppdaterad: 2026-08-03

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

## Sammanfattning

| # | Steg | Tid | Prioritet |
|---|---|---|---|
| 1 | Path aliases (tsconfig + vite.config) | 25 min | Viktig |
| 2 | React.memo på MemberCard, Badge, StatCard | 20 min | Rekommenderad |
| 3 | useCallback för handlers till memo-barn | 15 min | Rekommenderad |
| 4 | lazy() + Suspense för Members/Calendar/Services/DesignPreview | 25 min | Viktig |
| 5 | DOMPurify — bara påminnelse i ROADMAP | 0 min | Rekommenderad (framtida) |

**Total tid:** ungefär 90 min, uppdelat i 4-5 sessioner.

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

---

## Efter varje session

1. Kör `npx tsc -p tsconfig.app.json --noEmit` — bygget måste vara grönt
2. Kör `npm run lint`
3. Kör `npm run test`
4. Kör `npm run build` (viktigt efter Steg 1 och Steg 4)
5. Skriv dags-logg i `DAGBOK.md`
6. Fråga: ska något loggas som milstolpe?
