# 📘 Redovisning — Frontend i ParishHub

**Projekt:** ParishHub (Kyrko-appen)
**Byggd av:** Sima Soolind
**Datum:** Juli 2026
**Del av:** Examensprojekt — Fullstack-utvecklare med säkerhetsinriktning

---

## 📖 Innehållsförteckning

1. [Om projektet](#1-om-projektet)
2. [Teknisk stack](#2-teknisk-stack)
3. [Projektstruktur](#3-projektstruktur)
4. [Hur allt hänger ihop](#4-hur-allt-hänger-ihop)
5. [Sidor](#5-sidor)
6. [Komponenter](#6-komponenter)
7. [Custom hooks](#7-custom-hooks)
8. [TypeScript-typer](#8-typescript-typer)
9. [Mockdata](#9-mockdata)
10. [Kodregler som följs](#10-kodregler-som-följs)
11. [Nästa steg](#11-nästa-steg)

---

## 1. Om projektet

### Vad är ParishHub?
Ett digitalt system för kyrkoförvaltning som hjälper en präst att hantera sin församling.

### Syfte
Ersätta pappersanteckningar och Excel-listor med en modern, säker webbapp.
Inkluderar AI-tolkning live på svenska och arabiska under gudstjänsten.

### Målgrupp
- Prästen (huvudanvändare) — hanterar medlemmar och gudstjänster
- Församlingen — får tillgänglighet via AI-tolkning i realtid

---

## 2. Teknisk stack

### Frontend

| Teknik | Varför |
|--------|--------|
| **React** | Valdes framför Angular (för tungt för detta projekt) och Vue (mindre efterfrågan på arbetsmarknaden). Deklarativt och komponent-baserat. |
| **Vite** | Snabbaste utvecklingsservern med direkt HMR (Hot Module Reload). Valdes framför CRA (nedlagd) och Next.js (för tungt för en enkel SPA till en början). |
| **TypeScript** | Valdes framför JavaScript för att fånga typfel vid byggtid istället för vid körning. Färre runtime-fel i produktion. |
| **Tailwind CSS v4** | Utility-klasser direkt i JSX. Snabbare än egen CSS, konsekvent design. |
| **React Router v7** | Standard för routing i React. Hanterar navigation utan sidladdning. |
| **Lucide React** | Professionella SVG-ikoner. Valdes framför Font Awesome (tyngre) och emojis (inkonsekvent utseende). |

### Backend (kommande)
- **Node.js + Express + TypeScript** — REST API
- **PostgreSQL via Prisma ORM** — relationsdatabas
- **JWT + bcrypt** — säker inloggning
- **Speechmatics** — live speech-to-text
- **DeepL** — arabisk→svensk översättning

### Varför Speechmatics + DeepL?
Speechmatics är specialiserat på taligenkänning (speech-to-text). DeepL används för
själva översättningen från arabiska till svenska. Båda tjänsterna har hög precision
och stödjer de språk som behövs.

### Hosting
- Frontend: Vercel
- Backend + Databas: Railway

---

## 3. Projektstruktur

Monorepo-struktur — frontend och backend i samma repo:

```
ParishHub/
├── client/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Återanvändbara UI-komponenter
│   │   │   ├── Layout.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── BirthdayList.tsx
│   │   │   ├── PriorityList.tsx
│   │   │   └── Badge.tsx
│   │   ├── pages/           # Sidor (en per route)
│   │   │   └── Dashboard.tsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useDateTime.ts
│   │   ├── types/           # TypeScript-typer
│   │   │   ├── birthday.ts
│   │   │   └── contact.ts
│   │   ├── data/            # Mockdata (temporär)
│   │   │   ├── birthdays.mock.ts
│   │   │   └── contacts.mock.ts
│   │   ├── App.tsx          # Root-komponent med routing
│   │   └── main.tsx         # Startpunkt
│   └── package.json
│
├── server/                  # Backend (kommer nästa vecka)
├── docs/                    # Dokumentation
├── CLAUDE.md                # Projektregler
├── DAGBOK.md                # Daglig utvecklingslogg
└── README.md
```

### Varför denna struktur?
- **components/** = små återanvändbara delar (DRY)
- **pages/** = hela sidor (en per URL)
- **hooks/** = logik separerad från JSX (rena komponenter)
- **types/** = alla TypeScript-typer på ett ställe
- **data/** = tillfällig mockdata som byts mot API-anrop senare

---

## 4. Hur allt hänger ihop

### Flöde när användaren öppnar appen

```
1. Användaren öppnar http://localhost:5173
        ↓
2. main.tsx laddar App-komponenten
        ↓
3. App.tsx bestämmer route baserat på URL
        ↓
4. Route "/" → Layout omsluter Dashboard
        ↓
5. Layout renderar header + nav
        ↓
6. Dashboard renderar innehåll via <Outlet />
        ↓
7. Dashboard använder useDateTime-hooken för datum + hälsning
        ↓
8. Dashboard hämtar mockdata från data/-mappen
        ↓
9. Dashboard skickar data som props till StatCard, BirthdayList, PriorityList
        ↓
10. Varje komponent renderar sitt innehåll
        ↓
11. Färdig sida visas för användaren
```

### Datalöpe idag (mockdata)
```
data/birthdays.mock.ts → Dashboard → BirthdayList → visar personer
data/contacts.mock.ts  → Dashboard → PriorityList → visar personer
```

### Dataflöde senare (med backend)
```
PostgreSQL → API-anrop → React Query → Dashboard → komponenter
```

---

## 5. Sidor

### Dashboard (/)

**Fil:** `src/pages/Dashboard.tsx`

#### Vad
Startsidan som prästen ser när hen loggar in.

#### Varför
En central plats där prästen ser dagens viktigaste information direkt — statistik, födelsedagar, prioriterade kontakter.

#### Hur
Sidan använder tre återanvändbara komponenter (StatCard, BirthdayList, PriorityList) och hämtar dynamiskt datum + hälsning från en custom hook.

#### Innehåll
1. **Rubrik** — dynamisk hälsning ("God morgon", "God dag", "God kväll") + prästens namn (Fader Korollos)
2. **Datum** — aktuellt datum på svenska
3. **Tre statistikkort** — Medlemmar, Närvarande idag, Att kontakta
4. **Födelsedagslista** — personer som fyller år denna vecka med ring-knapp
5. **Prioriterad kontaktlista** — personer prästen bör ringa med statusetikett

---

### Kalender (/kalender)

**Fil:** `src/pages/Calendar.tsx`

**Vad:** En kalender där prästen ser och planerar kyrkliga händelser (gudstjänster, dop, bröllop) och koptiska högtider.

**Varför:** Prästen behöver en överblick över kommande händelser och kunna lägga till, ändra och ta bort dem. Koptiska högtider visas automatiskt så inget missas.

**Hur:** Bygger på biblioteket react-big-calendar. Kalendern är en *controlled component* — vy (månad/vecka/dag) och datum styrs av `useState`. Egna händelser ligger i state; koptiska högtider hämtas från ett externt API och blandas in vid visning.

**Innehåll och funktioner:**
1. **Full CRUD** — skapa, läsa, ändra och radera händelser
   - Skapa: knappen "Ny händelse" öppnar ett formulär (AddEventModal)
   - Läsa: klick på en händelse visar detaljer (EventModal)
   - Ändra/Radera: knappar i detalj-modalen
2. **Egen verktygsrad** (CalendarToolbar) med pil-knappar och vy-växlare
3. **Klick på en dag** byter till dag-vyn för det datumet
4. **Koptiska högtider** hämtas live från coptic.io och visas i kopparfärg — skrivskyddade (kan inte ändras eller raderas)

**Teknik värd att lyfta fram:**
- **Zod-validering** i formuläret (titel och datum krävs innan sparning)
- **react-query** cachar API-anropet (hooken useCopticCelebrations)
- **Immutable state-uppdatering:** `setEvents(prev => [...prev, nytt])`
- **API-anrop samlade** i `src/api/copticApi.ts` med `try/catch`

---

### Medlemmar (/medlemmar)

**Fil:** `src/pages/Members.tsx`

**Vad:** Ett sökbart medlemsregister med filter per kategori.

**Varför:** Prästen behöver snabbt hitta en medlem och kunna ringa eller mejla direkt.

**Hur:** All sök- och filter-logik ligger i hooken `useMemberSearch` — sidan visar bara resultatet. Varje medlem ritas med komponenten MemberCard.

**Innehåll:**
1. **Sökfält** — filtrerar på namn medan man skriver
2. **Filter-knappar** — Alla / Vuxen / Ungdom / Ledare / Övrig
3. **Lista** med MemberCard (namn, adress, familjestorlek, födelsedag, ring/mejla) — hela raden är klickbar
4. **Full CRUD** — skapa (AddMemberModal med Zod-validering), läsa (profil-modal), redigera och radera (med bekräftelse)
5. **Tom-läge** — "Inga medlemmar hittades" om inget matchar

---

### Gudstjänster (/gudstjanster)

**Fil:** `src/pages/Services.tsx`

**Vad:** Lista över gudstjänster, grupperad i Kommande och Tidigare, med närvaro-avprickning.

**Varför:** Prästen planerar gudstjänster och bockar av vilka medlemmar som var med.

**Hur:** Gudstjänster ligger i state (skapas via AddServiceModal med Zod-validering). Klick på en rad öppnar AttendanceModal där närvaron prickas av. Status-badgen räknar närvarande direkt från state.

**Innehåll:**
1. **Namn-förslag** vid ny gudstjänst (Huvudgudstjänst, Gudstjänst m.fl.) + eget namn (Fasta, Jul)
2. **Start- och sluttid** (sluttid valfri), datum-box för snabb skanning
3. **Gruppering** Kommande / Tidigare
4. **Status-badge** — grön "Avprickad (X närvarande)" eller gul "Ej avprickad"
5. **Närvaro** (AttendanceModal) med spårbarhet (`markedAt`)

---

## 6. Komponenter

### 6.1 Layout

**Fil:** `src/components/Layout.tsx`

#### Vad
Gemensam ram som visas på ALLA sidor. Innehåller header, navigation och ett `<Outlet />` där den aktuella sidan sätts in.

#### Varför
DRY-principen — header/nav skrivs EN gång och återanvänds automatiskt. Ändras på ett ställe → uppdateras överallt.

#### Hur
Använder React Routers `<Outlet />` som platshållare där aktuell sida renderas beroende på URL.

#### Innehåll
- Vit header med logo "✝ ParishHub"
- Nav-länkar: Dashboard | Medlemmar | Kalender
- `<Outlet />` för dynamiskt innehåll

---

### 6.2 StatCard

**Fil:** `src/components/StatCard.tsx`

#### Vad
Ett färgat kort som visar en siffra med etikett och ikon.

#### Varför
Används tre gånger på Dashboard med olika data. Utan komponent = 3 kopior av samma kod. Med komponent = skriv EN gång, återanvänd.

#### Hur
Tar emot fyra props:
- `label` (text under siffran)
- `value` (själva siffran)
- `color` (blue, green eller red — begränsat via TypeScript)
- `Icon` (ikon-komponent från lucide-react)

En färg-mappning utanför komponenten kopplar färgnamn till Tailwind-klasser (DRY).

#### Exempel-användning
```tsx
<StatCard label="Medlemmar" value={47} color="blue" Icon={Users} />
```

---

### 6.3 Badge

**Fil:** `src/components/Badge.tsx`

#### Vad
En liten färgad etikett med text.

#### Varför
Används på många ställen i appen för att visa status (närvarande, frånvarande, GDPR-samtycke, kontaktstatus). En central komponent för konsekvent design.

#### Hur
Tar emot två props:
- `color` (red, blue, green, amber)
- `children` (texten som visas)

Färg-mappning håller alla varianter samlade på ett ställe.

#### Exempel-användning
```tsx
<Badge color="red">Ej kontaktad</Badge>
```

---

### 6.4 BirthdayList

**Fil:** `src/components/BirthdayList.tsx`

#### Vad
Ett kort som visar personer som fyller år denna vecka, med en ring-knapp per person.

#### Varför
Prästen vill snabbt se vem han bör gratulera OCH kunna ringa direkt utan att leta upp telefonnummer.

#### Hur
Tar emot en array av `Birthday`-objekt som prop. Går igenom listan med `.map()` och renderar en rad per person.

Ring-knappen är en `<a href="tel:0701234567">` som öppnar telefonens uppringningsapp på mobilen.

Har fallback-hantering: om listan är tom → visar "Ingen fyller år denna vecka".

Använder `aria-label` för skärmläsare (tillgänglighet).

---

### 6.5 PriorityList

**Fil:** `src/components/PriorityList.tsx`

#### Vad
Ett kort som visar personer prästen bör kontakta, med statusetikett och ring-knapp.

#### Varför
Prästen kan inte komma ihåg alla som saknats i gudstjänsten. Listan hjälper honom prioritera vem han ska ringa först och se om han redan försökt.

#### Hur
Använder en `statusInfo`-tabell utanför komponenten som mappar `ContactStatus` (not-contacted, attempted, answered) till badge-text och färg. Detta håller JSX rent (bara visning, ingen logik).

Återanvänder Badge-komponenten för färgade etiketter (DRY).

---

### 6.6 MemberCard

**Fil:** `src/components/MemberCard.tsx`

**Vad:** En rad för en medlem med ring- och mejla-knappar.

**Varför:** Återanvändbar rad som Medlemmar-sidan renderar en gång per medlem.

**Hur:** Tar emot ett `Member`-objekt. Ring-knapp (`tel:`) och mejla-knapp (`mailto:`), båda med `aria-label` för skärmläsare.

---

### 6.7 EventModal

**Fil:** `src/components/EventModal.tsx`

**Vad:** Detalj-popup för en kalenderhändelse (titel, datum, kategori, anteckningar).

**Varför:** Prästen klickar på en händelse för att se detaljer och kunna redigera eller radera.

**Hur:** Skrivskyddade händelser (koptiska högtider) döljer Redigera/Radera och visar istället "Från den koptiska kyrkokalendern".

---

### 6.8 AddEventModal

**Fil:** `src/components/AddEventModal.tsx`

**Vad:** Formulär för att skapa eller ändra en händelse.

**Varför:** Samma formulär används för både nytt och redigering (förifylls via `initialData`) — DRY.

**Hur:** Validerar med **Zod** innan sparning. Visar felmeddelanden under fälten om titel eller datum saknas.

---

### 6.9 CalendarToolbar

**Fil:** `src/components/CalendarToolbar.tsx`

**Vad:** Egen verktygsrad för kalendern med pil-knappar och vy-växlare.

**Varför:** react-big-calendars standard är otydliga text-knappar. En egen verktygsrad ger tydliga pilar (‹ ›) och en aktiv-markerad vy.

**Hur:** Kopplas in via kalenderns `components`-prop och anropar `onNavigate` / `onView`.

---

## 7. Custom hooks

### useDateTime

**Fil:** `src/hooks/useDateTime.ts`

#### Vad
En custom React hook som returnerar aktuellt datum och rätt hälsning baserat på tid.

#### Varför
Följer kodregeln: "Logik i hooks, JSX bara för visning."
Utan hook = Dashboard-komponenten blandar datum-beräkning med JSX = svårt att läsa.
Med hook = Dashboard skriver bara `const { date, greeting } = useDateTime()`.

#### Hur
Skapar ett `Date`-objekt med aktuell tid. Räknar ut hälsning baserat på timme:
- 05-11 → "God morgon"
- 11-17 → "God dag"
- 17-05 → "God kväll"

Formaterar datum på svenska med `toLocaleDateString("sv-SE", ...)`.

#### Returnerar
```ts
{
  date: string      // "Söndag 27 juli 2026"
  greeting: string  // "God morgon" / "God dag" / "God kväll"
}
```

---

### useMemberSearch

**Fil:** `src/hooks/useMemberSearch.ts`

**Vad:** Håller sök-text och kategori-filter i state och returnerar den filtrerade medlemslistan.

**Varför:** Håller Medlemmar-sidan ren — logik skild från JSX (kodregeln "logik i hooks").

**Hur:** Använder `useMemo` så listan bara räknas om när sök-text, filter eller data ändras.

---

### useCopticCelebrations

**Fil:** `src/hooks/useCopticCelebrations.ts`

**Vad:** Hämtar koptiska högtider från coptic.io och gör om dem till kalender-händelser.

**Varför:** Visar en riktig kyrkokalender utan att prästen matar in högtiderna manuellt.

**Hur:** Använder **react-query** (`useQuery`) för hämtning och cachning. Filtrerar bort fastor. Själva API-anropet ligger i `src/api/copticApi.ts` med `try/catch`.

---

## 8. TypeScript-typer

### 8.1 Birthday

**Fil:** `src/types/birthday.ts`

#### Vad
Definierar vad ett Birthday-objekt innehåller.

#### Varför
TypeScript varnar direkt om något fält saknas eller har fel typ — fångar fel innan appen körs.

#### Innehåll
```ts
type Birthday = {
  id: string
  name: string
  age: number
  when: string
  phone: string
}
```

---

### 8.2 Contact + ContactStatus

**Fil:** `src/types/contact.ts`

#### Vad
Definierar vad en Contact är, och vilka status-värden som är tillåtna.

#### Varför
`ContactStatus` är en **union type** — bara tre värden tillåtna. Ingen kan råka skriva "kontaktad2" utan att TypeScript varnar direkt.

#### Innehåll
```ts
type ContactStatus = "not-contacted" | "attempted" | "answered"

type Contact = {
  id: string
  name: string
  reason: string
  status: ContactStatus
  phone: string
}
```

---

## 9. Mockdata

### Varför använda mockdata?
Backend är inte klar än (byggs vecka 3-8). Utan mockdata skulle Dashboard vara tom och omöjlig att bygga.

### Fördelar
- **UI kan byggas parallellt med backend**
- **Snabbt att testa olika scenarier** (många personer, tom lista, fel status)
- **Ingen risk att förstöra riktig data** under utveckling

### Fil-struktur
```
data/
├── birthdays.mock.ts   # 2 personer som fyller år
└── contacts.mock.ts    # 2 personer att kontakta
```

### Byte till riktig data (vecka 5-6)
När PostgreSQL + Prisma är klara → ersätts mockdata med API-anrop:

**Nu:**
```tsx
import { mockBirthdays } from "../data/birthdays.mock"
<BirthdayList birthdays={mockBirthdays} />
```

**Senare:**
```tsx
const { data: birthdays } = useQuery(["birthdays"], fetchBirthdays)
<BirthdayList birthdays={birthdays} />
```

Komponenten `BirthdayList` **ändras inte alls** — den bryr sig inte om varifrån datan kommer. Detta är kraftfullt.

---

## 10. Kodregler som följs

### Från CLAUDE.md
- ✅ **TypeScript överallt** — inga .js-filer
- ✅ **Variabler och funktioner på engelska** — internationell standard
- ✅ **Kommentarer på svenska** — studentspråk, objektivt
- ✅ **UI-text på svenska** — appen är för svensktalande prästen
- ✅ **PascalCase** för komponenter (StatCard, BirthdayList)
- ✅ **camelCase** för hooks med "use"-prefix (useDateTime)
- ✅ **Funktionella komponenter** — moderna React (inga class components)

### Från kodstandarden
- ✅ **DRY-principen** — ingen kod-upprepning
  - `colorClasses` utanför komponenten
  - Badge-komponent återanvänds i PriorityList
  - Layout skrivs en gång, används på alla sidor

- ✅ **Logik separerad från JSX**
  - `useDateTime` sköter datum-logik
  - `statusInfo` räknar ut badge-info utanför JSX

- ✅ **Objektiva kommentarer**
  - "Hämtar en medlem från databasen" (RÄTT)
  - "Vi hämtar en medlem från databasen" (FEL)

- ✅ **Inga dekorativa tecken**
  - Rena `//`-kommentarer
  - Inga `═══` eller `★★★`

- ✅ **Ingen AI-syntax**
  - Korta, tydliga variabelnamn (inte `theMemberBeingViewed`)
  - Kommentarer bara där de tillför värde

### Från säkerhetsutbildningen
- ✅ **Tillgänglighet (a11y)** — `aria-label` på ikon-knappar. Klickbara rader
  (Medlemmar, Gudstjänster) är tangentbords-nåbara (`role="button"`, `tabIndex`,
  Enter/Space) med synlig fokus-markering.
- ✅ **Semantisk HTML** — listor byggs med `<ul>`/`<li>`, rubriker med `<h1>`/`<h2>`
  och knappar med `<button>`.
- ✅ **Ingen inline data** — riktiga telefonnummer ligger i data-filer
  (`data/*.mock.ts`), inte hårdkodade i komponenterna

### Säkerhet, felhantering och tester

Appen följer projektets säkerhetsregler (se CLAUDE.md och docs/SECURITY.md):

- **Runtime-validering** — all data utifrån valideras med Zod (formulär + API-svar), inte bara TypeScript-typer
- **safeFetch** (`lib/api.ts`) — samlar nätverksanrop + felhantering + validering på ett ställe
- **Central felhantering** (`lib/errorHandler.ts`) — loggar internt, visar aldrig stack traces för användaren
- **ErrorBoundary** runt hela appen — ett kraschat kort sänker inte resten
- **Tillgänglighet** — klickbara rader är tangentbords-nåbara, listor är semantiska (`<ul>`/`<li>`)
- **Enhetstest** (Vitest) — verifierar att fel inte läcker interna detaljer
- **CI** (`.github/workflows/ci.yml`) — kör typkontroll, lint (inkl. eslint-plugin-security), tester och npm audit vid varje push

---

## 11. Nästa steg

### Klart
- ✅ Medlemmar (`/medlemmar`) — full CRUD, profil-modal, adress, Zod-validering
- ✅ Kalender (`/kalender`) — CRUD + koptiska högtider (runtime-validerade)
- ✅ Gudstjänster (`/gudstjanster`) — skapa, gruppering, närvaro-avprickning
- ✅ Tillgänglighet (tangentbord + semantik), ErrorBoundary, enhetstest, CI

### Kort sikt
- Synka kalendern med Google Calendar
- Sätta upp i18next för svenska/arabiska (med RTL)
- Bryta ut formulär-logiken till en hook (useEventForm)

### Medium sikt (v.3-4)
- Backend med Express + REST API
- Byta ut mockdata mot riktiga API-anrop

### Lång sikt (v.5-8)
- PostgreSQL + Prisma
- JWT-inloggning för prästen
- Speechmatics + WebSocket för AI-tolkning live
- WhatsApp Business API via backend — äkta grupputskick (skicka till alla valda på en gång, automatiskt)

### Publiceringsfas
- Deploya frontend till Vercel
- Deploya backend till Railway
- Testa i riktig gudstjänst
- Konvertera till React Native för mobilappen

---

## 📊 Sammanfattning

Dashboarden är ett frontend-fundament för ParishHub som följer moderna React-standarder:

| Princip | Hur det syns i koden |
|---------|---------------------|
| Komponentbaserad arkitektur | StatCard, Badge, BirthdayList, PriorityList |
| TypeScript-säkerhet | Union types (ContactStatus), strikta typer |
| Logikseparation | useDateTime-hook, statusInfo utanför JSX |
| DRY | Återanvändbara komponenter, ingen kodduplicering |
| Mockdata → API | Data i separata filer, komponenter oberoende av källa |
| Tillgänglighet | aria-label, semantisk HTML inbyggt från start |
| Läsbar kod | Kommentarer på svenska, korta variabelnamn, DRY |

**Detta är arbetsklar kod som följer branschstandard 2026.**

---

*Byggd av Sima Soolind som del av examensprojekt på Företagsuniversitetet — Fullstack-utvecklare med säkerhetsinriktning.*