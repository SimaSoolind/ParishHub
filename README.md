# ParishHub ✝

> **Syfte:** Startpunkt för nya besökare på GitHub — vad projektet är + kom-igång.
> **Använd när:** någon öppnar repot för första gången.
> **Se även:** [`docs/INDEX.md`](./docs/INDEX.md) för hitta-rätt-guide, [`docs/BACKLOG.md`](./docs/BACKLOG.md) för tasks.

Digitalt system för kyrkoförvaltning — med AI-tolkning live på svenska och arabiska.

## 🎯 Syfte
En modern app som hjälper en präst att hantera hela sin församling digitalt.
Ersätter papperslistor och gamla anteckningsböcker med säker, snabb kommunikation.

## ✅ Byggda funktioner (frontend, mockdata)
- **Medlemsregister** — sök, filter, CRUD, familjekoppling, profilbild, WhatsApp-utskick
- **Kalender** — koptiska högtider/fastor + egna händelser (CRUD)
- **Gudstjänster** — skapa, närvaro-avprickning, frånvaro-orsak, kontaktstatus, radera
- **Dashboard** — statistik, veckans födelsedagar, prioriterad kontaktlista
- **Tvåspråkighet** — svenska + arabiska med RTL
- **Mörkt/ljust läge** + inställbar textstorlek (WCAG 1.4.4)
- **Tillgänglighet** — semantik, focus-trap i modaler, färgblind-säkra statusar, WCAG-kontrast

> Allt använder mockdata tills backend byggs (vecka 5-6).

## 🗂 Monorepo-struktur

```
ParishHub/
├── client/           # Frontend — React + Vite + TypeScript
├── server/           # Backend — Node.js + Express + TypeScript
├── docs/             # Dokumentation
├── .claude/          # Claude Code-inställningar
├── CLAUDE.md         # Projektregler
├── CHANGELOG.md      # Ändringslogg
└── README.md         # Denna fil
```

## 🛠 Teknisk stack

### Frontend (client/)
- React 19 + Vite + TypeScript (strict)
- React Router v7
- Tailwind CSS v4 (mörkt/ljust läge)
- react-i18next (svenska + arabiska, RTL)
- @tanstack/react-query
- Zod (runtime-validering), sonner (toast), lucide-react (ikoner)
- react-big-calendar + date-fns (kalender), recharts (grafer)
- focus-trap-react + @axe-core/react (WCAG-tillgänglighet)
- Arkitektur: Clean Architecture (domain / data / hooks) med mockdata tills backend finns

### Backend (server/)
- Node.js + Express + TypeScript
- PostgreSQL via Prisma ORM
- JWT + bcrypt
- Speechmatics (speech-to-text live)
- DeepL (arabisk → svensk översättning)

### Hosting
- Frontend: Vercel
- Backend + Databas: Railway

## 🚀 Kom igång

### Krav
- Node.js 20 eller högre
- npm
- PostgreSQL-konto (Railway)
- Speechmatics-konto (⚠️ TODO: Sima uppdaterar aktuell gratisnivå)
- DeepL-konto (gratis 500 000 tecken/månad)

### Steg 1 — Klona projektet
```bash
git clone https://github.com/SimaSoolind/ParishHub.git
cd ParishHub
```

### Steg 2 — Installera backend (kommer i vecka 5-6)

> ⚠️ **Backend är inte startad ännu.** `server/`-mappen är tom.
> Hoppa direkt till Steg 5 (frontend) för att köra appen med mockdata.

```bash
cd server
npm install
```

### Steg 3 — Skapa .env-fil i server/ (kommer i vecka 5-6)
Kopiera `.env.example` till `.env` och fyll i värden.

### Steg 4 — Starta backend (kommer i vecka 5-6)
```bash
npm run dev
```
Backenden kommer köras på http://localhost:3000

### Steg 5 — Installera och starta frontend
```bash
cd client
npm install
npm run dev
```
Frontenden körs på http://localhost:5173

## ⚠️ Felhantering

- **Typade felklasser i frontend** (`client/src/lib/errors.ts`): `AppError`, `ValidationError`, `NetworkError`, `AuthError`
- `getErrorMessageKey()` väljer rätt användarmeddelande per feltyp (visas som toast)
- `safeFetch` (`lib/api.ts`) kastar `NetworkError` och validerar svar med Zod
- React Error Boundaries fångar UI-fel så en kraschad vy inte sänker hela appen
- Central loggning (`lib/errorHandler.ts`) — användaren ser aldrig stack traces
- Backend får en egen global error-handler när den byggs

## 🧩 TypeScript-konfiguration

- `strict: true` i `tsconfig.app.json` för full typsäkerhet
- `noUnusedLocals` och `noUnusedParameters` aktiverade
- Extra strikta flaggor för att fånga latenta buggar tidigt:
  - `exactOptionalPropertyTypes` — optionella fält typas som `T | undefined`
  - `noUncheckedIndexedAccess` — array/objekt-index kan vara `undefined`
  - `noImplicitReturns` — alla vägar i en funktion måste returnera
  - `noImplicitOverride` — override-metoder måste ha `override`-modifierare
  - `noPropertyAccessFromIndexSignature` — index-signaturer måste nås med `['key']`
- Använd `unknown` istället för `any` när typen är okänd
- Egen typ-fil per feature-modul

## 🧪 Testning

- **Vitest** som testrunner (frontend), konfigurerad i `client/vite.config.ts`
- **@testing-library/react** för komponent-tester
- **jsdom** som browsermiljö i tester
- Nuvarande tester: `ErrorBoundary.test.tsx`, `attendance.test.ts`, `family.test.ts`, `dateUtils.test.ts`
- Kör tester lokalt: `cd client && npm run test`
- CI (GitHub Actions, `.github/workflows/ci.yml`) kör: tsc + lint + tester + npm audit, samt **Semgrep** (SAST), **Lighthouse** (a11y/prestanda) och **Snyk** (sårbara paket)
- Backend-tester läggs till när backend byggs (vecka 5-6)

## 📖 Vidare läsning

- [CLAUDE.md](./CLAUDE.md) — Projektregler och kodstandard
- [ROADMAP.md](./ROADMAP.md) — Alla funktioner, status per funktion + faser
- [docs/DESIGN.md](./docs/DESIGN.md) — Designsystem (färger, typografi, komponenter, skärmar)
- [docs/FARG-OCH-DESIGN-ATT-GORA.md](./docs/FARG-OCH-DESIGN-ATT-GORA.md) — Färg & design — att-göra-lista (WCAG, mobilnav m.m.)
- [docs/REDOVISNING.md](./docs/REDOVISNING.md) — Offentlig redovisning för lärare och LIA
- [docs/SECURITY.md](./docs/SECURITY.md) — Säkerhetschecklista (backend + frontend)
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Systemarkitektur
- [docs/AI-TOLKNING-RAPPORT.md](./docs/AI-TOLKNING-RAPPORT.md) — Rapport & handlingsplan för realtids-AI-tolkning (WebSocket, STT, DeepL)
- [docs/API.md](./docs/API.md) — API-dokumentation
- [docs/TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) — Vanliga fel och lösningar
- [docs/UX-A11Y-INSTRUKTION.md](./docs/UX-A11Y-INSTRUKTION.md) — 10-stegs plan för WCAG-tillgänglighet
- [docs/KODSTRUKTUR-INSTRUKTION.md](./docs/KODSTRUKTUR-INSTRUKTION.md) — 10-stegs plan för prestanda, kodstruktur och CI-härdning
- [docs/MALL-SETUP.md](./docs/MALL-SETUP.md) — Mall för nya projekt-tillägg
- [CHANGELOG.md](./CHANGELOG.md) — Ändringslogg

## 👤 Byggd av
Sima Soolind — Fullstack-utvecklare med säkerhetsinriktning
Examensprojekt 2026