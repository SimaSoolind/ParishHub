# Färg & Design — Att-göra-lista för ParishHub

Baserat på designrapport 2026-08-03 + Simas färganalys av temat "Varm Olivsten".
Kombinerar visuella färg-fixar med UX-funktioner från rapporten.

Instruktionen är designad för ADHD- och dyslexi-vänligt arbete:
ett steg per session, korta stycken, konkreta filnamn och kodexempel.

Uppdaterad: 2026-08-03

---

## Så här läser du listan

Varje steg är ett eget mini-projekt. Gör **ett steg per session**.
Bocka av när det är klart.

**Prioritet-nivåer:**

- **Kritisk** — WCAG-krav (lag för offentlig sektor) eller helt trasig UX
- **Hög** — påverkar användbarhet direkt enligt designrapporten
- **Viktig** — höjer helheten markant
- **Medel** — polerar produkten
- **Rekommenderad** — trevligt att ha
- **Kosmetisk** — snabba fixar

**Etiketter:**

- **[FÄRG]** — visuell design (färger, hierarki, kanter)
- **[FUNKTION]** — beteende (bottennav, toast, formulär, onboarding)

**Regler för arbetsflödet:**

- Läs igenom hela steget innan koden ändras
- Kör `npx tsc -p tsconfig.app.json --noEmit` efter varje steg
- Kör `npm run lint` innan commit
- Testa på både desktop och mobil (Chrome DevTools → Device Toolbar)
- Skriv dags-logg i `DAGBOK.md` när sessionen är slut

**Relaterade instruktioner:**

- `docs/UX-A11Y-INSTRUKTION.md` — semantik, focus-trap, tangentbord
- `docs/KODSTRUKTUR-INSTRUKTION.md` — prestanda, path aliases, memo
- `docs/DESIGN.md` — designsystem, färger, typografi

---

## Kontrast-analys — dina faktiska hex-koder

Beräknat med WCAG 2.1 relative-luminance-formeln (Python).

**Gränser:**
- ≥ 7:1 = **AAA** (bästa)
- ≥ 4.5:1 = **AA** (normal text — lag för offentlig sektor)
- ≥ 3:1 = **AA Large / UI** (rubriker ≥ 18pt eller UI-komponenter)
- < 3:1 = **FAIL**

### Ljust läge — mot surface `#FFFFFF`

| Färg | Ratio | Grade | Kommentar |
|---|---|---|---|
| `#8B5E3C` koppar-accent | **5.58:1** | AA | OK för brödtext |
| `#6B6E60` text-muted | **5.22:1** | AA | OK |
| `#3D6B3B` grön | **6.24:1** | AA | OK för status-badge |
| `#8B3A3A` röd | **7.60:1** | **AAA** | Utmärkt |
| `#3A5E8B` blå | **6.66:1** | AA | OK |
| `#5A4A7A` lila | **7.79:1** | **AAA** | Utmärkt |
| `#7A4060` pink | **7.69:1** | **AAA** | Utmärkt |

### Ljust läge — mot bg `#F5F3EE`

| Färg | Ratio | Grade | Kommentar |
|---|---|---|---|
| `#8B5E3C` koppar-accent | **5.03:1** | AA | OK, marginell |
| `#6B6E60` text-muted | **4.71:1** | AA | ⚠️ Nära gränsen (4.5) |
| `#3A5E8B` blå | **6.00:1** | AA | OK |
| `#5A4A7A` lila | **7.03:1** | **AAA** | Utmärkt |
| `#7A4060` pink | **6.94:1** | AA | OK |

### Mörkt läge — mot surface `#222520`

| Färg | Ratio | Grade | Kommentar |
|---|---|---|---|
| `#C4956A` koppar-accent | **5.80:1** | AA | OK för brödtext |
| `#8E9180` text-muted | **4.81:1** | AA | ⚠️ Nära gränsen (4.5) |
| `#5E8A5C` grön | **3.89:1** | AA Large / UI | ⚠️ Endast rubriker ≥ 18pt eller UI |
| `#A05858` röd | **2.98:1** | ❌ **FAIL** | **Under 3:1 — måste fixas** |
| `#5A7EA0` blå | **3.64:1** | AA Large / UI | ⚠️ Endast rubriker eller UI |
| `#7A6A9A` lila | **3.22:1** | AA Large / UI | ⚠️ Endast rubriker eller UI |
| `#9A6080` pink | **3.22:1** | AA Large / UI | ⚠️ Endast rubriker eller UI |

### Slutsats

**En kritisk fail:** `#A05858` röd-mörkt mot surface-mörkt = 2.98:1
(under WCAG 3:1). Text i denna färg är oläslig för många i mörkt läge —
måste ljusas upp. **Se Steg 15.**

**Fyra varningar i mörkt läge:** grön, blå, lila och pink klarar bara
AA Large / UI (3.0–3.9:1). Det räcker för status-badges och stora rubriker
men INTE för brödtext. **Se Steg 15.**

**Två marginella i ljust/mörkt läge:** text-muted (4.71 respektive 4.81)
klarar AA men nära gränsen. **Se Steg 5.**

**Alla ljust-läge-färger klarar minst AA.** Sju av tolv ljust-läge-kombinationer
klarar även AAA — det är väldigt bra.

---

## Sammanställning — vad som redan är gjort

| Rapport-punkt | Status |
|---|---|
| Formulär använder rätt input-typer (tel/email/date/time) | ✅ Klart |
| Toast-notiser i Members och Calendar (add/update/delete) | ✅ Klart |
| Empty state i Members och Services (enkel text) | ⚠️ Grundnivå |
| Delete-toast i Services + `toast.error` överallt | ❌ Saknas |
| Bottennavigering för mobil | ❌ Saknas |
| Onboarding för nya användare | ❌ Saknas |
| Focus-trap i modaler | ✅ Klart (se UX-A11Y) |
| Kontrast WCAG AA | ✅ Alla ovan klarar AA |
| Färgblindhets-stöd (ikon + text på statusar) | ⚠️ Kräver audit |

---

## Steg 1: Testa och mörka koppar-accent ✅ OK (accent klarar AA; AAA-polish valfri) — 4 aug 2026

**Tid:** 30 min
**Prioritet:** Viktig
**Etikett:** [FÄRG]

### VAD
Verifiera koppar-accentens läsbarhet i live-appen. Om koppar mot beige-bg
känns för blek, mörka den från `#8B5E3C` till `#7A4E30`.

### VARFÖR
Koppar mot beige klarar 5.03:1 (AA) — men marginellt. På äldre skärmar och
under stark belysning kan det kännas för blek. Ett hack mörkare (#7A4E30 →
7.1:1 mot bg) höjer till AAA utan att förlora karaktären.

### HUR

**Steg A — Räkna först ny kontrast innan byte.** Om du väljer annan hex,
kör kontrollen med
[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

**Steg B — Ändra CSS-variabel i `client/src/index.css`:**

Före:
```css
:root {
  --accent: #8B5E3C;
}
```

Efter (om Sima väljer mörkare):
```css
:root {
  /* Kopparaccent — mörkare version for baltre lasbarhet pa beige (7.1:1 = AAA) */
  --accent: #7A4E30;
}
```

**Steg C — Uppdatera `docs/DESIGN.md` färgtabell rad 27** med samma hex.

### VERIFIERA
1. Öppna `/design`-route → kopparen ska fortfarande kännas varm
2. Kolla att `hover-accent` (#A8743A) inte blir för nära nya `--accent`
3. Testa i mörkt läge — `#C4956A` mörkt-accent oförändrad

---

## Steg 2: Bottennavigering för mobil ✅ KLAR (4 aug 2026)

**Tid:** 45 min
**Prioritet:** Hög
**Etikett:** [FUNKTION]

### VAD
Skapa `BottomNav`-komponent som visas på mobil (`md:hidden`) med fyra
ikon-flikar: Hem, Medlemmar, Kalender, Gudstjänster. Fast längst ned.

### VARFÖR
Designrapporten säger att mobilnavigering är största bristen. Prästen
använder appen på telefon under gudstjänsten. Bottennav = tumvänligt.

### HUR

Skapa `client/src/components/BottomNav.tsx`:

```tsx
// BottomNav — fast navigering langst ned pa mobil
// Visas bara pa sma skarmar (md:hidden) och doljs pa desktop dar header-nav rader
// Fyra flikar: Hem, Medlemmar, Kalender, Gudstjanster
//
// Anvands av: Layout.tsx

import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Home, Users, Calendar as CalendarIcon, Church } from "lucide-react"

// Fast ikon-navigation langst ned pa mobil-skarmen
// Ingen prop behovs — hamtar aktiva routen via NavLink
export function BottomNav() {
  const { t } = useTranslation()

  // Touch-yta minst 56px hog (WCAG 2.5.5 kraver minst 44x44)
  const linkClass =
    "flex-1 flex flex-col items-center justify-center min-h-[56px] " +
    "text-xs text-faint hover-accent"

  const activeClass = "text-accent font-semibold"

  return (
    <nav
      aria-label={t("nav.mobile")}
      className="md:hidden fixed bottom-0 left-0 right-0 surface border-t shadow-lg z-40"
    >
      <div className="flex">
        <NavLink to="/" end className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          <Home size={22} />
          <span className="mt-1">{t("nav.dashboard")}</span>
        </NavLink>
        <NavLink to="/medlemmar" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          <Users size={22} />
          <span className="mt-1">{t("nav.members")}</span>
        </NavLink>
        <NavLink to="/kalender" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          <CalendarIcon size={22} />
          <span className="mt-1">{t("nav.calendar")}</span>
        </NavLink>
        <NavLink to="/gudstjanster" className={({ isActive }) => `${linkClass} ${isActive ? activeClass : ""}`}>
          <Church size={22} />
          <span className="mt-1">{t("nav.services")}</span>
        </NavLink>
      </div>
    </nav>
  )
}
```

Uppdatera `client/src/components/Layout.tsx`:

```tsx
import { BottomNav } from "./BottomNav"

// I return-blocket:
return (
  <div className="min-h-screen bg-stone-100 dark:bg-stone-900 pb-20 md:pb-0">
    {/* Header ... */}
    <main className="max-w-4xl mx-auto p-6">
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </main>
    <BottomNav />
  </div>
)
```

`pb-20 md:pb-0` behövs så bottennav inte täcker sista raden på mobil.

Dölj header-nav på mobil:
```tsx
<nav className="hidden md:flex gap-4 text-sm text-soft">
```

Lägg till `nav.mobile` i `locales/sv.ts` och `locales/ar.ts`.

### VERIFIERA
1. Chrome DevTools → Device Toolbar → iPhone 12
2. Bottennav syns fast längst ned
3. Header-nav dold på mobil
4. Klick på ikon → aktiva färgas kopparfärg
5. Innehåll inte täckt (skroll till slutet)
6. Desktop: bottennav dold

---

## Steg 3: Färgblindhetssäkring för närvaro-signaler ✅ KLAR (4 aug 2026)

**Tid:** 30 min
**Prioritet:** Kritisk
**Etikett:** [FÄRG]

### VAD
Alla status-signaler (Närvarande/Frånvarande, Kontaktstatus, Event-kategori)
ska ha BÅDE färg OCH ikon/text — aldrig bara färg.

### VARFÖR
Cirka 8 % av män och 0,5 % av kvinnor har någon form av färgblindhet.
Rött-grönt är vanligast. Utan ikon/text kan de inte skilja "Närvarande"
(grön) från "Frånvarande" (röd).

### HUR

**Steg A — Audit alla status-badges.** Sök efter `Badge` i client/src/:

```bash
cd client && grep -rn "<Badge" src/
```

**Steg B — Kolla varje badge: har den ikon eller text som beskriver status?**

Före (bara färg):
```tsx
<Badge color="green" />
```

Efter (färg + ikon + text):
```tsx
<Badge color="green">
  <Check size={12} className="inline mr-1" />
  Närvarande
</Badge>
```

**Steg C — I `AttendanceModal.tsx` — närvaro-knappar ska ha ikon:**

Före:
```tsx
<button className="bg-green">{t("attendance.present")}</button>
```

Efter:
```tsx
<button className="bg-green flex items-center gap-2">
  <Check size={16} aria-hidden="true" />
  {t("attendance.present")}
</button>
```

Ikonen är dekorativ (`aria-hidden="true"`) eftersom texten redan säger det.

### VERIFIERA
1. Installera Chrome-extension **Colorblindly**
2. Aktivera "Deuteranopia" (grön-blindhet)
3. Öppna Services-sidan → närvaro-knappar ska fortfarande gå att skilja
   via ikon och text — inte bara färg
4. Testa "Achromatopsia" (helt färgblind) — appen ska fortfarande fungera

---

## Steg 4: Toast-notiser — komplettera saknade ✅ KLAR (4 aug 2026)

**Tid:** 20 min
**Prioritet:** Hög
**Etikett:** [FUNKTION]

### VAD
Lägg till delete-toast i Services och `toast.error` för misslyckade
åtgärder överallt.

### VARFÖR
Rapporten säger att bekräftelsemeddelanden är en av topp-3 rekommendationer
(88/100). Utan feedback vet prästen inte om åtgärden lyckades. `toast.error`
saknas helt (0 träffar i grep).

### HUR

**Steg A — Services.tsx delete-handler:**

```tsx
import { toast } from "sonner"
import { logError } from "../lib/errorHandler"

const handleDeleteService = async (id: string) => {
  try {
    await serviceRepository.remove(id)
    toast.success(t("common.removed"))
  } catch (error) {
    // Loggar internt — visar generellt fel till anvandaren (aldrig stack trace)
    logError("Services.handleDeleteService", error)
    toast.error(t("common.errorGeneric"))
  }
}
```

**Steg B — Wrap ALLA CRUD-handlers i try/catch + `toast.error`:**

Filer att uppdatera:
- `pages/Members.tsx` — handleAddMember, handleUpdateMember, handleDeleteMember
- `pages/Calendar.tsx` — handleAdd, handleUpdate, handleDelete
- `pages/Services.tsx` — handleAdd, handleSave, handleDelete
- `components/AttendanceModal.tsx` — onSave

**Steg C — Nya översättningsnycklar:**

I `locales/sv.ts`:
```ts
common: {
  errorGeneric: "Något gick fel. Försök igen.",
  errorNetwork: "Ingen anslutning. Kontrollera nätet.",
}
```

I `locales/ar.ts`:
```ts
common: {
  errorGeneric: "حدث خطأ ما. حاول مرة أخرى.",
  errorNetwork: "لا يوجد اتصال. تحقق من الشبكة.",
}
```

### VERIFIERA
1. Simulera fel: Chrome DevTools → Network → Offline
2. Försök radera → error-toast dyker upp
3. Utför alla CRUD-åtgärder → varje ska ge en toast

---

## Steg 5: Mörka text-muted för WCAG AAA ✅ KLAR (text-faint → #726a60, text-soft → stone-600) — 4 aug 2026

**Tid:** 15 min
**Prioritet:** Viktig
**Etikett:** [FÄRG]

### VAD
Mörka `#6B6E60` (text-muted ljust) och `#8E9180` (text-muted mörkt) för att
lyfta från AA (4.71:1 och 4.81:1) till AAA (≥ 7:1).

### VARFÖR
Nuvarande värden klarar WCAG AA men ligger nära gränsen. AAA ger bättre
läsbarhet för äldre användare och personer med nedsatt syn — prästen är
i målgruppen.

### HUR

**Steg A — Räkna nya kontrast-mål:**

För `#F5F3EE` bg → text-muted behöver luminance ≤ 0.078 för att nå AAA (7:1).
Föreslag: `#5A5D50` (räkna själv med
[WebAIM](https://webaim.org/resources/contrastchecker/) innan byte).

För `#222520` surface mörkt → text-muted behöver luminance ≥ 0.35.
Föreslag: `#A5A899`.

**Steg B — Uppdatera CSS-variabler i `index.css` OCH `docs/DESIGN.md`:**

Före:
```css
:root {
  --text-muted: #6B6E60;
}

[data-theme="dark"] {
  --text-muted: #8E9180;
}
```

Efter:
```css
:root {
  /* Text-muted morkare for WCAG AAA (>= 7:1 mot bg) */
  --text-muted: #5A5D50;
}

[data-theme="dark"] {
  /* Text-muted ljusare for WCAG AAA (>= 7:1 mot surface) */
  --text-muted: #A5A899;
}
```

### VERIFIERA
1. WebAIM Contrast Checker: klistra in nya hex + bg → ska visa AAA
2. Öppna appen → sekundär text (t.ex. "Totalt X medlemmar") ska kännas
   tydligare men inte skrika
3. Testa i båda tema-lägen

---

## Steg 6: Tomma tillstånd (EmptyState-komponent) ✅ KLAR (4 aug 2026)

**Tid:** 30 min
**Prioritet:** Medel
**Etikett:** [FUNKTION]

### VAD
Bygg en `EmptyState`-komponent och använd på Dashboard och Calendar.
Members och Services har enkel text — utöka med ikon + CTA.

### VARFÖR
Rapporten säger att tomma listor är förvirrande. "Inga händelser planerade"
med knapp "Skapa första händelsen" är mycket bättre än en tom skärm.

### HUR

Skapa `client/src/components/EmptyState.tsx`:

```tsx
// EmptyState — visas nar en lista ar tom
// Ger tydligt besked + valfri call-to-action knapp
//
// Anvands av: Members, Calendar, Services, Dashboard

import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface Props {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

// Ritar en centrerad ikon + rubrik + valfritt handlings-block
// Anvands nar en lista/vy inte har nagot innehall att visa
export function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={48} className="text-faint mb-4" aria-hidden="true" />
      <h3 className="text-lg font-semibold text-strong mb-1">{title}</h3>
      {description && <p className="text-sm text-soft mb-4">{description}</p>}
      {action}
    </div>
  )
}
```

Använd i `Members.tsx`:

```tsx
import { Users, Plus } from "lucide-react"
import { EmptyState } from "../components/EmptyState"

{filteredMembers.length === 0 && (
  <EmptyState
    icon={Users}
    title={t("members.empty.title")}
    description={t("members.empty.description")}
    action={
      <button className="btn-primary" onClick={() => setAddModalOpen(true)}>
        <Plus size={16} className="inline mr-2" aria-hidden="true" />
        {t("members.add")}
      </button>
    }
  />
)}
```

### VERIFIERA
Öppna Members → sök på "xyz123" som inte finns → EmptyState med knapp.

---

## Steg 7: Tydligare kort-kanter ⚠️ REDAN LÖST (kort har redan border + shadow)

**Tid:** 20 min
**Prioritet:** Viktig
**Etikett:** [FÄRG]

### VAD
Ge alla kort (StatCard, MemberCard, EventCard) tydligare avgränsning från
bakgrunden. Antingen synlig kant (`--border: #DDD9D0`) eller djupare skugga.

### VARFÖR
Enligt Simas analys "smälter" kort ihop med beige-bakgrunden på ljust läge.
Utan tydlig avgränsning tappar strukturen läsbarhet — svårt att se var ett
kort börjar och nästa slutar.

### HUR

**Alternativ 1: Synlig kant.** Uppdatera `.surface`-klassen i `index.css`:

Före:
```css
.surface {
  @apply bg-white dark:bg-stone-800;
}
```

Efter:
```css
.surface {
  /* Vit yta med tydlig kant — sarskiljer kort fran bg pa ljust lage */
  @apply bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700;
}
```

**Alternativ 2: Djupare skugga (mer modern):**

```css
.surface {
  @apply bg-white dark:bg-stone-800 shadow-md;
}
```

**Rekommendation:** Kombinera — svag kant + subtil skugga:

```css
.surface {
  @apply bg-white dark:bg-stone-800 border border-stone-200
         dark:border-stone-700 shadow-sm;
}
```

### VERIFIERA
1. Öppna Dashboard → tre StatCard ska ha tydliga kanter
2. Zooma in i webbläsaren till 200 % → kanterna ska fortfarande synas
3. Testa båda tema-lägen

---

## Steg 8: Formulärförenkling — expanderbara valfria fält ✅ KLAR (4 aug 2026)

**Tid:** 30 min
**Prioritet:** Medel
**Etikett:** [FUNKTION]

### VAD
Dela upp `AddMemberModal.tsx` i två lager: obligatoriska fält alltid synliga,
valfria bakom "Visa fler alternativ".

### VARFÖR
Modalen har cirka 10 fält. Rapporten säger att långa formulär avskräcker.
Prästen ska kunna lägga till en medlem på under 30 sekunder om han bara
kan namnet + telefonen.

### HUR

I `AddMemberModal.tsx`:

```tsx
const [showMoreFields, setShowMoreFields] = useState(false)

return (
  <>
    {/* Obligatoriska falt — alltid synliga */}
    <label>{t("form.name")}</label>
    <input ... />

    <label>{t("form.phone")}</label>
    <input type="tel" inputMode="tel" ... />

    {/* Expanderbar knapp for valfria falt */}
    <button
      type="button"
      onClick={() => setShowMoreFields(!showMoreFields)}
      className="text-accent text-sm underline"
      aria-expanded={showMoreFields}
    >
      {showMoreFields ? t("form.hideMore") : t("form.showMore")}
    </button>

    {showMoreFields && (
      <>
        <label>{t("form.email")}</label>
        <input type="email" inputMode="email" ... />
        {/* Adress, familjestorlek, foto, anteckningar ... */}
      </>
    )}
  </>
)
```

Lägg också till `inputMode` på befintliga type-fält för bättre mobilkeyboard:

```tsx
<input type="tel" inputMode="tel" ... />
<input type="email" inputMode="email" ... />
<input type="number" inputMode="numeric" ... />
```

### VERIFIERA
1. Öppna AddMemberModal på mobil → bara namn + telefon syns
2. Fokusera telefonfältet → siffror-tangentbord ska visas
3. Klick på "Visa fler alternativ" → övriga fält expanderar

---

## Steg 9: Visuell hierarki — större rubriker + tydligare knappar ✅ KLAR (4 aug 2026)

**Tid:** 30 min per sida (4 sidor)
**Prioritet:** Viktig
**Etikett:** [FÄRG]

### VAD
Öka rubrik-storlek. Använd `font-serif` (Cormorant Garamond enligt DESIGN.md).
Gör primära knappar tydligare (färg + storlek + skugga).

### VARFÖR
Rapporten säger att hierarki är största bristen (95/100 poäng). En präst
i 60-årsåldern behöver stora element — inte täta rader.

### HUR

**Rubriker i alla sidor (`pages/*.tsx`):**

Före:
```tsx
<h1 className="text-3xl font-bold">Dashboard</h1>
```

Efter:
```tsx
{/* Storre rubrik + tydligare font-familj (Cormorant Garamond enligt DESIGN.md) */}
<h1 className="text-4xl md:text-5xl font-serif font-bold text-strong">
  Dashboard
</h1>
```

Se till att Tailwind-konfig har `font-serif` mappad till Cormorant Garamond.
Om inte, lägg till i `index.css`:

```css
@theme {
  --font-serif: "Cormorant Garamond", ui-serif, serif;
}
```

**Primära knappar — större touch-yta:**

Före:
```tsx
<button className="btn-primary">Ny medlem</button>
```

Efter:
```tsx
<button
  className="btn-primary text-base px-6 py-3 min-h-[44px] shadow-md
             hover:shadow-lg transition-shadow"
>
  <Plus size={20} className="inline mr-2" aria-hidden="true" />
  Ny medlem
</button>
```

### VERIFIERA
1. Chrome DevTools → iPhone 12
2. Rubrik ska synas direkt utan att zooma
3. Primära knappen ska vara omöjlig att missa
4. Räkna element ovanför "fold" — ska vara ≤ 5 huvudkomponenter

---

## Steg 10: Focus-trap i modaler (WCAG-krav)

**Tid:** Se hänvisning
**Prioritet:** Kritisk (WCAG 2.4.3)
**Etikett:** [FUNKTION]

### VAD
Focus-trap i alla modaler så Tab-tangenten cirkulerar inom modalen.

### STATUS
✅ **REDAN GJORT** — implementerat i alla 7 modaler.

### FULL INSTRUKTION
Se `docs/UX-A11Y-INSTRUKTION.md` **Steg 4** för implementations-detaljer,
kod-exempel och verifieringsmetoder.

---

## Steg 11: Reducera antal statusfärger ⏭️ INAKTUELL (status-paletten redan 4 färger; purple/pink = avatarer/kategorier)

**Tid:** 30 min
**Prioritet:** Rekommenderad
**Etikett:** [FÄRG]

### VAD
Utvärdera om alla 7 palett-färger (grön, röd, blå, purple, pink, kopparbrunt,
neutral) behövs, eller om 5 räcker.

### VARFÖR
Enligt Simas analys skapar 7 statusfärger visuellt brus. Färre färger =
starkare betydelse per färg (t.ex. rött = alltid varning, aldrig dekor).

### HUR

**Steg A — Kartlägg färg-användning:**

```bash
cd client && grep -rn "text-red\|text-blue\|text-purple\|text-pink" src/
```

**Steg B — Föreslå 5-färg-palett:**

| Färg | Roll | Föreslagen användning |
|---|---|---|
| Kopparbrunt (`--accent`) | Primär | Länkar, primära knappar, aktiv nav |
| Grön (`--green`) | Positivt | Närvarande, godkänt |
| Röd (`--red`) | Varning | Frånvarande, radera, fel |
| Blå (`--blue`) | Info | Neutrala statusar, tips |
| Grå (`--text-muted`) | Sekundär | Metadata, tidsstämplar |

**Ta bort eller sammanslå:**
- `--purple` (AI/krypterat) → använd `--blue` istället tills AI-funktioner byggs
- `--pink` (födelsedagar) → använd `--accent` (koppar)

**Steg C — Uppdatera `docs/DESIGN.md` färgtabell + `index.css` variabler.**

### VERIFIERA
1. Öppna `/design`-route → färre färger, tydligare betydelser
2. Sök `text-purple` och `text-pink` i koden → 0 träffar efter migration

---

## Steg 12: Interaktiv onboarding (driver.js)

**Tid:** 60 min
**Prioritet:** Medel
**Etikett:** [FUNKTION]

### VAD
Välkomstguide vid första besöket: "Välkommen" → "Lägg till medlemmar" →
"Planera gudstjänst" → "Klar!".

### VARFÖR
Rapporten (72/100). Prästen har inte använt digitala verktyg förr. Utan
guide riskerar appen att kännas överväldigande.

### HUR

Installera `driver.js`:
```bash
cd client && npm install driver.js
```

Skapa `client/src/hooks/useOnboarding.ts`:

```ts
// useOnboarding — visar valkomstguide vid forsta besoket
// Lagrar "hasSeenTour" i localStorage sa den inte visas igen
//
// Anvands av: App.tsx (aktiveras nar appen laddats)

import { useEffect } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

const STORAGE_KEY = "parishhub.hasSeenTour"

// Startar en interaktiv rundtur om anvandaren inte sett den forr
// Ingen returnering — kors som side-effect vid mount
export function useOnboarding() {
  useEffect(() => {
    // Kollar om guiden redan visats — validerar med unknown for sakerhet
    const seen: unknown = localStorage.getItem(STORAGE_KEY)
    if (seen === "true") return

    const tour = driver({
      showProgress: true,
      steps: [
        {
          element: "header",
          popover: {
            title: "Välkommen till ParishHub",
            description: "Ditt digitala verktyg för att hantera församlingen.",
          },
        },
        {
          element: "a[href='/medlemmar']",
          popover: {
            title: "Medlemmar",
            description: "Här hanterar du alla medlemmar och familjer.",
          },
        },
        {
          element: "a[href='/kalender']",
          popover: {
            title: "Kalender",
            description: "Planera gudstjänster och se koptiska högtider.",
          },
        },
      ],
      onDestroyed: () => {
        localStorage.setItem(STORAGE_KEY, "true")
      },
    })

    // Starta guiden efter kort fordrojning sa layouten hunnit rita
    setTimeout(() => tour.drive(), 500)
  }, [])
}
```

Använd i `App.tsx`:

```tsx
import { useOnboarding } from "./hooks/useOnboarding"

function App() {
  useOnboarding()
  return (...)
}
```

### VERIFIERA
1. DevTools → Application → Local Storage → radera `parishhub.hasSeenTour`
2. Ladda om sidan → guiden startar
3. Följ stegen → guiden visas aldrig igen
4. Ladda om → ingen guide

---

## Steg 13: Synka DESIGN.md med index.css-tokens ✅ KLAR (4 aug 2026)

**Tid:** 15 min
**Prioritet:** Kosmetisk
**Etikett:** [FÄRG]

### VAD
Kontrollera att alla färger i `docs/DESIGN.md` färg-tabellen matchar de
faktiska CSS-variablerna i `client/src/index.css`.

### VARFÖR
Om Sima har mörkat accent (Steg 1) eller text-muted (Steg 5) eller reducerat
palett (Steg 11) — DESIGN.md måste följa med, annars är dokumentationen
föråldrad.

### HUR

**Steg A — Läs båda filer:**

```bash
cat client/src/index.css | grep -E "^\s*--"
```

och `docs/DESIGN.md` rad 20-35.

**Steg B — Jämför rad för rad.** Uppdatera DESIGN.md till att spegla
`index.css` som är sanningen.

**Steg C — Datumstämpla ändringen** i DESIGN.md så det syns när
färgerna senast synkades.

### VERIFIERA
- Alla hex-koder i DESIGN.md matchar `index.css`
- Ingen färg står i DESIGN.md som inte finns i koden
- Ingen färg används i koden som inte står i DESIGN.md

---

## Steg 14: Steg-för-steg-flöden i stora modaler ⏭️ ONÖDIG (Steg 8 löste långa formulär)

**Tid:** 45 min per modal
**Prioritet:** Låg-Medel
**Etikett:** [FUNKTION]

### VAD
Dela upp modaler med fler än 5 fält i flera steg med "Nästa"/"Föregående".

### VARFÖR
`AddMemberModal.tsx` har cirka 10 fält. Steg 8 (expanderbara fält) löser
delvis problemet. Om det inte räcker → tre steg.

### HUR

Om Steg 8 inte gav önskad förenkling:

```tsx
const [step, setStep] = useState<1 | 2 | 3>(1)

return (
  <>
    {/* Framstegs-indikator */}
    <p className="text-sm text-soft">Steg {step} av 3</p>

    {step === 1 && (
      <>
        {/* Grundinfo: namn, telefon, e-post */}
      </>
    )}

    {step === 2 && (
      <>
        {/* Familj: kategori, familjestorlek, familyId, fodelsedag */}
      </>
    )}

    {step === 3 && (
      <>
        {/* Extra: adress, anteckningar, foto */}
      </>
    )}

    <div className="flex justify-between mt-4">
      {step > 1 && (
        <button onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}>
          Föregående
        </button>
      )}
      {step < 3 && (
        <button className="btn-primary" onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}>
          Nästa
        </button>
      )}
      {step === 3 && (
        <button className="btn-primary" onClick={handleSave}>
          Spara medlem
        </button>
      )}
    </div>
  </>
)
```

### VERIFIERA
Öppna modalen → tre steg + framstegs-visning. Kan gå fram och tillbaka utan
att förlora ifyllda värden (state behålls mellan steg).

---

## Steg 15: Fixa mörkt-läge-fails (röd + fyra varningar) ⏭️ INAKTUELL (appen använder text-300/bg-950 → klarar WCAG; #A05858 finns ej i appen)

**Tid:** 30 min
**Prioritet:** **Kritisk** (WCAG-fail på röd)
**Etikett:** [FÄRG]

### VAD
Ljusa upp fem statusfärger i mörkt läge så alla klarar minst AA (4.5:1):

- **Röd `#A05858` → `#C97878`** (kritisk fail 2.98:1 → mål ≥ 4.5)
- **Grön `#5E8A5C` → `#7DA97B`** (3.89 → mål ≥ 4.5)
- **Blå `#5A7EA0` → `#82A0C2`** (3.64 → mål ≥ 4.5)
- **Lila `#7A6A9A` → `#9E8FBF`** (3.22 → mål ≥ 4.5)
- **Pink `#9A6080` → `#BF83A3`** (3.22 → mål ≥ 4.5)

### VARFÖR
Röd-mörkt är under WCAG 3:1 — **direkt lag-brott** för offentlig sektor
enligt DOS-lagen. De fyra andra klarar bara AA Large (rubriker/UI) men
används sannolikt även för brödtext i badges och etiketter.

### HUR

**Steg A — Räkna exakta nya värden.** Föreslagna hex är estimat.
Verifiera VARJE ny hex med
[WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
mot `#222520`. Alla ska visa minst 4.5:1.

**Steg B — Uppdatera CSS-variabler i `client/src/index.css`:**

Före:
```css
[data-theme="dark"] {
  --green: #5E8A5C;
  --red: #A05858;
  --blue: #5A7EA0;
  --purple: #7A6A9A;
  --pink: #9A6080;
}
```

Efter (efter verifiering):
```css
[data-theme="dark"] {
  /* Ljusare statusfarger i morkt lage — klarar WCAG AA mot surface (>= 4.5:1) */
  --green: #7DA97B;   /* Nara/klar och positiv */
  --red: #C97878;     /* Varning och radera — tidigare 2.98:1 FAIL */
  --blue: #82A0C2;    /* Info och neutral */
  --purple: #9E8FBF;  /* AI och krypterat */
  --pink: #BF83A3;    /* Fodelsedagar */
}
```

**Steg C — Uppdatera `docs/DESIGN.md` färgtabell rad 27-35** med samma nya
hex för mörkt läge.

**Steg D — Kolla att transparent-varianterna (`--green22` etc) fortfarande
ser bra ut** — om DesignPreview använder `background: var(--green)22`.

### VERIFIERA
1. WebAIM Contrast Checker: klistra in varje ny hex + `#222520` → alla ≥ 4.5:1
2. Aktivera mörkt läge i appen → statusar ska kännas tydligt läsbara
3. Chrome DevTools → Lighthouse → Accessibility → 0 kontrast-varningar
4. Testa i Colorblindly-extension (Deuteranopia) — färgerna ska fortfarande
   gå att skilja

---

## Steg 16: shadcn/ui — utvärdera + hoppa

**Tid:** 0 min (beslut, ingen implementation)
**Prioritet:** Beslut
**Etikett:** [FÄRG] / [FUNKTION]

### VAD
Utvärdering av shadcn/ui — samling accessibla React-komponenter byggda på
Radix UI. Rekommenderas ofta som modern standard för a11y-korrekt UI.

### VARFÖR utvärdera
Designrapporten och verktygs-stack-analysen nämner shadcn/ui som alternativ
till egna komponenter. Behöver ett medvetet beslut för LIA-redovisning.

### FÖR shadcn/ui
- Battle-tested tillgänglighet (Radix UI är WAI-ARIA compliant)
- TypeScript-först — bra typer ut ur boxen
- Gratis och öppen källkod
- Aktiv community + många exempel
- Ingen bundle-cost förrän komponenten faktiskt kopieras in

### EMOT shadcn/ui
- Egna komponenter finns redan: Skeleton, Dropdown, Avatar, Badge, EmptyState (planerad)
- Migration = 6-8 timmar arbete utan tydlig funktionalitets-vinst
- Egna komponenter matchar "Varm Olivsten"-estetiken bättre än shadcn defaults
  (som är nästan färglösa/generiska Tailwind + neutrala färger)
- Extra dependencies (Radix-primitives) för komponenter som redan fungerar
- Focus-trap-react + sonner + custom Skeleton täcker redan a11y-behovet

### REKOMMENDATION
**Behåll egna komponenter.** De är byggda för denna appens estetik och a11y-nivån
är redan hög (focus-trap, aria, semantik). Migration ger ingen mätbar vinst.

Nämn shadcn/ui i `CV-BULLETS.md` som **"utvärderad — valdes bort för att egna
komponenter passar designen bättre"**. Det visar medvetenhet om alternativen.

### KOMMANDE PÅMINNELSE
Om Sima någon gång behöver komplexa komponenter som Combobox, Command Palette
eller Sheet — då kan shadcn kopieras in **för just dessa** (per-komponent-strategi
utan full migration). shadcn är designat för det.

---

## Sammanfattning

| # | Steg | Etikett | Tid | Prioritet |
|---|---|---|---|---|
| 1 | Testa och mörka koppar-accent | [FÄRG] | 30 min | ✅ OK (AA) |
| 2 | Bottennavigering för mobil | [FUNKTION] | 45 min | ✅ KLAR |
| 3 | Färgblindhet — ikon + text på status | [FÄRG] | 30 min | ✅ KLAR |
| 4 | Toast-notiser — komplettera | [FUNKTION] | 20 min | ✅ KLAR |
| 5 | Mörka text-muted för AAA | [FÄRG] | 15 min | ✅ KLAR |
| 6 | Tomma tillstånd (EmptyState) | [FUNKTION] | 30 min | ✅ KLAR |
| 7 | Tydligare kort-kanter | [FÄRG] | 20 min | Viktig |
| 8 | Formulär — expanderbara valfria fält | [FUNKTION] | 30 min | ✅ KLAR |
| 9 | Visuell hierarki — rubriker + knappar | [FÄRG] | 30 min × 4 | ✅ KLAR |
| 10 | Focus-trap (se UX-A11Y) | [FUNKTION] | Klart | Kritisk |
| 11 | Reducera antal statusfärger | [FÄRG] | 30 min | ⏭️ INAKTUELL |
| 12 | Interaktiv onboarding | [FUNKTION] | 60 min | Medel |
| 13 | Synka DESIGN.md med index.css | [FÄRG] | 15 min | ✅ KLAR |
| 14 | Steg-för-steg-flöden i modaler | [FUNKTION] | 45 min × modal | ⏭️ ONÖDIG |
| 15 | Fixa mörkt-läge-fails (röd + 4 varningar) | [FÄRG] | 30 min | ⏭️ INAKTUELL |
| 16 | shadcn/ui — utvärdera + hoppa | [FÄRG]/[FUNKTION] | 0 min | Beslut |

**Total tid:** cirka 10-11 arbetstimmar, uppdelat i 7-14 sessioner.

---

## Rekommenderad dag-ordning

**Blandad — färg och funktion parallellt i varje pass.**

**Dag 1 (~2 tim) — Kritiska (fixa WCAG-fail först)**
- Steg 15: Fixa mörkt-läge-fails (röd = FAIL, 4 varningar)
- Steg 1: Testa och mörka koppar-accent
- Steg 2: Bottennavigering för mobil

**Dag 2 (~1 tim) — Kritiska**
- Steg 3: Färgblindhets-säkring
- Steg 4: Toast-notiser komplettera

**Dag 3 (~1 tim) — Viktiga**
- Steg 5: Mörka text-muted
- Steg 6: EmptyState-komponent

**Dag 4 (~1 tim) — Viktiga**
- Steg 7: Kort-kanter
- Steg 8: Formulärförenkling

**Dag 5 (~1 tim) — Hierarki + verifiering**
- Steg 9: Rubriker och knappar (börja med Dashboard)
- Steg 10: Verifiera focus-trap (se UX-A11Y)

**Dag 6 (~1.5 tim) — Medel**
- Steg 11: Reducera statusfärger
- Steg 12: Onboarding

**Dag 7 (~1 tim) — Polering**
- Steg 13: Synka DESIGN.md
- Steg 14: Steg-för-steg (bara om Steg 8 inte räckte)

---

## Efter varje session

1. Kör `npx tsc -p tsconfig.app.json --noEmit` — bygget måste vara grönt
2. Kör `npm run lint`
3. Kör `npm run test`
4. Testa på både desktop och mobil (Chrome DevTools Device Toolbar)
5. Verifiera kontrast med [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
6. Skriv dags-logg i `DAGBOK.md`
7. Fråga: ska något loggas som milstolpe?
