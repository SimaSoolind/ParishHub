# 📔 Dagbok — ParishHub

> **Syfte:** Daglig utvecklingslogg + milstolpar för LIA-material.
> **Använd när:** du vill komma ihåg vad som hände, se din progress.
> **Uppdatera:** i slutet av varje arbetsdag (5-10 meningar räcker).

En personlig logg över resan att bygga Kyrko-appen.
Skriven av Sima Soolind från första dagen till lansering.

**Syfte:**
- Reflektera över lärdomar
- Fånga utmaningar och lösningar
- Visa progression för LIA-handledare och arbetsgivare
- Blicka tillbaka när projektet är klart

**Regler för dagboken:**
- Skriv KORT (5-10 meningar per dag räcker)
- Var ärlig — även svåra dagar räknas
- Skriv på svenska
- Ingen prestation krävs — även "vilodagar" får loggas

---

## 📊 Sammanfattning

| Vecka | Timmar totalt | Största lärdomen |
|-------|---------------|-------------------|
| v.30 (21-27 juli 2026) | — | — |
| v.31 (28-30 juli 2026) | — | Full CRUD + säkerhet, tester och CI |
| v.32 (3 aug 2026) | — | i18next: hela appen tvåspråkig (sv/ar + RTL) |

---

## 📅 Dag-för-dag

---

### 🗓 Onsdag 22 juli 2026 — Dag 1

**⏱ Tid:** 8 timmar
**🎯 Mål för dagen:** Sätta upp projektstruktur och första React-sidan

**✅ Vad som gjordes:**
- Skapade GitHub-repo (ParishHub)
- Byggde monorepo-struktur (client/ + server/)
- Skrev CLAUDE.md med alla projektregler
- Skapade docs/-mapp med ARCHITECTURE, TROUBLESHOOTING, API
- Konfigurerade behörigheter (.claude/settings.json)
- Skapade första skill (parishhub-regler)
- Skapade slash-kommandon (/granska, /kommentera, /förklara)
- Skrev README, CHANGELOG
- Installerade Vite + React + TypeScript
- Installerade 15 npm-paket (React Router, i18next, Tailwind, m.m.)
- Konfigurerade Tailwind CSS v4
- Fick första ParishHub-sidan på skärmen ✨

**🎓 Lärdomar:**
- Monorepo-struktur är enklare än det låter — bara två mappar (client + server)
- Deepgram är mycket snabbare än Whisper för live-tolkning
- DeepL är bättre än OpenAI för svensk översättning
- Att skriva CLAUDE.md sparar mycket tid senare

**⚠️ Utmaningar:**
- Blev osäker på om backend eller frontend skulle byggas först
- Insåg mitt i att monorepo (både client + server) är bättre än separat
- Fick byta namn från ParishHub-server till ParishHub på GitHub

**💡 Fel att komma ihåg:**
- Inget stort fel — bra dag endast lägga upp projekts-truktur!

**📝 Reflektion:**
Första dagen! Fick igång hela grundstrukturen på en dag. Kändes stort att se
den första sidan på skärmen med rätt färger. Framförallt lärde jag mig att
dokumentation från början sparar mycket huvudvärk senare.

**➡️ Nästa steg:**
- Bygga första riktiga sidan (Dashboard) från mockupen
- Sätta upp React Router för navigation

---

### 🗓 Torsdag 23 juli 2026 — Dag 2

**⏱ Tid:** ca 3 timmar
**🎯 Mål för dagen:** Bygga Dashboard-grunden med React Router och statistikkort

**✅ Vad som gjordes:**
- Startade Vite-servern och verifierade att gårdagens setup fungerade
- Skapade mappstrukturen: src/pages/, src/components/, src/hooks/, src/types/
- Byggde första Dashboard-sidan (src/pages/Dashboard.tsx)
- Satte upp React Router i App.tsx
- Skapade Layout-komponent med gemensam header och nav-länkar
- Lärde mig hur <Outlet /> fungerar — sidan sätts in där i Layout
- Byggde StatCard-komponent som återanvändbar komponent (DRY-principen)
- La till tre statistikkort på Dashboard: Medlemmar, Närvarande, Att kontakta
- Bytte ut "Pastor Erik" mot "Fader Korollos" i koden och Project Instructions

**🎓 Lärdomar:**
- React Router använder <Outlet /> som platshållare där sidan visas
- Layout-komponent = header/nav skrivs EN gång och återanvänds automatiskt
- Props = information som skickas IN till en komponent
- TypeScript-interface säkerställer att komponenten får rätt data
- Mockdata används först — riktig data från databas kommer senare (v.5-6)
- Bygg med fake-data först, byt till riktig data när backend är klar

**⚠️ Utmaningar:**
- Blev först osäker på om siffran 47 medlemmar var fast — insåg att det är mockdata som ersätts när backend finns
- Behövde ha koden förklarad INNAN inklistring — bra påminnelse för framtiden

**💡 Fel att komma ihåg:**
- Inget stort fel — bra dag!

**📝 Reflektion:**
Bra dag med tydlig progress. Såg riktiga komponenter växa fram på skärmen.
DRY-principen började verkligen sitta — StatCard skrevs EN gång och användes
tre gånger. Klart att detta är rätt sätt att bygga

---

### 🗓 Lördag 25 juli 2026 — Dag 3

**⏱ Tid:** ca 4 timmar
**🎯 Mål för dagen:** Bygga hela Dashboard klar med alla tre huvudkomponenter

**✅ Vad som gjordes:**
- Lektioner med Scrimba, gick genom refaktorering, typing av funktioner och typa useState i React. 
- Byggde StatCard-komponenten med props och färg-mappning
- Uppdaterade StatCard och BirthdayList till lucide-react ikoner istället för emojis
- La till fler kommentarer på svenska (objektivt språk)
- Skapade custom hook useDateTime — dynamiskt datum och hälsning
- Byggde Badge-komponent för återanvändbara statusetiketter
- Byggde PriorityList-komponent med statusMap-mönster
- Skapade TypeScript-typer: Birthday, Contact, ContactStatus
- Uppdaterade CLAUDE.md med regel: kod på engelska, kommentarer på svenska
- Uppdaterade Project Instructions med samma regel + Fader Korollos-namn
- Skapade professionell REDOVISNING.md i docs/
- Skapade privat NOTES.md (i gitignore) för egna tekniska anteckningar
- Testade ring-knappen — fungerar i webbläsaren (öppnar telefon)

**🎓 Lärdomar:**
- Custom hooks separerar logik från JSX — kodregeln blir tydlig i praktiken
- Record<K, V> är TypeScript-typ för mappnings-tabeller
- Icon-prop med stor bokstav = signal om att det är en komponent
- Union types (t.ex. "red" | "blue") begränsar vad som kan skickas in
- Undvik svenska tecken i variabelnamn och template literals
- lucide-react ikoner ser proffsigare ut än emojis (kan färgläggas)
- statusMap-mönstret är bättre än if/else-kedjor

**⚠️ Utmaningar:**
- Stötte på flera fel som tog tid att felsöka:
  - Fil sparad som .ts istället för .tsx (JSX fungerade inte)
  - Template literals med svenska tecken orsakade parser-fel i Vite/OXC
  - Klistrat in fel kod (Badge) i fel fil (PriorityList) — hittade genom cat
- Blev osäker på om siffran 47 medlemmar skulle vara dynamisk — insåg att mockdata bytes mot databas i vecka 5-6

**💡 Fel att komma ihåg:**
- KOLLA ALLTID filnamnet — .ts vs .tsx är stor skillnad
- Använd cat i terminalen för att se vad som ACTUALLY är i en fil
- Kod på engelska, kommentarer på svenska — sätt regeln FÖRST innan man börjar koda

**📝 Reflektion:**
Bra dag med mycket lärande. Dashboard är HELT klar med alla tre kärnkomponenter.
Kändes särskilt bra att bygga custom hook — insåg direkt varför regeln
"logik i hooks, JSX bara för visning" är viktig. Koden blir mycket lättare
att läsa. Ring-knappen som faktiskt ringde när jag klickade — magiskt ögonblick.
Skapade också två olika typer av dokumentation: en för redovisning (offentlig)
och en för mig själv (privat, i gitignore).

**➡️ Nästa steg:**
- Skapa Medlemmar-sidan (/medlemmar) — börja med enkel struktur
- Skapa Kalender-sidan (/kalender)
- Sätta upp i18next för svenska/arabiska
- Överväga att flytta mockdata till en Context istället för direkt import

---

### 🗓 Tisdag 28 juli 2026 — Dag 4

**⏱ Tid:** 6 timmar
**🎯 Mål för dagen:** Bygga klar kalendern med full CRUD, koptisk kalenderdata och tydlig navigering

**✅ Vad som gjordes:**
- Fixade flera JSX-fel där oppningstaggen `<a>` saknades (BirthdayList, MemberCard)
- Byggde klart EventModal som var avhuggen mitt i koden
- Gjorde kalendern till en controlled component — vy-växling (Månad/Vecka/Dag) och Idag/Nästa fungerar
- Byggde AddEventModal — formulär för nya event med Zod-validering
- Flyttade events till useState så nya kan läggas till
- La till Redigera och Radera — full CRUD i kalendern
- Återställde svenska tecken (åäö) i alla 23 filer (kommentarer + UI-text)
- La till funktions-kommentarer och kopplings-rader (Används av:) i hela klienten
- DRY: samlade kategori-etiketter i en gemensam fil (eventCategories.ts)
- Löste editor-varningar (JSON-kommentarer via .vscode/settings.json, es2023 falskt larm)
- Kopplade in KOPTISKA HÖGTIDER i kalendern via coptic.io-API (react-query + useCopticCelebrations)
- Satte upp react-query (QueryClientProvider) för API-cachning
- Byggde egen verktygsrad (CalendarToolbar) med pil-knappar och vy-växlare
- Gjorde dagar klickbara — klick på en dag byter till dag-vyn
- Samlade alla API-anrop i src/api/copticApi.ts med try/catch + console.error
- Skrev en komplett kodkarta över alla filer i NOTES.md
- Sparade plan för i18next (svenska/arabiska) till senare
- Stärkte säkerhetsreglerna i CLAUDE.md och skapade docs/SECURITY.md (backend-checklista + GDPR)
- Kompletterade README.md (felhantering, TypeScript-config, testning)
- La till teknisk fördjupning i NOTES.md (react-query, try/catch, CRUD)
- Rättade dokumentationen: översättningstjänst är DeepL (inte OpenAI)

**🎓 Lärdomar:**
- verbatimModuleSyntax kräver import type för typer
- Controlled component = state styr vad som visas, inte bara startvärde
- Zod safeParse ger validering med egna svenska felmeddelanden
- Immutable update: setEvents(prev => [...prev, nytt])
- Rätt typkontroll är tsc -p tsconfig.app.json — inte från roten
- react-query (useQuery): queryKey = namn i cachen, staleTime = hur länge datan är färsk
- try/catch fångar fler fel än if — även när nätet dör innan svar kommer
- Externa API-anrop samlas i src/api/ — lättare att hitta och felsöka
- Egen verktygsrad kopplas in via components={{ toolbar: ... }}
- Skrivskyddade event (isReadOnly) gör att högtider inte kan råka raderas

**⚠️ Utmaningar:**
- Samma `<a>`-fel dök upp flera gånger — lärde mig känna igen mönstret
- Trodde koden var felfri för att tsc --noEmit sa OK — men den kollade inget (fel config)

**💡 Fel att komma ihåg:**
- En JSX-tagg måste ha BÅDE `<a>` och `</a>`
- Svenska tecken bara i kommentarer/UI-text — aldrig i variabelnamn
- Kör typkontroll med rätt config-fil (tsconfig.app.json)

**📝 Reflektion:**
Riktigt produktiv dag. Kalendern gick från att bara visa event till en komplett
funktion: skapa, redigera, radera, klick på dag för att se schemat, egen
verktygsrad med pilar, OCH riktig koptisk kalenderdata live från API. Lärde mig
react-query och try/catch på riktigt. Kändes stort att se allt fungera i
webbläsaren. Dagen är inte slut än.

**➡️ Nästa steg:**
- Synka kalendern med Google Calendar (knappen finns redan, saknar funktion än)
- Bryta ut formulär-logiken till en hook (useEventForm)
- Aktivera EventCard (oanvänd) — t.ex. lista kommande händelser
- i18next för svenska/arabiska

---

### 🗓 Onsdag–Torsdag 29–30 juli 2026 — Dag 5

**⏱ Tid:** _(fyll i timmar)_
**🎯 Mål för dagen:** Dokumentera hela projektet och spara designsystemet

**✅ Vad som gjordes:**
- Utökade REDOVISNING.md med Kalender- och Medlemmar-sidorna + motiverad teknik-tabell
- La till empty-state i BirthdayList ("Ingen fyller år denna vecka") — matchar redovisningen
- Skapade docs/AI-TOLKNING-RAPPORT.md (WebSocket, STT, DeepL — 7-stegs handlingsplan)
- Skapade docs/DESIGN.md (designsystem: färger, typografi, komponenter, 11 skärmar)
- Byggde körbar design-prototyp (client/src/design/DesignPreview.tsx) på route /design
- Anpassade prototypen till TypeScript och fixade en onClick-bugg i live-knappen
- Bytte "Pastor Erik" till "Fader Korollos" i prototypen
- Städade kommentarsreglerna i CLAUDE.md (5 punkter per funktion)
- Gjorde översättningstjänsten (DeepL) konsekvent i all dokumentation
- Kompletterade README (Felhantering, TypeScript-config, Testning + länkar till nya docs)

**🎓 Lärdomar:**
- Design-tokens (CSS-variabler) gör ljust/mörkt läge till EN ändring
- RTL för arabiska: dir="rtl" + Cairo-font, hela layouten vänds
- En prototyp kan avslöja hela appens roadmap (5 skärmar kvar att bygga)
- WebSocket i realtid kräver heartbeat, mikrobatching och backoff (från AI-rapporten)

**⚠️ Utmaningar:**
- Skulle inte skriva över befintlig README/REDOVISNING rakt av — la bara till det som saknades
- Hittade påståenden i redovisningen som inte stämde med koden (BirthdayList-fallback, statusMap) — rättade

**💡 Fel att komma ihåg:**
- Kontrollera att dokumentationen stämmer med koden innan redovisning
- Prototyp = referens med inline-styles; riktig kod använder Tailwind

**📝 Reflektion:**
Stor dokumentations- och design-sprint. Nu har projektet komplett och
sammanhängande dokumentation (README, CLAUDE, SECURITY, DESIGN, REDOVISNING,
AI-TOLKNING, NOTES) och ett tydligt designsystem med roadmap. Skönt att ha allt
samlat och konsekvent inför redovisningen.

**➡️ Nästa steg:**
- Bygga nästa skärm från prototypen (Gudstjänst eller Kommunikation)
- Sätta upp i18next (svenska/arabiska med RTL)
- Synka kalendern med Google Calendar

---

### 🗓 Torsdag 30 juli 2026 — Dag 6

**⏱ Tid:** _(fyll i timmar)_
**🎯 Mål för dagen:** Full CRUD för medlemmar, gudstjänst-modul med närvaro, samt säkerhet, tester och CI

**✅ Vad som gjordes:**

Medlemmar (full CRUD):
- AddMemberModal med Zod-validering (regex på telefon, max-gränser, lowercase-e-post)
- Skapa/redigera/radera — medlemmar ligger nu i state
- Adress-fält (typ, schema, mockdata, formulär, kort)
- MemberProfileModal: klick på rad öppnar profil med all info + Redigera/Radera
- Bekräftelse ("Är du säker?") innan radering (även i kalenderns EventModal)

Gudstjänst-modul:
- Service-typ + AddServiceModal (namn-förslag + eget namn för Fasta/Jul)
- Start- och sluttid (sluttid valfri), dagens datum som standard
- Services-sida: gruppering Kommande/Tidigare, datum-box, status-badge
- Närvaro (DEL B): AttendanceModal — bocka av Närvarande/Frånvarande, markedAt för spårbarhet

Tillgänglighet:
- Verifierade a11y-påståenden mot koden (var ärlig i redovisningen)
- Klickbara rader → tangentbords-nåbara (role="button", tabIndex, Enter/Space)
- Listor semantiska (<ul>/<li>)

Säkerhet och arkitektur:
- Nya regler i CLAUDE.md (a11y, "förklara innan du kör", "verifiera innan du påstår", Frontend/TS-säkerhet)
- lib/errorHandler.ts (logError) + lib/api.ts (safeFetch med Zod)
- Koptiska API-svaret valideras nu i runtime
- ErrorBoundary runt hela appen (class — enda undantaget)

Kvalitet:
- Vitest + första enhetstest (bevisar att ErrorBoundary inte läcker interna detaljer)
- eslint-plugin-security + CI-workflow (tsc + lint + test + npm audit)
- npm audit fix — fixade DoS-sårbarhet (brace-expansion)

**🎓 Lärdomar:**
- `Omit<Type, "id">` ger formulär-typen automatiskt (ändras Member följer NewMemberData med)
- Modal-mönstret (state + handler) fungerar för event, medlem OCH närvaro
- Error Boundaries MÅSTE vara class components — enda undantaget
- `safeFetch<T>(url, schema)` samlar fetch + felhantering + runtime-validering på ett ställe
- Klickbar rad behöver role="button" + tabIndex + Enter/Space för tangentbord
- Testa att fel INTE läcker (generellt meddelande, inte stack trace)

**⚠️ Utmaningar:**
- Påståenden i redovisningen stämde inte med koden (a11y) — fick verifiera och rätta
- Nya säkerhets-paket drog in sårbarheter — fixade den säkra, lät den brytande vara

**💡 Fel att komma ihåg:**
- Verifiera alltid mot koden innan man påstår att något är klart
- Klickbara rader behöver tangentbords-stöd
- react-router-sårbarheten gäller RSC-läge som appen inte använder — låg risk

**📝 Reflektion:**
Enormt produktivt pass. Medlemmar och Gudstjänster är nu fullständiga moduler med
CRUD och närvaro, och appen har fått riktig säkerhets-arkitektur, tillgänglighet,
tester och CI. Lärde mig särskilt värdet av att verifiera mot koden och vara ärlig
om vad som är kvar.

**➡️ Nästa steg:**
- i18next (svenska/arabiska + RTL)
- Backend (Express + Prisma) — då blir data delad mellan sidorna
- Fler enhetstester (formulär-validering, CRUD-logik)

---

### 🗓 Måndag 3 augusti 2026 — Dag 7

**⏱ Tid:** _(fyll i timmar)_
**🎯 Mål för dagen:** Fem sammanhängande sprintar — tvåspråkighet, mörkt läge + Fas 1-klart, frånvaro-orsak + Clean Architecture, strict-flaggor + WCAG-plan, kodstruktur + prestanda

**✅ Vad som blev klart:**

Pass 1 — Tvåspråkighet (i18next + RTL):
- Satte upp i18next + react-i18next (src/i18n.ts, locales/sv.ts, locales/ar.ts)
- Språkväxlare i headern (SV / AR) + automatisk RTL för arabiska (dir="rtl")
- Inter-font för svenska, Cairo-font för arabiska
- useDateTime returnerar nu en hälsnings-nyckel (morning/day/evening) istället för färdig text
- Migrerade alla sidor och komponenter: Dashboard, Medlemmar (+MemberCard, AddMemberModal, MemberProfileModal, GroupMessageModal), Kalender (+EventModal, AddEventModal, CalendarToolbar), Gudstjänster (+AddServiceModal, AttendanceModal)
- DRY-städning på vägen: kategori-texter, WhatsApp-mallar och event-kategori-texter samlade i översättnings-nycklar

Pass 2 — Mörkt läge + Fas 1 komplett:
- Tema-knapp (sol/måne) i headern + useTheme-hook som minns valet i localStorage (validerat)
- dark:-klasser kopplade till data-theme="dark" på html (Tailwind @custom-variant)
- color-scheme så webbläsarens native-kontroller följer temat
- Samlade ALLA ljus/mörk-färger i ca 15 semantiska klasser i index.css (surface, text-strong/soft/faint, text-accent, modal-backdrop, modal-panel, field, field-label, field-error, btn-primary, btn-secondary, m.fl.)
- Gjorde om alla sidor, komponenter och modaler till att använda klasserna
- Mörka regler för react-big-calendar-rutnätet
- Byggde egen Dropdown-komponent (native select gick inte att färga mörk i Chrome/macOS)
- Kortnotering per gudstjänst (använder notes-fältet som redan fanns)
- Profilbild per medlem: ny Avatar-komponent (initialer i färgcirkel) + Ta foto (mobilkamera) / Välj bild (base64, max 1 MB)
- FAS 1 KLAR: mörkt läge, flerspråkighet, profilbild, kortnotering

Pass 3 — Frånvaro-orsak + Prettier + Clean Architecture:
- Frånvaro-orsak (sjuk/resa/okänd/annat) + kontaktstatus (Ej kontaktad/Försökt/Svarat) i närvaro-modalen
- Chips visas bara för frånvarande; sparas per gudstjänst (funktion 5 nu 90 %)
- Prettier konfigurerad + pre-commit-hook (Gits core.hooksPath → .githooks + lint-staged)
- Fyra kodkvalitets-regler dokumenterade i CLAUDE.md (CSS-struktur, DRY-komponenter, linters, död kod)
- Införde domän/repository/hook-lager: entiteter i domain/, gränssnitt i domain/repositories/, mock-implementationer i data/mock/, hooks i hooks/
- Migrerade Member, Service, Contact, Birthday och Event — en i taget (pilot först)
- Alla fyra sidor hämtar nu data via hook → repository; ingen sida importerar mock direkt

Pass 4 — TypeScript strict + WCAG-plan:
- Slog på strict + 5 extra flaggor (exactOptionalPropertyTypes, noUncheckedIndexedAccess, noImplicitReturns, noImplicitOverride, noPropertyAccessFromIndexSignature)
- Åtgärdade 57 av 58 typfel — bl.a. äkta null-buggar (parts[0] i avatar, palette[i], marks[id])
- Semantiska taggar (main/header/section/ul) på alla fyra sidor + aria-label/role/aria-pressed
- Focus-trap i alla 7 modaler (focus-trap-react + role="dialog" + aria-labelledby)
- Toast-notiser (sonner) vid spara/radera
- Skeleton-komponent vid laddning
- @axe-core/react (dev-only a11y-skanner i konsolen)
- Global focus-visible-ring (WCAG 2.4.7)

Pass 5 — Kodstruktur + prestanda:
- Path aliases (@components/, @hooks/ osv i tsconfig + vite.config) — Members.tsx konverterad som exempel
- React.memo på MemberCard, StatCard och Badge
- useCallback på handleSelectMember + handleToggleSelect (stabila referenser för memo)
- lazy() + Suspense: Members, Calendar, Services och DesignPreview som separata chunks
- Ny PageLoader med Skeleton
- DOMPurify: påminnelse i ROADMAP (ingen kod nu, inga rich-text-fält än)

**💡 Fel jag löste:**
- i18next `count` triggade plural-logik — döpte om till `total`/`n` för vanlig text
- Native select-popup gick inte att styla mörk i Chrome/macOS → egen Dropdown-komponent
- Nya globala CSS-regler kan kräva omstart av dev-servern (inte bara reload)
- localStorage måste valideras i runtime (bara "light"/"dark" tillåts)
- Focus-trap i 7 modaler: uniforma edits, men enrads- vs flerrads-JSX (Prettier) krävde två anchor-varianter
- baseUrl gav TS5101 (deprecated i TS 6) — löste genom att ta bort baseUrl och göra paths-målen relativa
- Vissa npm-kommandon körde från fel mapp — tsc måste köras i client/
- Att flytta typ-filer till domain/ rörde många importer — löste med sed + tsc-verifiering

**🎓 Vad jag lärde mig:**
- Repository-gränssnitt gör UI oberoende av datakällan — byt mock mot API utan att röra sidor
- Async (Promise) i repository-metoderna från början → samma kod funkar vid backend
- Migrera en entitet i taget (pilot) = lättare att förstå och lägre risk
- Tailwind v4: @custom-variant dark ger manuell toggle
- @apply funkar i egna klasser (@layer components) — samlar färgkombinationer på ett ställe
- FileReader.readAsDataURL ger base64 data-URL (hålls i minnet tills backend finns)
- capture="environment" på ett fil-fält öppnar kameran på mobil
- exactOptionalPropertyTypes: optionella datafält som får hålla "inget värde" typas som T | undefined
- noUncheckedIndexedAccess fångar riktiga undefined-buggar vid array/objekt-indexering
- focus-trap-react fångar fokus i modaler (WCAG 2.4.3) — lag för offentlig sektor
- sonner har inbyggd a11y (role=status / aria-live)
- @axe-core/react körs bara i import.meta.env.DEV — aldrig i prod-bundlen
- React.memo hjälper bara om props är stabila — annars behövs useCallback på handlers
- lazy() med named export kräver `.then(m => ({ default: m.X }))`
- I TypeScript 6 är `baseUrl` deprecated — `paths` funkar ändå men målen måste vara relativa

**📝 Reflektion:**
Ett gigantiskt arbetspass. Appen gick från "svensk enkelspråkig" till komplett tvåspråkig
(svenska + arabiska + RTL), fick fullt mörkt läge, familjekoppling + WhatsApp, profilbilder,
frånvaro-orsak, egen designsystem-arkitektur (domain + use-cases + repositories), maxad
typsäkerhet med riktiga latenta buggar åtgärdade, hela WCAG-planen på plats (focus-trap,
semantik, skeleton, toast, axe), och prestanda-optimeringar (lazy, memo, code-splitting).
Fas 1 är komplett. Bygget är fortfarande grönt: tsc 0 fel, lint 0, 11 tester, build ✅.

**➡️ Nästa steg:**
- Konvertera resten av importerna till path aliases (filvis, en sida per gång)
- Datum-format per språk (arabiska månader och siffror)
- Zod-felmeddelanden via översättningar
- Backend (Express + Prisma) + api-repositories
- Historikkort med graf (Recharts, redan installerat)
- Testa focus-trap live i webbläsaren (React 19 + focus-trap-react är nytt)
- Testa profilbild-kameran på riktig mobil
- color-contrast-fixet från axe (väntar på element-info)

---

### 📌 Pass 6 — Dokumentation-städ + WCAG-analys + verktygs-stack-analys

**⏱ Tid:** ca 11 timmar (11:00-22:00, med pauser)

**🎯 Mål:**
- Städa och synka all projektdokumentation
- Räkna WCAG-kontrast på hela "Varm Olivsten"-paletten
- Analysera mot rekommenderad best-practice verktygs-stack

**✅ Vad blev klart:**
- Skrev CHANGELOG 0.4.0 med allt sedan 30 juli (i18n, mörkt läge, Clean Architecture, WhatsApp, Avatar, Skeleton, sonner, axe-core, focus-trap, strict-flaggor)
- 18 doc-fixar på 8 filer (README, CHANGELOG, CV-BULLETS, DESIGN, TROUBLESHOOTING, ROADMAP, DAGBOK, client/README)
- STT-beslut fastställt: Speechmatics valdes efter dialektanalys — 11 filer synkade
- Skapade tre parallella instruktionsfiler:
  - `docs/UX-A11Y-INSTRUKTION.md` (10 steg — semantik, focus-trap, textstorlek m.m.)
  - `docs/KODSTRUKTUR-INSTRUKTION.md` (10 steg — path aliases, memo, ErrorBase, Semgrep, Lighthouse, Snyk)
  - `docs/FARG-OCH-DESIGN-ATT-GORA.md` (16 steg — koppar-kontrast, bottennav, färgblindhet m.m.)
- WCAG-kontrast räknad på 19 kombinationer — kritisk fail hittad: röd-mörkt #A05858 = 2.98:1
- Verktygs-stack-analys mot rekommenderad best-practice-stack — 8 saknade punkter identifierade

**💡 Vad jag lärde mig:**
- Doc-städ tar längre tid än man tror men är superviktigt inför LIA
- WCAG-kontrast måste testas i BÅDA lägen (ljust + mörkt), inte bara ljust
- Semgrep fångar säkerhetsmönster som ESLint missar
- shadcn/ui är battle-tested men matchar inte varje designspråk

**🔧 Fel jag löste:**
- Datum-fel i CHANGELOG (0.3.0 vs verkligt datum)
- Motsägelse mellan AI-TOLKNING-RAPPORT (Speechmatics) och alla andra filer (Deepgram)
- 7 kosmetiska fel i README, CV-BULLETS, DAGBOK

**📝 Reflektion:**
Idag var en stor dokumentations-dag. Har nu tre parallella att-göra-listor som stegvis guidar genom UX-, kod- och designarbete. Fastnade lite på Snyk-diskussionen — bra att fråga.

**➡️ Nästa steg:**
- Fixa röd-mörkt-fail (Steg 15 i FARG-OCH-DESIGN)
- Börja med bottennavigering (Steg 2 samma fil)
- Committa alla docs-ändringar

---

### 🗓 Måndag 4 augusti 2026 — Dag 12

**⏱ Tid:** _(fyll i)_
**🎯 Mål för dagen:** UX/design-steg (FARG-OCH-DESIGN) + felhantering + radera-gudstjänst

**✅ Vad som gjordes:**

UX-A11Y Steg 10:
- Inställbar textstorlek (80–200 %) via useFontScale + CSS-variabeln --font-scale (WCAG 1.4.4)

FARG-OCH-DESIGN (6 steg):
- Steg 2 — Bottennavigering för mobil (BottomNav, md:hidden, fasta ikon-flikar)
- Steg 3 — Färgblindhet: ikoner på status-badges (kontaktstatus + närvaro)
- Steg 4 — Toast vid fel (toast.error + try/catch i alla CRUD-handlers)
- Steg 6 — EmptyState-komponent (Members + Services)
- Steg 8 — Formulär-förenkling: expanderbara valfria fält i AddMemberModal + inputMode
- Steg 9 — Visuell hierarki: Cormorant Garamond på rubriker (implementerar designsystemet)

Ny funktion + fixar:
- Radera gudstjänst genom alla fyra Clean Architecture-lager + bekräftelse på raden
- Suspense flyttad in i Layout (header + main står kvar under laddning; fixade axe-landmark)
- Flera kontrast-fixar (text-faint → text-soft där texten låg på beige bakgrund + ikon-knappar)

**🎓 Lärdomar:**
- text-faint (stone-500) klarar 4.80:1 på vitt men bara 4.40:1 på beige (stone-100) — under AA
- Suspense ovanför Routes byter ut HELA appen; lägg den runt Outlet så skalet står kvar
- Status via ikon + text = färgblind-säkert (WCAG 1.4.1)
- Cormorant saknar arabiska tecken → arabiska rubriker faller tillbaka till Cairo
- Clean Architecture gör ny CRUD-metod enkel: interface → mock → hook → sida

**⚠️ Utmaningar:**
- Kontrast-fyndet återkom flera gånger — löstes genom att räkna exakt kontrast per bakgrund
- Doc:ens färg-steg bygger på CSS-variabler som inte finns i koden → måste översättas

**💡 Fel att komma ihåg:**
- Verifiera kontrast mot RÄTT bakgrund (kort = vitt, sida = beige) — inte bara "på vitt"
- Radering bör städa relaterad data (närvaro-poster) — inte lämna föräldralösa rader

**📝 Reflektion:**
Stor design/UX-dag. Appen känns mer färdig nu: mobilnav, tydliga tomma vyer, feedback vid fel,
snabbare formulär, elegant rubrik-typsnitt och skarpare kontraster. Radera-gudstjänst var ett
bra exempel på hur enkelt Clean Architecture gör en ny funktion.

**➡️ Nästa steg:**
- Beslut om färgsystemet (så Steg 1/5/11/15 kan göras rätt mot Tailwind)
- Eller: börja på backend (Express + Prisma)

---

### 🗓 Måndag 4 augusti 2026 — Dag 13 (forts.)

**⏱ Tid:** _(fyll i)_
**🎯 Mål:** Typad felhantering (ErrorBase) + slutföra kontrast-fixar

**✅ Vad som gjordes:**

KODSTRUKTUR Steg 6 — ErrorBase-mönster:
- Felklasser i lib/errors.ts (AppError, ValidationError, NetworkError, AuthError)
- safeFetch kastar NetworkError; getErrorMessageKey (DRY) ger rätt toast-meddelande per feltyp
- Alla 10 CRUD-handlers använder hjälpfunktionen; nya nycklar errorValidation/errorAuth

Kontrast (WCAG AA):
- text-faint mörkad centralt i index.css (#726a60) → klarar 4.5:1 på alla bakgrunder
- Tog bort opacity-75 på StatCard-etiketterna — opacitet sänkte kontrasten under 4.5

**🎓 Lärdomar:**
- Parameter-properties (constructor(public x)) funkar INTE med erasableSyntaxOnly — deklarera fält explicit
- Opacitet på liten text = klassisk kontrast-fälla (blandar färgen mot bakgrunden)
- instanceof-check kräver riktiga klasser — därför ErrorBase
- Samla instanceof-logiken på ETT ställe (getErrorMessageKey) = DRY

**⚠️ Utmaningar:**
- Kontrast-fyndet återkom flera gånger — löstes systematiskt (grep efter opacity- på text hittade boven)

**📝 Reflektion:**
Felhanteringen är nu förberedd för backend: när api-repositories via safeFetch kommer får användaren
automatiskt rätt meddelande (nätverk/validering/auth). Kontrast-jakten lärde mig att gräva systematiskt
istället för att gissa.

**➡️ Nästa steg:**
- Committa (ErrorBase + kontrast-fixar)
- Färgsystem-beslut eller backend

---

### 🗓 Onsdag 5 augusti 2026 — Dag 14

**⏱ Tid:**
**🎯 Mål för dagen:** Bli klar med dashboarden mot riktig data (frontend-först).

**✅ Vad som gjordes:**
- Granskade dokumentationen (ROADMAP → BACKLOG → detaljfiler) — hittade 6 motsägelser att rätta
- Dashboard kopplad till riktig data via use-case + hook (bort med hårdkodade 47/38/5)
- Två nya widgets: Kommande gudstjänster (klickbara) + Senaste kontakter
- Veckonärvaro-graf med Recharts (tema-reaktiv, a11y via role=img + sammanfattning)
- Kontaktknappar Ring/Mejla/WhatsApp på varje kontakt (återanvänder lib/whatsapp)
- Frånvaro-regel: "Att kontakta" genereras automatiskt från närvaro (ej närvarat 4 veckor)
- DRY-städning: .date-box-klass, delad contactStatus, formatShortDate, ContactActions
- 22 tester gröna, tsc + ESLint + bygge rent

**🎓 Lärdomar:**
- Ren logik i use-cases gör allt testbart utan React
- Recharts blir tema-reaktiv via currentColor + befintliga temaklasser (inte JS-tema)
- Vites HMR klarar inte när en export försvinner — kräver full omladdning

**⚠️ Utmaningar:**
- HMR-cachen hängde sig efter att en export togs bort (löstes med hård-omladdning)
- Axe visade två a11y-fel som inte fanns i koden — troligen gamla logg-rader i konsolen

**📝 Reflektion:**
Dashboarden gick från statiska siffror till en levande vy som svarar på frågor: vem kommer,
vem saknas, vem behöver kontaktas. Frånvaro-regeln knyter ihop hela flödet
närvaro → påminnelse → kontakt. Ren arkitektur (use-cases → hook → sida) gjorde varje steg litet.

**➡️ Nästa steg:**
- Fixa dokumentations-motsägelserna (backend-vecka m.m.)
- Steg C: snooza/klar + "dagens X kontakter"
- Fortsätta resten av frontend mot mockdata

---

### 🗓 Torsdag 6 augusti 2026 — Dag 15

**⏱ Tid:**
**🎯 Mål för dagen:** Bygga vidare på dashboarden och starta Modul 2 (Gudstjänst-sidan).

**✅ Vad som gjordes:**
- Steg C: "Att kontakta" blev en arbetslista (Klar/Snooza + dagens X, sorterad efter frånvaro)
- Flyttade närvaro-avprickningen till Dashboard (eget Närvaro-kort)
- DRY-städning: bröt ut AddButton, ModalCloseButton, DeleteEditActions och Chip (7 modaler + 3 sidor)
- Strukturerade om Gudstjänst-sidan: klick → egen detaljsida (planering), ingen närvaro där
- Ny modul: Noteringar per gudstjänst (typ + privat/offentlig + sök) via Clean Architecture
- Planering-panel: högtid + bibeltexter på gudstjänsten
- Predikobibliotek: ny Predikningar-sida med metadata, sök och filter (5:e nav-fliken)
- 30 tester gröna, tsc + lint + bygge rent hela vägen

**🎓 Lärdomar:**
- Tydlig ansvarsdelning (Dashboard = närvaro, Gudstjänst = planering) gör appen lättare att navigera
- Att bryta ut återkommande knappar tidigt sparar mycket dubblering senare
- Samma mönster (domän → repository → hook → sida) gör varje ny modul snabb att bygga

**⚠️ Utmaningar:**
- Stor omstrukturering i flera faser — löstes genom att verifiera (tsc/lint/tester) efter varje steg

**📝 Reflektion:**
Appen känns nu som en riktig produkt med fem tydliga delar. Modul 2 har fått planering, noteringar
och ett predikobibliotek. Arkitekturen håller — nya moduler byggs på samma säkra mönster.

**➡️ Nästa steg:**
- Fler Modul 2-bitar (streaming, publicera för medlemmar) eller närma sig backend
- Fixa dokumentations-motsägelserna (backend-vecka m.m.)

---

### 🗓 Torsdag 6 augusti 2026 — Dag 15 (forts.)

**🎯 Mål för dagen:** Komma så långt som möjligt mot att frontend är klar.

**✅ Vad som gjordes:**
- Sakramentsregister — 9 typer (dop, myrrasmörjelse, första nattvard, bikt, äktenskap,
  prästvigning, sjuksmörjelse, begravning, övrigt), fält per typ, bikt-sekretess, GDPR-samtycke
- Översiktssida /sacraments (läs-endast, filter typ + år) för statistik/export
- Medlems-detaljsida (/medlemmar/:id) — profilinnehållet flyttat från modal, MemberProfileModal borttagen
- Kalender-synk: gudstjänster + sakrament visas i kalendern (färgkodade, läs-endast)
- Manuella påminnelser (påminnelse/sorg/åtagande) + anteckningar-i-vyn för "Att kontakta"
- Startsidan omstrukturerad pedagogiskt: "Att göra idag"-översikt + zonerna Att göra / Överblick
- Medlemsfält: status (aktiv/inaktiv), språkpreferens (6 språk), föredraget namn + status-filter
- Familjeroller (make/maka, barn, förälder, syskon) som visas i familjelistan
- Dokumenterade alla backend-krav i docs/BACKEND-ATT-GORA.md
- 47 tester gröna, tsc + lint + bygge rent hela dagen

**🎓 Lärdomar:**
- Samma mönster (domän → repository → hook → sida) gör att nya moduler går snabbt och tryggt
- Axe-felen (button-name, tabindex) kom från react-big-calendar, inte egen kod
- Bikt visar hur sekretess byggs in i datamodellen (innehåll lagras aldrig)

**⚠️ Utmaningar:**
- Stor omstrukturering (medlemsmodal → detaljsida) — löstes fas för fas med verifiering
- Mycket ocommittat mellan varven — viktigt att committa oftare

**📝 Reflektion:**
Frontend är nu nära komplett: Dashboard, Medlemmar (+detaljsida), Kalender, Gudstjänster
(+detaljsida), Predikningar och Sakrament. Nästa stora fas är backend — allt som återstår
(multi-kyrka, auth, kryptering, AI, SMS, Google-synk) är samlat i BACKEND-ATT-GORA.md.

**➡️ Nästa steg:**
- Committa dagens arbete
- Fixa dokumentations-motsägelserna (backend-vecka m.m.)
- Påbörja backend (Express + Prisma) enligt BACKLOG + BACKEND-ATT-GORA

---

### 🗓 Torsdag 6 augusti 2026 — Dag 15 (forts. 2)

**🎯 Mål för dagen:** Bygga de sista frontend-funktionerna i ordning.

**✅ Vad som gjordes:**
- Cirkeldiagram på startsidan (medlemsfördelning per kategori) — klick på ett segment
  öppnar medlemslistan filtrerad på kategorin (via ?kategori= i URL:en)
- Juliansk datum-konvertering (utils/calendarConvert) — visar juliansk motsvarighet
  i händelse-modalen när juliansk kalender är vald
- Sammanfattningsrapport per gudstjänst — närvarograd jämförd med snittet av alla
  gudstjänster (över/under/lika, med ikon och färg)
- Zod-fel via i18n — global felkarta (zodErrorMap) översätter valideringsfel efter
  feltyp; hårdkodade svenska meddelanden borttagna ur alla 6 formulär-schemana
- 61 tester gröna, tsc + lint + bygge rent

**🎓 Lärdomar:**
- Zod 4 sätter en global felkarta med z.config; ett schema-eget meddelande vinner alltid
  över kartan, så meddelandena måste bort ur schemana för att översättningen ska slå igenom
- Samma återanvändbara diagram-komponent kan visa flera fördelningar (DRY)

**📝 Reflektion:**
Fyra av fem sista punkter klara. Kvar: AI-tolkning live (mock) — den största,
med publik projektor-vy. Valde att pausa och stämma av vy-upplägget först.

**➡️ Nästa steg:**
- Bestämma vy-upplägg för AI-tolkning live (två vyer vs en)
- Bygga AI-tolkning live (mock)

---

### 🗓 Torsdag 6 augusti 2026 — Dag 15 (forts. 3)

**🎯 Mål för dagen:** Bygga AI-tolkning live klart och göra liturgin realistisk.

**✅ Vad som gjordes:**
- AI-tolkning live (mock) komplett: kontrollpanel, projektor-vy och YouTube-vy
- Riktningsväljare AR↔SV, talar-tagg (präst/diakon i olika färg), partial→final
- Projektor: mörkt olivsten-tema, Amiri för arabiska rubriker, AAA-kontrast, rullande
  text som stannar kvar (så långsamma läsare hinner med)
- Inställningar blev en utfällbar sido-panel (nåbar från alla sidor) med toggle,
  slider och segmented controls
- Liturgi-manus med tre flikar: Bibliotek, Dokument (PDF) och Manuellt
- Läste in riktig liturgi-data: Agbeya-samlingen normaliseras (join av tabeller)
- Insåg att präster inte hanterar JSON → bytte till PDF-uppladdning
- Kopplade förberedd liturgi till projektorn: fasta delar visas utan AI, AI bara för predikan
- Dokumenterade backend-krav (BACKEND-ATT-GORA §12–13) + CHANGELOG 0.5.0

**🎓 Lärdomar:**
- Var realistisk för användaren: en präst vet inte vad en JSON-fil är — dokument/PDF passar
- Förberedd text som visas direkt gör AI-tolkningen både billigare och mer korrekt
- Normaliserad data (sentences + relations) måste joinas ihop, precis som i en databas

**📝 Reflektion:**
Stor dag. AI-tolkningen känns nu som en helhet: förberedd liturgi + live-AI för predikan.
Att bygga mot mock först gör att backend bara behöver byta ut datakällan sen.

**➡️ Nästa steg:**
- Normalisera fler liturgi-samlingar (katameros, kholagy, stilla-veckan)
- Backend: STT + DeepL + WebSocket enligt AI-TOLKNING.md

---

## 📋 Mall för nya dagar

Kopiera detta block och klistra in högst upp under "Dag-för-dag":

```markdown
### 🗓 [Veckodag] [DD månad] 2026 — Dag [N]

**⏱ Tid:**
**🎯 Mål för dagen:**

**✅ Vad som gjordes:**
-

**🎓 Lärdomar:**
-

**⚠️ Utmaningar:**
-

**💡 Fel att komma ihåg:**
-

**📝 Reflektion:**


**➡️ Nästa steg:**
-

---
```

---

## 🎯 Milstolpar (fylls i vid stora ögonblick)

- [ X] Första ParishHub-sidan på skärmen — **22 juli 2026** ✅
- [x] Första CRUD-funktionen klar (kalender: skapa/läsa/redigera/radera) — **28 juli 2026** ✅
- [x] Fullständig projektdokumentation + säkerhetsstandard klar — **28 juli 2026** ✅
- [x] Medlems-CRUD + Gudstjänst-modul med närvaro klara — **30 juli 2026** ✅
- [x] Säkerhets-arkitektur, tillgänglighet, tester och CI på plats — **30 juli 2026** ✅
- [x] Tvåspråkig app (svenska/arabiska + RTL) på alla sidor — **3 augusti 2026** ✅
- [x] Mörkt läge på hela appen (tema-knapp + DRY färgklasser + egen dropdown) — **3 augusti 2026** ✅
- [x] Fas 1 komplett (mörkt läge, flerspråkighet, profilbild, kortnotering) — **3 augusti 2026** ✅
- [x] Clean Architecture på alla sidor (domän · repository · hook) — **3 augusti 2026** ✅
- [x] Maxad TypeScript-strict + hela WCAG/a11y-planen (9 steg) — **3 augusti 2026** ✅
- [x] Kodstruktur + prestanda-optimering (aliases, memo, code-splitting) — **3 augusti 2026** ✅
- [x] UX/design-pass (mobilnav, färgblind-badges, EmptyState, felhantering, radera-gudstjänst, rubrik-typsnitt) — **4 augusti 2026** ✅
- [x] Fullständig dokumentations-städ + WCAG-kontrast räknad + 3 att-göra-listor för UX/kod/design — **3 augusti 2026** ✅
- [x] Dashboard komplett: statistik, widgets, närvarograf, kontaktkanaler och automatiska frånvaro-påminnelser — **5 augusti 2026** ✅
- [x] Modul 2 (Gudstjänst): planering, noteringar per gudstjänst & sökbart predikobibliotek — **6 augusti 2026** ✅
- [x] Sakramentsregister (9 typer, översikt, GDPR) + Påminnelser & regler + kalender-synk — **6 augusti 2026** ✅
- [x] Modul 3 (Medlemmar): detaljsida, status/språk/föredraget namn, familjeroller + pedagogisk startsida — **6 augusti 2026** ✅
- [x] Sista frontend-passet: medlemsdiagram, juliansk kalender, gudstjänst-rapport & översatta valideringsfel (Zod-i18n) — **6 augusti 2026** ✅
- [x] AI-tolkning live (mock) komplett: kontroll + projektor + YouTube, riktning, talare, rullande text — **6 augusti 2026** ✅
- [x] Liturgi-manus (bibliotek/dokument/manuellt) + Agbeya-data normaliserad + kopplad till live-projektorn — **6 augusti 2026** ✅
- [ ] Första Express-servern igång
- [ ] Första databaskopplingen till PostgreSQL
- [ ] Första JWT-inloggningen fungerar
- [ ] Första AI-tolkningen live via Speechmatics
- [ ] Första gången någon annan använder appen
- [ ] Appen används i riktig gudstjänst
- [ ] Appen släppt i App Store / Google Play

---
