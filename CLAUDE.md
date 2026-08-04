# ParishHub

Digitalt system för kyrkoförvaltning. Byggs som examensprojekt av Sima Soolind.

## 📖 Om projektet
Full-stack applikation som hjälper en präst att hantera sin församling.
Innehåller medlemsregister, gudstjänstplanering, närvaro, predikanarkiv och
AI-tolkning live på svenska + arabiska.

## 🗂 Monorepo-struktur
- `client/` — Frontend (React + Vite + TypeScript)
- `server/` — Backend (Node.js + Express + TypeScript)
- `docs/` — Dokumentation för hela projektet
- `.claude/` — Claude-inställningar

## 🛠 Teknisk stack

### Frontend (client/)
- React + Vite + TypeScript
- React Router — navigation
- Tailwind CSS eller styled — styling
- react-i18next — svenska + arabiska
- @tanstack/react-query — API-caching

### Backend (server/)
- Node.js + Express + TypeScript
- PostgreSQL via Prisma ORM
- JWT + bcrypt — säker inloggning
- Speechmatics — live speech-to-text
- DeepL — arabisk→svensk översättning (AI-tolkning live)

### Hosting
- Frontend: Vercel
- Backend + Databas: Railway

## 📐 Kodregler
- **Variabler, funktioner, filer, klasser: ENGELSKA** (inga svenska tecken å/ä/ö)
- **Kommentarer: SVENSKA** (objektivt språk, studentspråk inklusive svenska tecken å/ä/ö)
- **UI-text som visas för användaren: SVENSKA**
- Skriv ALL kod i TypeScript — inga .js eller .jsx
- Använd `import`/`export` — inte `require`
- Funktionella komponenter i React — aldrig class components
  (enda undantaget: ErrorBoundary, som React kräver som class)
- PascalCase för komponenter och typer (MemberList.tsx, Member)
- camelCase för filer, funktioner och variabler (memberService.ts, getMembers)
## 🧼 Ren kod — läsbarhet
- Kod ska vara **lätt att läsa** — även för en nybörjare
- **Ingen kod-upprepning (DRY)** — samma logik ska bara finnas på ETT ställe
- Om samma kod skrivs 2 gånger → bryt ut till en funktion
- Om samma UI upprepas → bryt ut till en komponent
- Korta funktioner (max ~30 rader) — om längre, dela upp
- Meningsfulla variabelnamn på engelska — inte "data", "temp", "x"

## ⚛️ React — separera logik från JSX
- **Logik** (state, useEffect, API-anrop) hör hemma i **custom hooks**
- **JSX** (return-blocket) ska bara visa data — inte beräkna
- Om en komponent har mer än ~5 rader logik → flytta till en hook

### RÄTT
function MemberList() {
  const { members, loading, error } = useMembers();  // logik i hook

  if (loading) return <p>Laddar...</p>;
  return <ul>{members.map(m => <li key={m.id}>{m.name}</li>)}</ul>;
}

### FEL
function MemberList() {
  const [members, setMembers] = useState([]);
  useEffect(() => { fetch(...).then(...).catch(...) }, []);
  const filtered = members.filter(...).map(...).sort(...);
  return <ul>{filtered.map(m => <li>{m.name}</li>)}</ul>;
}

## ✍️ Kommentarsstil — inga konstiga tecken
- Skriv ren kommentar med `//` eller `/** */`
- **INGA** dekorativa tecken runt kommentarer
- **INGA** AI-tecken eller emoji-ramar i kommentarer

### RÄTT
// Hämtar alla medlemmar från databasen
/**
 * Beräknar närvaro-procent för en specifik gudstjänst.
 * @param serviceId - ID för gudstjänsten
 * @returns Närvaro i procent (0-100)
 */

### FEL
// ═══════════════════════════════════════
// 🌟✨ HÄMTA MEDLEMMAR ✨🌟
// ═══════════════════════════════════════

// ★★★★★ VIKTIG FUNKTION ★★★★★

// ──────────────────────────
// | Beräkna närvaro         |
// ──────────────────────────

## 🤖 Ingen AI-syntax
- Inga onödigt långa variabelnamn ("theMemberThatIsCurrentlyBeingViewed")
- Ingen dubbel-kommentering (samma sak sagd två gånger)
- Kod ska se ut som att en **människa** skrev den

### FEL (AI-syntax)
// Denna funktion tar emot ett id och returnerar en medlem
// baserat på id:t som skickas in som argument
// Om ingen medlem hittas returneras null istället
function getMemberByIdFromDatabase(idOfMemberToRetrieve: string) {
  // Vi använder findById för att söka på id
  // findById är en metod på MemberModel
  return MemberModel.findById(idOfMemberToRetrieve);
}

### RÄTT (mänsklig kod)
// Hämtar en medlem med hjälp av ID
function getMemberById(id: string) {
  return MemberModel.findById(id);
}

## 💬 Kommentarsregler (VIKTIGT för långsiktighet)
- Skriv ALLA kommentarer på **lätt svenska** och **studentspråk**
- Använd **objektivt språk** — undvik "du", "vi", "man", "jag"
- Skriv som en lärobok: neutralt, tydligt, kort
- Varje funktion ska ha en kommentar som beskriver:
  1. Vad funktionen gör (i en mening)
  2. Vilka argument den tar
  3. Vad den returnerar
  4. När den kan användas igen (återanvändning)
  5. Varför den är bra (fördelen)

### RÄTT och FEL

❌ FEL:
// Vi hämtar en medlem från databasen
// Du kan använda denna i frontend

✅ RÄTT:
// Hämtar en medlem från databasen med hjälp av ID
// Returnerar Member-objekt eller null om medlemmen saknas

## 🎨 Design (från kyrkoapp-presentation.jsx)
- Färgtema: "Varm Olivsten"
- Accent: koppar (#8B5E3C ljus / #C4956A mörk)
- Typsnitt rubriker: Cormorant Garamond
- Typsnitt text: Inter (svenska), Cairo (arabiska)
- Typsnitt siffror/kod: JetBrains Mono
- Stöd för ljust + mörkt läge
- RTL-stöd för arabiska

## ♿ Tillgänglighet (a11y) och semantisk HTML
- Använd riktiga HTML-element: `<button>` för knappar, `<a>` för länkar,
  `<ul>`/`<li>` för listor, `<h1>`/`<h2>` för rubriker
- Klickbara element ska vara `<button>` — INTE `<div onClick>`
  (en `<div>` går inte att nå med tangentbord)
- Om en rad ändå måste vara en `<div>`: lägg `role="button"`, `tabIndex={0}`
  och hantera Enter/Space
- `aria-label` på ikon-knappar utan synlig text (t.ex. Ring, Radera, Stäng)
- Listor byggs med `<ul>`/`<li>` — inte staplade `<div>`
- Ingen hårdkodad data (telefonnummer, namn) i komponenter — den ligger i data-filer
- Kontrast och fokus-markering ska fungera i både ljust och mörkt läge

### RÄTT
<button onClick={onSelect}>Öppna</button>
<ul>{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul>

### FEL
<div onClick={onSelect}>Öppna</div>            // ej tangentbords-nåbar
{items.map((i) => <div>{i.name}</div>)}        // inte en semantisk lista

## 🔒 Säkerhet
Full checklista med exempel finns i docs/SECURITY.md — följ den för backend.
Kärnregler:

### Hemligheter och nycklar
- API-nycklar ALDRIG i koden — bara i .env på servern
- .env får ALDRIG committas (ligger i .gitignore)
- Frontend får ALDRIG se Speechmatics- eller DeepL-nycklar — anropas via egen backend
- Ingen `dangerouslyAllowBrowser: true`
- Separata nycklar per miljö (dev/prod), rotera vid läcka

### Inloggning (JWT + bcrypt)
- Lösenord hashas med bcrypt (minst 10 salt rounds) — aldrig i klartext
- Kort livslängd på access-token; refresh-token i httpOnly + Secure + SameSite-cookie (inte localStorage)
- Rate-limit och brute-force-skydd på /login
- Auktorisering är inte samma sak som autentisering: kontrollera att inloggad användare FÅR göra åtgärden och äger resursen

### Input och databas
- Validera ALL input (body, params, query) med Zod på varje endpoint
- Prisma parametriserar queries — undvik $queryRawUnsafe (SQL-injection)
- Principen om minsta privilegium för databas-användaren

### Nätverk och headers
- helmet, cors (allowlist — inte '*') och express-rate-limit i produktion
- HTTPS överallt

### Felhantering och loggning
- Central felhanterare; läck aldrig stack trace eller interna detaljer till klient
- Visa generiskt meddelande + referens-id, logga fullt internt
- Logga ALDRIG lösenord, tokens eller personuppgifter

### Personuppgifter (GDPR)
- Medlemsregistret är personuppgifter — GDPR gäller
- Dataminimering, samtycke, rätt att bli glömd
- Skydda känsliga fält, logga inte personuppgifter i klartext

### Beroenden och drift
- Kör npm audit regelbundet, håll beroenden uppdaterade
- Inga source maps i produktion
- CI kör tsc + lint + tester före merge

### Frontend och TypeScript-säkerhet
- Använd `unknown` istället för `any` — typkontrollera (`typeof`, type guards) innan värdet används
- Förbjud `eval()` och `new Function()` — kör aldrig strängar som kod
- Skydda mot null-krascher: optional chaining (`user?.name`) och null-kontroller före åtkomst
- Validera all data i runtime — API-svar, WebSocket-meddelanden, localStorage, `JSON.parse` — med Zod (typer finns bara vid bygge)
- React Error Boundaries runt sidor och kort så ett kraschat kort inte sänker hela appen
- Content Security Policy (CSP): helmet på servern, begränsa externa resurser
- TypeScript strict-läge aktiverat med extra rekommenderade flaggor från kod-analys-rapport (2026-07-30): `strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitReturns`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` — behåll alla
- Automatisk säkerhets-skanning (SAST) i CI: lint + npm audit före publicering

## 🧹 Kodkvalitet och struktur (gäller VARJE pass)
Kontrollera dessa fyra punkter innan varje commit — de håller koden ren långsiktigt.

### 1. Strukturera CSS och styling
- Undvik inkonsekvent styling och inline-CSS (`style={{...}}`) i app-koden.
- Samla gemensamma Tailwind-klasser och egna CSS-regler i EN central fil:
  `client/src/index.css` (t.ex. `.surface`, `.field`, `.btn-primary`, `.modal-panel`,
  `.text-strong`, `.text-soft`, `.text-faint`, `.text-accent`).
- Undantag: enstaka `style` för ett dynamiskt värde som inte går som klass
  (t.ex. `style={{ height: 600 }}` på kalendern) är ok. Prototypen `src/design/`
  räknas inte — den är en referens med egna inline-styles.

### 2. Återanvändbara UI-komponenter (DRY)
- Upprepas samma styling eller struktur mer än TVÅ gånger → bryt ut till en egen
  klass (i `index.css`) eller komponent (i `client/src/components/`).
- Redan utbrutet: input-fält (`.field`), knappar (`.btn-primary`/`.btn-secondary`),
  modal-bakgrund (`.modal-backdrop`/`.modal-panel`), samt komponenterna Avatar,
  Dropdown, Badge, StatCard. Använd dessa istället för att upprepa klass-strängar.
- Minskar dubblering och gör koden mycket lättare att läsa och underhålla.

### 3. Automatisera kodkvalitet (linters)
- ESLint är konfigurerad (`client/eslint.config.js` med eslint-plugin-security). CI kör lint.
- Prettier är konfigurerad (`client/.prettierrc.json`) — `npm run format` formaterar allt,
  `npm run format:check` kontrollerar.
- Pre-commit-hook kör automatiskt ESLint (--fix) + Prettier på stagade filer före varje
  commit (Gits `core.hooksPath` → `.githooks/pre-commit`, konfig i `client/package.json`
  under `lint-staged`). Aktiveras av `prepare`-scriptet vid `npm install`.
- Kör även `npm run lint` + `npx tsc -p tsconfig.app.json --noEmit` (bygget) innan commit.

### 4. Rensa och städa (refaktorering)
- Ta bort utkommenterad kod, oanvända import-satser, temporära `console.log()` och död kod.
- `console.error` är ok ENDAST i central felhantering (ErrorBoundary, lib/errorHandler.ts) —
  aldrig strö-loggar i komponenter.
- `tsc` med `noUnusedLocals` fångar oanvända importer/variabler — håll bygget rent.

## 🏛 Arkitektur (Clean Architecture) — följ ALLTID
Appen är lagerdelad så UI:t är oberoende av datakällan (mock nu, databas senare).
Följ detta mönster för ALL data — lägg aldrig en mock-import direkt i en sida eller komponent.

### Lagren
- **domain/** — entiteter (rena typer, ingen React/API) + `domain/repositories/` (gränssnitt/kontrakt).
- **data/mock/** — implementationer av gränssnitten (mock nu; `data/api/` när backend finns).
- **use-cases/** — ren affärslogik som funktioner (`buildAttendanceRecords`, `resolveFamilyId`).
  Ingen React — lätt att testa. Bryt ut logik hit när den ligger inbäddad i en komponent/hook.
- **hooks/** — presentation-hooks (`useMembers`, `useServices`, `useEvents` ...) som använder
  repositoryt (och ev. use-cases) och ger sidan klar data.
- **utils/** — rena, domän-agnostiska hjälpfunktioner (`dateUtils`). **lib/** — tjänster (api, errorHandler, whatsapp).
- **components/ + pages/** — bara visning. Får INTE importera mock-filer eller känna till datakällan.

### Dataflöde
`sida/komponent` → `useXxx()` (hook) → `xxxRepository` (gränssnitt) → mock (eller API)

### Så lägger du till en ny entitet
1. `domain/<entitet>.ts` — entiteten (typen).
2. `domain/repositories/<entitet>Repository.ts` — gränssnitt (getAll/add/update/remove).
3. `data/mock/mock<Entitet>Repository.ts` — mock-implementation (håller listan i minnet, async).
4. `hooks/use<Entitet>s.ts` — hook som använder repositoryt.
5. Sidan använder hooken — aldrig mock direkt.

### När backend kommer
Skriv `data/api/api<Entitet>Repository.ts` (samma metoder, fetch via `lib/api.ts` + Zod) och
byt EN import-rad i hooken. Noll ändringar i sidor eller komponenter.

## 🤝 Så hjälps mig, Claude
- Svara alltid på svenska
- Förklara VAD, VARFÖR och HUR
- En sak i taget
- Förklara planen INNAN du kör ändringar — Sima ska hinna med
- Fråga innan stora ändringar
- Påstå aldrig att något är uppfyllt eller klart utan att verifiera mot koden
- Lägg alltid till kommentarer på svenska i koden
- Följ kommentarsreglerna ovan (objektivt språk)
- Kom ihåg: Sima har ADHD och dyslexi — korta stycken, tydlig struktur
- Påminn alltid Sima att skriva dags-logg i DAGBOK.md innan hon avslutar
- Fråga om något ska loggas som milstolpe i DAGBOK.md
- Följ mallen i docs/MALL-SETUP.md för nya projekt-tillägg