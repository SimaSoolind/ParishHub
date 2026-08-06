# 📋 ParishHub — Teknisk dokumentation

En djupdykning i systemet: funktioner, arkitektur, säkerhet, prestanda,
tillgänglighet och vägen framåt.

**Byggt av:** Sima Soolind · examensprojekt 2026
**Designtema:** Varm Olivsten (koppar-accent)

**Statusmarkeringar:** ✅ Byggt · 🔷 Delvis · ⚪ Planerat

> **Nuläge:** Frontend är byggd och körbar med **mockdata**. Backend, inloggning,
> databas och AI-tolkning är planerade nästa faser. Detta dokument visar både
> det som finns och det som är designat.

---

## Innehåll

1. [Funktioner](#1-funktioner)
2. [Arkitektur](#2-arkitektur)
3. [Teknisk stack](#3-teknisk-stack)
4. [Säkerhet](#4-säkerhet)
5. [Prestanda](#5-prestanda)
6. [Tillgänglighet (WCAG)](#6-tillgänglighet-wcag)
7. [Kodkvalitet och CI](#7-kodkvalitet-och-ci)
8. [Flerspråkighet](#8-flerspråkighet)
9. [AI-tolkning live](#9-ai-tolkning-live)
10. [Roadmap](#10-roadmap)

---

## 1. Funktioner

Tolv huvudfunktioner hjälper en präst att sköta hela församlingen digitalt —
från medlemsregister till live-tolkning under gudstjänsten.

| Funktion | Beskrivning | Status |
|---|---|---|
| Medlemsregister | Sök, filter, CRUD, familjekoppling, profilbild, WhatsApp-utskick | 🔷 85% |
| Gudstjänster och närvaro | Skapa gudstjänst, pricka av närvaro, frånvaro-orsak, kontaktstatus, radera | 🔷 90% |
| Kalender | Koptiska högtider/fastor + egna händelser (dop, bröllop) med full CRUD | ✅ Byggt |
| Dashboard | Statistik, veckans födelsedagar, prioriterad kontaktlista | 🔷 70% |
| Familjekoppling | Koppla medlemmar till samma familj, se familj i profilen | 🔷 60% |
| Direktkontakt | Ring, mejla, WhatsApp med färdiga mallar direkt från appen | 🔷 70% |
| Tvåspråkighet | Svenska + arabiska med RTL, mörkt läge, inställbar textstorlek | ✅ Byggt |
| Inloggning och säkerhet | Säker inloggning (JWT), roller, aktivitetslogg | ⚪ Backend |
| Krypterade anteckningar | Prästens privata minnesanteckningar, krypterade i databasen | ⚪ Backend |
| GDPR-hantering | Samtycke, dataminimering, rätt att bli glömd, export | ⚪ Backend |
| Historik och grafer | Närvaro över tid per medlem (Recharts, redan installerat) | ⚪ Planerat |
| AI-tolkning live | Arabisk predikan → svensk text på skärm i realtid | ⚪ Backend + AI |

---

## 2. Arkitektur

Appen följer **Clean Architecture** — lagerdelad så att UI:t är helt oberoende av
datakällan. Det gör att mockdata kan bytas mot en riktig databas utan att sidor
eller komponenter ändras.

| Lager | Ansvar |
|---|---|
| **domain/** | Entiteter (rena TypeScript-typer) + repository-**gränssnitt**. Ingen React, inget API |
| **data/** | Repository-**implementationer** — mock nu, `data/api/` med fetch + Zod senare |
| **use-cases/** | Ren affärslogik som funktioner (närvaro, familjekoppling) — lätt att enhetstesta |
| **hooks/** | Presentation-hooks (useMembers, useServices) som ger sidan färdig data |
| **pages/ + components/** | Bara visning. Får aldrig importera mock eller känna till datakällan |

**Dataflöde:**

```
sida → hook → repository (gränssnitt) → mock (eller API)
```

När backend kommer byts **en** import-rad i hooken — noll ändringar i sidor eller
komponenter.

### Mappstruktur (client/src)

```
domain/            entiteter (rena typer) + repositories/ (gränssnitt)
data/mock/         repository-implementationer (mockdata nu)
hooks/             presentation-hooks — useMembers, useServices ...
use-cases/         ren affärslogik + enhetstester
pages/             Dashboard · Members · Calendar · Services
components/        återanvändbar UI — Badge, StatCard, modaler
schemas/           Zod-validering (runtime-säkerhet)
lib/               api · errorHandler · errors · whatsapp
locales/           sv.ts · ar.ts (tvåspråkighet)
utils/             rena hjälpfunktioner + tester
App.tsx · main.tsx rot + routing
```

---

## 3. Teknisk stack

### Frontend ✅ Byggt

- **React 19** + Vite + TypeScript (strict)
- **React Router 7** — routing
- **Tailwind CSS v4** — styling, mörkt läge
- **react-i18next** — svenska + arabiska (RTL)
- **Zod** — runtime-validering
- **sonner** (toast) · **lucide-react** (ikoner) · **recharts** (grafer)
- **react-big-calendar** + date-fns (kalender)
- **focus-trap-react** · **@axe-core/react** (tillgänglighet)

### Backend ⚪ Planerat

- **Node.js + Express** + TypeScript
- **PostgreSQL** via Prisma ORM
- **JWT + bcrypt** — säker inloggning
- **Speechmatics** — tal → text (arabiska)
- **DeepL** — arabiska → svenska
- **WebSocket** — realtid för AI-tolkning
- Hosting: **Vercel** (frontend) + **Railway** (backend/databas)

---

## 4. Säkerhet

Säkerhet är inbyggt från början via en checklista i `docs/SECURITY.md`.
Frontend-delarna är på plats; backend-delarna byggs när servern kommer.

### På plats i frontend ✅

- **Typade felklasser** (AppError, NetworkError, ValidationError, AuthError)
- **Zod-validering** av all extern data i runtime
- **React Error Boundaries** runt sidor och kort
- Ingen `eval`, ingen `dangerouslySetInnerHTML`
- **unknown** istället för **any** — typkontroll före användning
- Inga API-nycklar i klientkoden
- Central felhantering — läcker aldrig stack trace till användaren

### Planerat i backend ⚪

- **bcrypt**-hashade lösenord (aldrig klartext)
- **JWT** i httpOnly + Secure-cookie, inte localStorage
- **Rate-limit** + brute-force-skydd på inloggning
- **helmet**, CORS-allowlist, HTTPS överallt
- API-nycklar bara i `.env` på servern
- Prisma parametriserar queries (SQL-injection-skydd)
- **GDPR**: samtycke, dataminimering, rätt att bli glömd

> **Automatisk säkerhetsskanning i CI:** Semgrep (SAST), Snyk (sårbara paket),
> npm audit och ESLint-plugin-security.

---

## 5. Prestanda

Optimeringar som håller appen snabb även när den växer.

- **Code-splitting** med `lazy()` + Suspense — varje sida laddas som egen chunk.
  Tunga Kalender (react-big-calendar) hämtas bara vid behov.
- **React.memo** på list-komponenter (MemberCard, StatCard, Badge) — hoppar över
  onödig omrendering.
- **useCallback** ger stabila referenser så memo:n faktiskt biter.
- **Suspense i Layout** — headern står kvar medan en sida laddas.
- **Path aliases** (`@components/`, `@hooks/`) — kortare, säkrare imports.

---

## 6. Tillgänglighet (WCAG)

Tillgänglighet är lag för offentlig sektor. Appen följer en 10-stegs WCAG-plan —
hela vägen genomförd.

- **Semantik:** riktiga element (main / header / section / nav / ul) — inte
  staplade div:ar.
- **Fokus:** focus-trap i alla 7 modaler + synlig fokus-ring (WCAG 2.4.7).
- **Färg:** färgblind-säkra statusar — ikon *och* text, aldrig bara färg.
- **Kontrast:** all text verifierad mot 4.5:1 (WCAG AA) på både ljus och mörk
  bakgrund.
- **Text:** inställbar textstorlek 80–200 % (WCAG 1.4.4), sparas mellan besök.
- **Mobil:** bottennavigering med tumvänliga touch-ytor (minst 44px).
- **Revision:** @axe-core/react skannar tillgänglighet live i utvecklingsläget.

---

## 7. Kodkvalitet och CI

### Typsäkerhet och stil

- **TypeScript strict** + 5 extra flaggor (exactOptionalPropertyTypes,
  noUncheckedIndexedAccess, noImplicitReturns, noImplicitOverride,
  noPropertyAccessFromIndexSignature)
- **ESLint** med security-plugin
- **Prettier** + **pre-commit-hook** (lint-staged)
- Clean Architecture + DRY-regler i CLAUDE.md

### Tester och pipeline

- **Vitest** + Testing Library (jsdom) — use-cases och utils
- **CI (GitHub Actions)** vid varje push/PR kör:
  - tsc · lint · tester · npm audit
  - **Semgrep** (SAST) · **Lighthouse** (a11y/prestanda) · **Snyk** (sårbara paket)

---

## 8. Flerspråkighet

Hela gränssnittet finns på svenska och arabiska. All synlig text går genom `t()`
— ingen text är hårdkodad.

- **i18n:** react-i18next med två språkfiler: `locales/sv.ts` och `ar.ts`.
- **RTL:** arabiska vänder hela layouten (`dir="rtl"`) och byter till **Cairo**-
  typsnitt automatiskt.
- **Data:** koptiska högtider hämtas från ett externt API (validerat med Zod).

---

## 9. AI-tolkning live

Prästens arabiska/koptiska predikan tolkas till svensk text på skärm i realtid —
så hela församlingen kan följa med. En tre-stegs pipeline via WebSocket.

```
Mikrofon (arabiska)
   → Speechmatics   // tal → arabisk text (<150 ms)
   → DeepL          // arabiska → svenska
   → Skärm          // live-text på båda språk (projektor / OBS)
```

**Frontend-delarna:** en `useAudioStreamer`-hook (mikrofon → PCM), robust
WebSocket med auto-återanslutning, och tre vyer — prästens kontroll,
projektor-skärm och predikanarkiv. Nycklarna bor **bara** i backend; frontend
pratar med egen server via WSS.

> **Beslut:** Speechmatics valdes för högsta precision på dialekter och koptiska
> inslag (96 % noggrannhet). Full plan i `docs/AI-TOLKNING-RAPPORT.md`.

---

## 10. Roadmap

### Fas 1 — Frontend ✅ Klar
- Mörkt läge, flerspråkighet, tillgänglighet
- Medlemmar, kalender, gudstjänst/närvaro
- Clean Architecture, strict TS, CI-härdning

### Fas 2 — Backend ⚪ Nästa
- Express + Prisma + PostgreSQL
- Inloggning (JWT + bcrypt), GDPR
- Spara data på riktigt (api-repositories)

### Fas 3 — AI-tolkning ⚪
- WebSocket-server + Speechmatics + DeepL
- Skärm-vy för projektor / OBS Studio
- Predikanarkiv

### Fas 4 — Publicering ⚪
- Vercel (frontend) + Railway (backend/databas)
- Övervakning (Sentry, Prometheus)
- Skalning (Redis Pub/Sub)

---

## Vidare läsning

- [README.md](../README.md) — projektöversikt och kom-igång
- [ROADMAP.md](../ROADMAP.md) — alla funktioner, status per funktion + faser
- [docs/DESIGN.md](./DESIGN.md) — designsystem (färger, typografi, komponenter)
- [docs/SECURITY.md](./SECURITY.md) — säkerhetschecklista (backend + frontend)
- [docs/ARCHITECTURE.md](./ARCHITECTURE.md) — systemarkitektur
- [docs/AI-TOLKNING-RAPPORT.md](./AI-TOLKNING-RAPPORT.md) — full AI-plan (WebSocket, STT, DeepL)
