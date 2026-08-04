# Changelog

Alla större ändringar i ParishHub loggas här.

Format inspirerat av [Keep a Changelog](https://keepachangelog.com/sv-SE/1.1.0/).

## [0.4.0] - 2026-08-03

### Tillagt
- Tvåspråkighet: i18next + react-i18next med svenska och arabiska (+ RTL)
- Egen språkväxlare i headern (SV / AR) + automatisk `dir="rtl"` och Cairo-font
- Locale-filer: `locales/sv.ts` och `locales/ar.ts`
- Mörkt läge på hela appen via `data-theme="dark"` + tema-knapp i headern
- `useTheme`-hook som minns valet i localStorage (validerat med `unknown`)
- Semantiska CSS-klasser i `index.css` (surface, field, btn-primary, modal-panel m.fl.) — DRY-central för alla ljus/mörk-färger
- Familjekoppling via `familyId` (kopplar medlemmar till samma familj)
- Klickbara familjemedlemmar i profilen + Lägg till/Ta bort ur familj
- WhatsApp-integration: `lib/whatsapp.ts` (`buildWhatsAppLink`) + WhatsApp-knapp i `MemberProfileModal`
- `GroupMessageModal` — bocka flera medlemmar, skicka WhatsApp-mall en i taget
- WhatsApp-mallar via översättningar (en per språk) — flyttades från datafil
- Avatar-komponent: initialer i färgad cirkel (färg härledd från namnet) + status-prick
- Profilbild per medlem: Ta foto (mobilkamera via `capture="environment"`) eller Välj bild (base64, max 1 MB)
- Kortnotering per gudstjänst (visas på raden, redigeras i närvaro-modalen)
- Frånvaro-orsak (sjuk/resa/okänd/annat) + kontaktstatus (Ej kontaktad/Försökt/Svarat) i närvaro-modalen
- Egen `Dropdown`-komponent (native select gick inte att färga mörk i Chrome/macOS)
- `Skeleton`-komponent med `role="status"` för laddnings-tillstånd
- Toast-notiser via `sonner` — inbyggd a11y (`role=status`, `aria-live`)
- `@axe-core/react` för automatisk a11y-skanning i utvecklingsläge
- `focus-trap-react` — focus-trap i alla 7 modaler + `role="dialog"` + `aria-labelledby`
- Global `focus-visible`-ring i `index.css` (WCAG 2.4.7)
- Prettier + `.prettierrc.json` + `.prettierignore` + `format` / `format:check`-script
- Pre-commit-hook via `.githooks/pre-commit` + `lint-staged` (ESLint + Prettier på stagade filer)
- Clean Architecture: `domain/` (entities + repository-interfaces), `data/mock/` (mock-implementationer), `use-cases/` (attendance, family), `utils/` (dateUtils)
- Nya hooks som kopplar sidor till repositories: `useMembers`, `useBirthdays`, `useContacts`, `useEvents`, `useServices`
- Nya Zod-schemas: `copticSchema`, `eventSchema`, `memberSchema`, `serviceSchema`
- Enhetstester: `attendance.test.ts`, `family.test.ts`, `dateUtils.test.ts`, `ErrorBoundary.test.tsx` (totalt 11 tester)
- Fem extra strict-flaggor i `tsconfig.app.json`: `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noImplicitReturns`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`
- Path aliases: `@components/`, `@hooks/`, `@pages/`, `@domain/`, `@data/`, `@lib/`, `@utils/`, `@schemas/` (Members.tsx konverterad som exempel)
- `React.memo` på `MemberCard`, `StatCard`, `Badge`
- `useCallback` på `handleSelectMember` + `handleToggleSelect` i Members
- `lazy()` + `Suspense` för `Members`, `Calendar`, `Services`, `DesignPreview` — separata JS-chunks per route
- `PageLoader`-komponent för Suspense-fallback (använder Skeleton)
- Ny dokumentation: `docs/UX-A11Y-INSTRUKTION.md` (9 steg för WCAG)
- Ny dokumentation: `docs/KODSTRUKTUR-INSTRUKTION.md` (5 steg för prestanda + kodstruktur)
- Milstolpar i ROADMAP: 3 aug (familjekoppling+WhatsApp, tvåspråkighet, mörkt läge, Fas 1 komplett, Clean Architecture)

### Ändrat
- STT-leverantör bytt från Deepgram till Speechmatics efter dialektanalys (bättre för koptiska inslag) — se AI-TOLKNING-RAPPORT.md avsnitt 7
- CLAUDE.md rad 218: alla 5 strict-flaggor listade konsekvent
- Prioritetslistan (funktion 5 Gudstjänstvyer) uppdaterad till 90 % klart
- Medlemsregister (funktion 2) uppdaterad till 85 % klart
- ROADMAP status: Frontend nu 70 %
- ErrorBoundary används nu på TVÅ nivåer: runt hela `<BrowserRouter>` i App.tsx OCH runt varje sida i Layout.tsx
- Alla fyra sidor hämtar data via hook → repository (ingen sida importerar mock direkt)
- Kategori-texter, WhatsApp-mallar och event-kategori-texter samlade i översättnings-nycklar (DRY)
- npm audit-fix på `brace-expansion` (DoS-sårbarhet)

### Fixat
- 57 av 58 typfel efter aktivering av strict-flaggor (bl.a. äkta null-buggar i Avatar, palette-lookup, marks-index)
- `baseUrl` deprecated i TS 6 — tog bort, gjorde paths-målen relativa
- DAGBOK.md kompletterad med Dag 5-11 (utökade tidigare loggar)

### Borttaget
- Fältet `photoUrl`-input i AddMemberModal (bara Ta foto/Välj bild kvar)
- `types/`-mappen (typerna flyttade till `domain/`)

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
