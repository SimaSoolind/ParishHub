# 📘 Redovisning — Dashboard i ParishHub

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
- **React** — populäraste UI-biblioteket, deklarativ komponent-baserad
- **Vite** — snabbaste utvecklingsserver, direkt HMR (Hot Module Reload)
- **TypeScript** — säkrare kod med typkontroll innan appen körs
- **Tailwind CSS v4** — snabb styling med utility-klasser direkt i JSX
- **React Router v7** — navigation mellan sidor utan sidladdning
- **Lucide React** — professionella SVG-ikoner (ersätter emojis)

### Varför denna stack?
- **React + Vite + TypeScript** = branschstandard 2026 
- **Tailwind** = snabbare än att skriva egen CSS, konsekvent design
- **TypeScript** = fångar fel innan användaren ser dem

### Backend (kommande vecka 3-4)
- Node.js + Express + TypeScript
- PostgreSQL via Prisma ORM
- JWT + bcrypt för säker inloggning
- Deepgram Nova-2 för live speech-to-text
- DeepL för arabisk→svensk översättning

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
Använder en `statusMap`-tabell utanför komponenten som mappar `ContactStatus` (not-contacted, attempted, answered) till badge-text och färg. Detta håller JSX rent (bara visning, ingen logik).

Återanvänder Badge-komponenten för färgade etiketter (DRY).

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
  - `statusMap` räknar ut badge-info utanför JSX

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
- ✅ **Tillgänglighet (a11y)** — aria-label på interaktiva element
- ✅ **Semantisk HTML** — `<ul>`, `<li>`, `<h2>` istället för bara `<div>`
- ✅ **Ingen inline data** — telefonnummer i data-fil, inte i komponent

---

## 11. Nästa steg

### Kort sikt (denna vecka)
- Bygga Medlemmar-sidan (`/medlemmar`)
- Bygga Kalender-sidan (`/kalender`)
- Sätta upp i18next för arabiska-stöd

### Medium sikt (v.3-4)
- Backend med Express + REST API
- Byta ut mockdata mot riktiga API-anrop

### Lång sikt (v.5-8)
- PostgreSQL + Prisma
- JWT-inloggning för prästen
- Deepgram + WebSocket för AI-tolkning live

### Publiceringsfas
- Deploya frontend till Vercel
- Deploya backend till Railway
- Testa i riktig gudstjänst
- Konvertera till React Native för mobilappen

---

## 📊 Sammanfattning

Denna Dashboard är ett komplett **frontend-fundament** för Kyrko-appen. Den följer alla moderna React-standarder:

- Komponent-baserad arkitektur
- TypeScript för säkerhet
- Custom hooks för logik-separation
- Återanvändbara komponenter för DRY
- Mockdata som enkelt byts mot API-anrop
- Tillgänglighet inbyggd från start
- Kommentarer och regler som gör koden läsbar om 6 månader

**Detta är arbetsklar kod som följer branschstandard 2026.**

---

*Byggd av Sima Soolind som del av examensprojekt på Företagsuniversitetet — Fullstack-utvecklare med säkerhetsinriktning.*