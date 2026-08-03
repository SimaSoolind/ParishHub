# UX & Tillgänglighet — Instruktion för Sima

En steg-för-steg-plan för att uppfylla WCAG-krav och förbättra användarupplevelsen i ParishHub.

Instruktionen är designad för ADHD- och dyslexi-vänligt arbete: ett steg per session, korta stycken, konkreta filnamn och kodexempel.

Uppdaterad: 2026-08-03

---

## Så här läser du instruktionen

Varje steg är ett eget mini-projekt. Gör **ett steg per session** — inte två samtidigt. Bocka av när det är klart. Om det uppstår problem, be Claude om hjälp med **ETT** steg — inte alla.

**Prioritet-nivåer:**

- **Kritisk** — WCAG-krav som lyder under svensk lag för offentlig sektor (DOS-lagen) och EU-direktivet
- **Viktig** — förbättrar användbarheten markant och stärker SEO
- **Rekommenderad** — polering och utvecklarverktyg

**Regler för arbetsflödet:**

- Läs igenom steget innan koden ändras
- Kör `npm run dev` i en flik och testa efter varje steg
- Kör `npx tsc -p tsconfig.app.json --noEmit` innan commit — bygget måste vara grönt
- Skriv dags-logg i `DAGBOK.md` när sessionen är slut

---

## Steg 1: Semantiska taggar i Dashboard

**Tid:** 20 min
**Prioritet:** Viktig

### VAD
Byt yttre `<div>`-omslag i `Dashboard.tsx` till semantiska HTML-element.

### VARFÖR
Skärmläsare (VoiceOver, NVDA) läser upp sidstruktur högt så synskadade förstår vad som är huvudinnehåll. `<div>` säger ingenting. `<main>` säger "här är sidans huvudinnehåll". Google använder också semantiska taggar för SEO.

### HUR
Öppna `client/src/pages/Dashboard.tsx`.

**Före** (yttre `<div>`):

```tsx
return (
  <div>
    <h1>Hej Fader Korollos</h1>
    <div>
      <StatCard ... />
      <StatCard ... />
    </div>
    <BirthdayList ... />
    <PriorityList ... />
  </div>
)
```

**Efter** (semantiska element):

```tsx
return (
  <main>
    {/* Halsnings-sektion hogst upp med datum och namn */}
    <header>
      <h1>Hej Fader Korollos</h1>
    </header>

    {/* Statistik-korten grupperade som en sektion */}
    <section aria-label="Statistik">
      <StatCard ... />
      <StatCard ... />
    </section>

    {/* Fodelsedagar som egen sektion med tydlig rubrik */}
    <section aria-labelledby="birthday-heading">
      <h2 id="birthday-heading">Födelsedagar denna vecka</h2>
      <BirthdayList ... />
    </section>

    {/* Prioriterade kontakter som egen sektion med tydlig rubrik */}
    <section aria-labelledby="priority-heading">
      <h2 id="priority-heading">Att kontakta</h2>
      <PriorityList ... />
    </section>
  </main>
)
```

### Regler att komma ihåg
- Bara EN `<main>` per sida
- `<section>` behöver `aria-label` ELLER `aria-labelledby` för att skärmläsaren ska säga vad sektionen är
- Rubriker (`<h1>`, `<h2>`, `<h3>`) ska följa logisk ordning — hoppa inte över nivåer

### VERIFIERA
1. Öppna Chrome DevTools → fliken **Elements** → högerklicka på `<main>` → **Accessibility** → se "Landmarks"
2. På Mac: aktivera VoiceOver (Cmd+F5) → hör att skärmen läses "main region, huvudinnehåll"
3. Kör `document.querySelectorAll('main').length` i konsolen — resultatet ska vara `1`

---

## Steg 2: Semantiska taggar i Members

**Tid:** 15 min
**Prioritet:** Viktig

### VAD
Samma som steg 1, fast för `client/src/pages/Members.tsx`.

### HUR
Byt yttre `<div>` till `<main>`. Sök- och filter-området får `<section aria-label="Sök och filter">`. Medlemslistan blir `<ul>`.

```tsx
<main>
  <header>
    <h1>Medlemmar</h1>
    <p>Totalt {total} medlemmar</p>
  </header>

  {/* Sok och filter-sektion */}
  <section aria-label="Sök och filter">
    <input ... />
    <div role="group" aria-label="Filtrera per kategori">
      {/* Filter-knapparna */}
    </div>
  </section>

  {/* Lista med medlemmar som semantisk ul */}
  <ul aria-label="Medlemslista">
    {filteredMembers.map(member => (
      <MemberCard key={member.id} member={member} ... />
    ))}
  </ul>
</main>
```

### VERIFIERA
Samma som Steg 1. Dessutom: testa att Tab-tangenten fokuserar sökfält → filterknappar → medlemsrader i logisk ordning.

---

## Steg 3: Semantiska taggar i Calendar och Services

**Tid:** 15 min
**Prioritet:** Viktig

### VAD
Samma mönster som Steg 1-2 för `Calendar.tsx` och `Services.tsx`.

### HUR
- `<main>` som yttersta element
- `<header>` för rubrik-blocket
- `<section>` för verktygsrad och själva kalendern eller gudstjänstlistan

`Services.tsx` har redan `<section>` och `<header>` — kontrollera att strukturen inte dubbleras.

### VERIFIERA
Samma som Steg 1.

---

## Steg 4: Focus-trap i modaler (KRITISKT)

**Tid:** 30 min
**Prioritet:** Kritisk

### VAD
När en modal öppnas ska Tab-tangenten cirkulera INOM modalen, inte hoppa ut till sidan bakom. När modalen stängs ska fokus återgå till knappen som öppnade den.

### VARFÖR
Utan focus-trap kan tangentbords-användare (och skärmläsare) tappa bort sig bakom modalen. WCAG 2.4.3 kräver logisk fokus-ordning. Detta är **lag** för offentlig sektor.

### HUR
Installera `focus-trap-react`:

```bash
cd client && npm install focus-trap-react
```

I varje modal (`AddMemberModal.tsx`, `MemberProfileModal.tsx`, `AddServiceModal.tsx`, `AttendanceModal.tsx`, `AddEventModal.tsx`, `EventModal.tsx`, `GroupMessageModal.tsx`):

```tsx
import { FocusTrap } from "focus-trap-react"

export function AddMemberModal({ onClose, ... }: Props) {
  return (
    <FocusTrap
      focusTrapOptions={{
        // Fokus atergar till knappen som oppnade modalen vid stangning
        returnFocusOnDeactivate: true,
        // Escape-tangenten stanger modalen (aktiverar onDeactivate)
        escapeDeactivates: true,
        onDeactivate: onClose,
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-member-title"
        className="modal-backdrop"
      >
        <div className="modal-panel">
          <h2 id="add-member-title">Ny medlem</h2>
          {/* resten av modalen */}
        </div>
      </div>
    </FocusTrap>
  )
}
```

### Regler att komma ihåg
- `role="dialog"` + `aria-modal="true"` säger till skärmläsare att detta är en modal
- `aria-labelledby` pekar på rubrikens id → skärmläsaren läser "Ny medlem, dialog"
- Första fokusbara elementet inuti modalen får automatiskt fokus

### VERIFIERA
1. Öppna en modal → tryck Tab flera gånger → fokus ska stanna i modalen
2. Tryck Escape → modalen ska stängas OCH fokus ska återgå till knappen som öppnade den
3. Aktivera VoiceOver → öppna modal → hör "Ny medlem, dialog"

---

## Steg 5: Tangentbordsnavigering

**Tid:** 10 min per modal
**Prioritet:** Kritisk

### VAD
Alla klickbara element ska vara `<button>`, inte `<div onClick>`. Escape ska stänga modaler även utan FocusTrap.

### VARFÖR
CLAUDE.md-regeln säger detta redan. `<div onClick>` går inte att nå med Tab. `<button>` får Enter- och Space-hantering gratis.

### HUR
Sök i klient-koden efter `<div onClick`:

```bash
cd client && grep -rn "div.*onClick" src/
```

Byt varje träff:

**Innan:**

```tsx
<div onClick={handleClick}>Öppna profil</div>
```

**Efter:**

```tsx
<button
  type="button"
  onClick={handleClick}
  className="text-left w-full"
>
  Öppna profil
</button>
```

Om elementet MÅSTE vara en `<div>` (t.ex. hel kortyta som är klickbar):

```tsx
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    // Enter och mellanslag aktiverar knappen pa samma satt som en riktig button
    if (e.key === "Enter" || e.key === " ") handleClick()
  }}
>
```

### VERIFIERA
Använd BARA tangentbordet (Tab, Shift+Tab, Enter, Escape) — hela appen ska gå att navigera utan mus.

---

## Steg 6: Toast-notiser med sonner

**Tid:** 20 min
**Prioritet:** Rekommenderad

### VAD
Lägg till toast-lib så användaren får feedback när något sparas, ändras eller raderas.

### VARFÖR VÄLJA `sonner` FRAMFÖR `react-hot-toast`?
- Modernare API (2024+)
- Bättre inbyggd a11y — `role="status"` och `aria-live` automatiskt
- Mindre bundle-size (12kB vs 30kB)
- Bra TypeScript-typer
- Utvecklad av samma team som Vercel — långsiktigt supportad

Nackdel: nyare, mindre community än react-hot-toast. Men för ParishHub är a11y + typing viktigare.

### HUR

```bash
cd client && npm install sonner
```

I `App.tsx`:

```tsx
import { Toaster } from "sonner"

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        {/* Toast-container overst till hoger, anvands av toast() overallt i appen */}
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          {/* ... */}
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
```

Använd i `Members.tsx`:

```tsx
import { toast } from "sonner"

const handleAddMember = (newMember: NewMemberData) => {
  // ... sparning ...
  toast.success("Medlem tillagd")
}

const handleDeleteMember = (id: string) => {
  // ... radering ...
  toast.success("Medlem borttagen")
}
```

### VERIFIERA
Lägg till en medlem → grön toast dyker upp uppe till höger, försvinner efter några sekunder, går att stänga med krysset.

---

## Steg 7: Skeleton-komponenter vid datahämtning

**Tid:** 30 min
**Prioritet:** Rekommenderad

### VAD
Ersätt "Laddar..."-text med grå platshållar-block som liknar innehållet som kommer.

### VARFÖR
Skeleton känns snabbare än text-loading. Layout hoppar inte när data kommer in. Perceived performance är ~20% bättre enligt studier.

### HUR
Skapa `client/src/components/Skeleton.tsx`:

```tsx
// Skeleton — gra platshallare med pulserande animation
// Anvands medan data hamtas fran API eller mock-repository
// Ger anvandaren visuell aterkoppling att nagot laddas

interface Props {
  className?: string
  // aria-label for skarmlasare — beskriver vad som laddas
  ariaLabel?: string
}

export function Skeleton({ className = "", ariaLabel = "Laddar" }: Props) {
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`animate-pulse bg-stone-200 rounded ${className}`}
    />
  )
}
```

Använd i en sida:

```tsx
const { data, isLoading } = useCopticCelebrations(365)

if (isLoading) {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-1/2" ariaLabel="Laddar rubrik" />
      <Skeleton className="h-24 w-full" ariaLabel="Laddar högtider" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
```

Tailwind har `animate-pulse` inbyggt — ingen extra CSS behövs.

### VERIFIERA
Öppna kalendern i inkognito-läge (första besöket, cache tom) — se skeleton pulsera i cirka en sekund innan riktig data dyker upp.

---

## Steg 8: @axe-core/react för automatisk a11y-revision i dev

**Tid:** 15 min
**Prioritet:** Rekommenderad

### VAD
Verktyg som skannar sidan i utvecklings-läget och loggar a11y-brister i konsolen — direkt.

### VARFÖR
Fångar problem tidigt (missad `alt`, låg kontrast, saknad label). Utvecklat av Deque — samma team som Axe DevTools browser extension.

### HUR

```bash
cd client && npm install --save-dev @axe-core/react
```

I `main.tsx`:

```tsx
import React from "react"
import ReactDOM from "react-dom/client"

// Aktiverar axe-core bara i utvecklingslage (aldrig i produktion)
// Skannar sidan var 1000:e ms och loggar a11y-brister i konsolen
if (import.meta.env.DEV) {
  import("@axe-core/react").then(({ default: axe }) => {
    axe(React, ReactDOM, 1000)
  })
}
```

### VERIFIERA
Öppna appen i dev-läge → Chrome DevTools Console → se en tabell med a11y-brister (om några finns).

---

## Steg 9: Focus-visible i Tailwind

**Tid:** 20 min
**Prioritet:** Rekommenderad

### VAD
Synlig fokus-ring på alla knappar och länkar när användaren tab:ar.

### VARFÖR
Tangentbords-användare (cirka 10 procent av alla, inklusive tillfälliga skador) måste kunna se var fokus är. WCAG 2.4.7.

### HUR
Öppna `client/src/index.css` och lägg till globalt:

```css
/* Global focus-ring for alla fokusbara element */
/* focus-visible aktiveras BARA vid tangentbords-fokus, inte vid mus-klick */
@layer base {
  *:focus-visible {
    outline: 2px solid theme('colors.amber.700');
    outline-offset: 2px;
    border-radius: 4px;
  }
}
```

Alternativt utan globalt: lägg `focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2` på varje knapp. Globalt är mindre kod.

### VERIFIERA
Tab genom hela appen — se en tydlig kopparfärgad ring runt varje fokuserat element. Klicka med musen — ingen ring (för att inte störa musanvändare).

---

## Sammanfattning

| # | Steg | Tid | Prioritet |
|---|---|---|---|
| 1 | Semantiska taggar i Dashboard | 20 min | Viktig |
| 2 | Semantiska taggar i Members | 15 min | Viktig |
| 3 | Semantiska taggar i Calendar + Services | 15 min | Viktig |
| 4 | Focus-trap i modaler | 30 min | **Kritisk** |
| 5 | Tangentbordsnavigering | 10 min × modaler | **Kritisk** |
| 6 | Toast-notiser (sonner) | 20 min | Rekommenderad |
| 7 | Skeleton-komponenter | 30 min | Rekommenderad |
| 8 | @axe-core/react | 15 min | Rekommenderad |
| 9 | Focus-visible i Tailwind | 20 min | Rekommenderad |

**Total tid:** ungefär 3-4 arbetstimmar, uppdelat i 9 sessioner.

---

## Rekommenderad dag-ordning

**Dag 1 — Setup + upptäck brister**
- Steg 8: `@axe-core/react` först — då syns fel live medan resten fixas

**Dag 2 — Kritiska WCAG-krav**
- Steg 4: Focus-trap i modaler
- Steg 5: Tangentbordsnavigering

**Dag 3 — Snabba semantiska vinster**
- Steg 1: Dashboard
- Steg 2: Members
- Steg 3: Calendar + Services

**Dag 4 — Polering**
- Steg 6: Toast-notiser
- Steg 7: Skeleton-komponenter
- Steg 9: Focus-visible

---

## Efter varje session

1. Kör `npx tsc -p tsconfig.app.json --noEmit` — bygget måste vara grönt
2. Kör `npm run lint`
3. Kör `npm run test`
4. Skriv dags-logg i `DAGBOK.md`
5. Fråga: ska något loggas som milstolpe?
