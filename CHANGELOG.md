# Changelog

Alla större ändringar i ParishHub loggas här.

Format inspirerat av [Keep a Changelog](https://keepachangelog.com/sv-SE/1.1.0/).

## [0.3.0] - 2026-07-30

### Tillagt
- Services-sida (`/gudstjanster`) med närvaro-avprickning per medlem
- Full CRUD på medlemmar (AddMemberModal, MemberProfileModal, redigera/radera)
- Zod-schemas i egen mapp: memberSchema, eventSchema, serviceSchema, copticSchema
- Central felhantering: `lib/errorHandler.ts` + `lib/api.ts` med `safeFetch<T>()`
- ErrorBoundary-komponent (undantag från funktionell-komponent-regeln)
- Första testet i projektet: ErrorBoundary.test.tsx
- Testinfrastruktur: Vitest, @testing-library/react, jsdom
- npm-script "test": "vitest run"
- CI-pipeline i `.github/workflows/ci.yml`
- Säkerhets-linting: `eslint-plugin-security`
- Interaktiv designprototyp: `client/src/design/DesignPreview.tsx` (route `/design`, 11 skärmar)
- Ny dokumentation: `docs/DESIGN.md` (designsystem)
- CV-punkter: `CV-BULLETS.md`
- Dag 5 (29-30 juli) i DAGBOK.md
- Nya typer: Service, NewServiceData, Attendance, AttendanceStatus, MemberCategory, NewMemberData

### Ändrat
- CLAUDE.md rejält utökad: a11y-sektion, säkerhet uppdelad i 7 delar (hemligheter, JWT, input/db, headers, felhantering, GDPR, beroenden), frontend/TypeScript-säkerhet, kommentarsregler i 5 punkter
- Ny regel i CLAUDE.md: "Förklara planen INNAN du kör ändringar"
- Ny regel i CLAUDE.md: "Påstå aldrig att något är klart utan att verifiera mot koden"
- OpenAI → DeepL för översättning i all dokumentation
- App.tsx: hela appen wrappas nu i ErrorBoundary
- App.tsx: nya routes `/gudstjanster` och `/design`
- Members.tsx: från visning till full CRUD med state, add/update/delete-handlers
- MemberCard.tsx: nu klickbar med onSelect
- copticApi.ts: omskriven för att använda safeFetch + Zod-schema
- README.md: kompletterad med felhantering, testning och länkar till nya docs
- docs/REDOVISNING.md: utökad med Kalender + Medlemmar + teknik-motiveringar (204 nya rader)

### Fixat
- Kommentarsregler städade i CLAUDE.md
- Bugg i designprototypens live-knapp (onClick-hanterare)

### Borttaget
- Skräprad `## exempel: [0.2.0] - 2026-07-29` längst ner i CHANGELOG.md (låg kvar från mallen)

## [0.2.0] - 2026-07-29

### Tillagt
- Dashboard-sida (`/`) med StatCard, Badge, BirthdayList, PriorityList
- Medlemmar-sida (`/medlemmar`) med sök och filter
- Kalender-sida (`/kalender`) med full CRUD för händelser
- Anslutning till coptic.io-API för koptiska högtider
- React Query (`@tanstack/react-query`) med QueryClientProvider
- Zod-validering i formulär
- lucide-react-ikoner (ersätter emojis)
- Custom hooks: useDateTime, useMemberSearch, useCopticCelebrations
- TypeScript-typer: Birthday, Contact, ContactStatus, Member, ChurchEvent, LifeEvent, Coptic
- Komponenter: Layout, StatCard, Badge, BirthdayList, PriorityList, MemberCard, EventModal, AddEventModal, CalendarToolbar
- `src/api/copticApi.ts` med try/catch
- `data/eventCategories.ts` (DRY-central för kategori-etiketter)
- .vscode/settings.json för JSON-kommentarer
- Ny dokumentation: docs/SECURITY.md (checklista), docs/REDOVISNING.md, docs/AI-TOLKNING-RAPPORT.md, docs/MALL-SETUP.md, ROADMAP.md
- NOTES.md (privat, i .gitignore)

### Ändrat
- CLAUDE.md förstärkt med säkerhetsregler och regel "kod på engelska, kommentarer på svenska"
- README.md kompletterad med felhantering, TypeScript-config och testning
- "Pastor Erik" bytt till "Fader Korollos" i kod och Project Instructions

### Fixat
- JSX-taggfel: saknade `</a>`-stängningar
- Fel tsconfig vid typkontroll: `tsc -p tsconfig.app.json`
- `verbatimModuleSyntax` kräver `import type`

## [0.1.1] - 2026-07-30

### Fixat
- DAGBOK.md: rensat dubblett-post "Onsdag 23 juli — Dag 2" (tom)
- DAGBOK.md: korrigerat veckodag Dag 1 (Tisdag → Onsdag 22 juli)
- DAGBOK.md: korrigerat typo Dag 3 (LÖrdag → Lördag 25 juli)

## [0.1.0] - 2026-07-22

### Tillagt
- Grundstruktur för monorepo (client/ + server/)
- CLAUDE.md med projektregler
- Kommentarsregler (svenska, objektivt språk, ingen AI-syntax)
- Kodstandard (DRY, custom hooks, ren kommentarsstil)
- Behörigheter i .claude/settings.json
- Första skill: parishhub-regler
- Slash-kommandon: /granska, /kommentera, /förklara
- Dokumentation: README, ARCHITECTURE, API, TROUBLESHOOTING

### Ändrat
- (inget än)

### Fixat
- (inget än)

### Borttaget
- (inget än)
