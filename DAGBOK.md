# 📔 Dagbok — ParishHub

> **Syfte:** Daglig utvecklingslogg + milstolpar för LIA-material.
> **Använd när:** du vill komma ihåg vad som hände, se din progress.
> **Uppdatera:** i slutet av varje arbetsdag (5-10 meningar räcker).

Det här är min personliga logg över resan att bygga Kyrko-appen.
Jag skriver den själv, från första dagen och hela vägen till lansering.

**Varför jag skriver den:**
- För att reflektera över vad jag lär mig
- För att fånga det som är svårt, och hur jag löser det
- För att kunna visa min progression för LIA-handledare och arbetsgivare
- För att kunna blicka tillbaka när projektet är klart

**Hur jag skriver:**
- Kort räcker (5-10 meningar per dag)
- Ärligt — även de svåra dagarna får plats
- På svenska
- Ingen prestation krävs — även en vilodag får loggas

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
**🎯 Mål för dagen:** Sätta upp projektstruktur och få upp min första React-sida

**✅ Vad jag gjorde:**
Idag lade jag hela grunden. Jag skapade GitHub-repot (ParishHub) och byggde upp
monorepo-strukturen med `client/` och `server/`. Sedan skrev jag CLAUDE.md med alla
mina projektregler, och samlade dokumentationen i en `docs/`-mapp (ARCHITECTURE,
TROUBLESHOOTING, API).

- Konfigurerade behörigheter (.claude/settings.json)
- Skapade min första skill (parishhub-regler) och slash-kommandon (/granska, /kommentera, /förklara)
- Skrev README och CHANGELOG
- Installerade Vite + React + TypeScript, plus 15 npm-paket (React Router, i18next, Tailwind m.m.)
- Konfigurerade Tailwind CSS v4
- Fick upp den allra första ParishHub-sidan på skärmen ✨

**🎓 Lärdomar:**
- Monorepo-struktur är enklare än det låter — det är bara två mappar (client + server)
- Deepgram är mycket snabbare än Whisper för live-tolkning
- DeepL är bättre än OpenAI för svensk översättning
- Att skriva CLAUDE.md redan från början sparar massor av tid senare

**⚠️ Utmaningar:**
- Jag blev osäker på om jag skulle bygga backend eller frontend först
- Mitt i insåg jag att ett monorepo (både client + server) är bättre än att dela upp dem
- Jag fick byta namn från ParishHub-server till ParishHub på GitHub

**💡 Fel att komma ihåg:**
- Inget stort fel idag — en riktigt bra dag där jag mest la upp projektstrukturen!

**📝 Reflektion:**
Första dagen! Det kändes stort att få igång hela grundstrukturen på en enda dag. Extra
härligt var att se den första sidan dyka upp på skärmen med rätt färger. Framför allt
lärde jag mig att dokumentation från början sparar mycket huvudvärk senare.

**➡️ Nästa steg:**
- Bygga min första riktiga sida (Dashboard) från mockupen
- Sätta upp React Router för navigation

---

### 🗓 Torsdag 23 juli 2026 — Dag 2

**⏱ Tid:** ca 3 timmar
**🎯 Mål för dagen:** Bygga Dashboard-grunden med React Router och statistikkort

**✅ Vad jag gjorde:**
Jag startade Vite-servern och kollade att gårdagens setup fortfarande fungerade — skönt.
Sedan byggde jag upp mappstrukturen (src/pages/, src/components/, src/hooks/, src/types/)
och min första Dashboard-sida.

- Satte upp React Router i App.tsx
- Skapade en Layout-komponent med gemensam header och nav-länkar
- Lärde mig hur `<Outlet />` fungerar — sidan sätts in där i Layout
- Byggde StatCard som en återanvändbar komponent (DRY-principen på riktigt)
- La till tre statistikkort: Medlemmar, Närvarande, Att kontakta
- Bytte "Pastor Erik" mot "Fader Korollos" i koden och i mina Project Instructions

**🎓 Lärdomar:**
- React Router använder `<Outlet />` som platshållare där sidan visas
- En Layout-komponent gör att header/nav skrivs EN gång och återanvänds automatiskt
- Props = information som skickas IN till en komponent
- TypeScript-interface ser till att komponenten får rätt data
- Jag bygger med mockdata först — riktig data från databasen kommer senare (v.5-6)

**⚠️ Utmaningar:**
- Jag blev först osäker på om siffran "47 medlemmar" var fast — sedan insåg jag att det är mockdata som byts ut när backend finns
- Jag behövde få koden förklarad INNAN jag klistrade in den — bra påminnelse för framtiden

**💡 Fel att komma ihåg:**
- Inget stort fel — en bra dag!

**📝 Reflektion:**
En bra dag med tydlig progress. Det var kul att se riktiga komponenter växa fram på skärmen.
DRY-principen började verkligen sitta — StatCard skrev jag EN gång och använde tre gånger.
Nu känner jag att det här är rätt sätt att bygga.

---

### 🗓 Lördag 25 juli 2026 — Dag 3

**⏱ Tid:** ca 4 timmar
**🎯 Mål för dagen:** Bygga hela Dashboard klar med alla tre huvudkomponenter

**✅ Vad jag gjorde:**
Dagen började med lektioner på Scrimba, där jag gick igenom refaktorering, att typa
funktioner och att typa useState i React. Sedan satte jag igång med Dashboard.

- Byggde StatCard-komponenten med props och färg-mappning
- Bytte StatCard och BirthdayList till lucide-react-ikoner i stället för emojis
- La till fler kommentarer på svenska (objektivt språk)
- Skapade min första custom hook, useDateTime — dynamiskt datum och hälsning
- Byggde Badge-komponent för återanvändbara statusetiketter
- Byggde PriorityList-komponent med ett statusMap-mönster
- Skapade TypeScript-typerna Birthday, Contact och ContactStatus
- Uppdaterade CLAUDE.md och mina Project Instructions med regeln: kod på engelska, kommentarer på svenska
- Skrev en professionell REDOVISNING.md och en privat NOTES.md (i gitignore) för egna anteckningar
- Testade ring-knappen — den fungerar i webbläsaren (öppnar telefonen)

**🎓 Lärdomar:**
- Custom hooks separerar logik från JSX — kodregeln blir tydlig i praktiken
- `Record<K, V>` är TypeScript-typen för mappnings-tabeller
- En Icon-prop med stor bokstav signalerar att det är en komponent
- Union types (t.ex. `"red" | "blue"`) begränsar vad som kan skickas in
- Jag ska undvika svenska tecken i variabelnamn och template literals
- lucide-react-ikoner ser proffsigare ut än emojis (de går att färglägga)
- statusMap-mönstret är mycket snyggare än if/else-kedjor

**⚠️ Utmaningar:**
Jag stötte på flera fel som tog tid att felsöka:
- En fil sparad som .ts i stället för .tsx (JSX fungerade inte)
- Template literals med svenska tecken gav parser-fel i Vite/OXC
- Jag klistrade in fel kod (Badge) i fel fil (PriorityList) — hittade det med `cat`

Jag blev också osäker igen på om "47 medlemmar" skulle vara dynamisk — men landade i att mockdata byts mot databas i vecka 5-6.

**💡 Fel att komma ihåg:**
- KOLLA ALLTID filnamnet — .ts vs .tsx är stor skillnad
- Använd `cat` i terminalen för att se vad som FAKTISKT ligger i en fil
- Kod på engelska, kommentarer på svenska — sätt regeln FÖRST innan man börjar koda

**📝 Reflektion:**
En bra dag med mycket lärande. Dashboard är HELT klar med alla tre kärnkomponenter.
Det kändes särskilt bra att bygga min custom hook — jag förstod direkt varför regeln
"logik i hooks, JSX bara för visning" är viktig. Koden blir så mycket lättare att läsa.
Ring-knappen som faktiskt ringde när jag klickade var ett litet magiskt ögonblick.
Jag skapade också två sorters dokumentation: en för redovisning (offentlig) och en för
mig själv (privat, i gitignore).

**➡️ Nästa steg:**
- Skapa Medlemmar-sidan (/medlemmar) — börja enkelt
- Skapa Kalender-sidan (/kalender)
- Sätta upp i18next för svenska/arabiska
- Fundera på att flytta mockdata till en Context i stället för direkt import

---

### 🗓 Tisdag 28 juli 2026 — Dag 4

**⏱ Tid:** 6 timmar
**🎯 Mål för dagen:** Bygga klar kalendern med full CRUD, koptisk kalenderdata och tydlig navigering

**✅ Vad jag gjorde:**
Det här blev en riktigt fullmatad dag. Jag började med att rätta flera JSX-fel där
öppningstaggen `<a>` saknades (BirthdayList, MemberCard), och byggde klart EventModal
som var avhuggen mitt i koden. Sedan gjorde jag kalendern levande.

- Gjorde kalendern till en controlled component — vy-växling (Månad/Vecka/Dag) och Idag/Nästa fungerar nu
- Byggde AddEventModal — formulär för nya event med Zod-validering
- Flyttade events till useState så nya kan läggas till
- La till Redigera och Radera — full CRUD i kalendern
- Återställde svenska tecken (åäö) i alla 23 filer (kommentarer + UI-text)
- La till funktions-kommentarer och "Används av:"-rader i hela klienten
- DRY: samlade kategori-etiketter i en gemensam fil (eventCategories.ts)
- Löste editor-varningar (JSON-kommentarer via .vscode/settings.json, es2023-larm)
- Kopplade in KOPTISKA HÖGTIDER via coptic.io-API (react-query + useCopticCelebrations)
- Satte upp react-query (QueryClientProvider) för API-cachning
- Byggde en egen verktygsrad (CalendarToolbar) med pil-knappar och vy-växlare
- Gjorde dagarna klickbara — klick på en dag byter till dag-vyn
- Samlade alla API-anrop i src/api/copticApi.ts med try/catch + console.error
- Skrev en komplett kodkarta över alla filer i NOTES.md
- Sparade min plan för i18next (svenska/arabiska) till senare
- Stärkte säkerhetsreglerna i CLAUDE.md och skapade docs/SECURITY.md (backend-checklista + GDPR)
- Kompletterade README.md (felhantering, TypeScript-config, testning)
- Rättade dokumentationen: översättningstjänsten är DeepL (inte OpenAI)

**🎓 Lärdomar:**
- `verbatimModuleSyntax` kräver `import type` för typer
- Controlled component = state styr vad som visas, inte bara startvärdet
- Zod `safeParse` ger validering med mina egna svenska felmeddelanden
- Immutable update: `setEvents(prev => [...prev, nytt])`
- Rätt typkontroll är `tsc -p tsconfig.app.json` — inte från roten
- react-query: `queryKey` = namnet i cachen, `staleTime` = hur länge datan är färsk
- try/catch fångar fler fel än if — även när nätet dör innan svaret kommer
- Externa API-anrop samlas i src/api/ — lättare att hitta och felsöka
- En egen verktygsrad kopplas in via `components={{ toolbar: ... }}`
- Skrivskyddade event (isReadOnly) gör att högtider inte kan råka raderas

**⚠️ Utmaningar:**
- Samma `<a>`-fel dök upp flera gånger — men jag lärde mig känna igen mönstret
- Jag trodde koden var felfri för att `tsc --noEmit` sa OK — men den kollade inget (fel config)

**💡 Fel att komma ihåg:**
- En JSX-tagg måste ha BÅDE `<a>` och `</a>`
- Svenska tecken bara i kommentarer/UI-text — aldrig i variabelnamn
- Kör typkontroll med rätt config-fil (tsconfig.app.json)

**📝 Reflektion:**
En riktigt produktiv dag. Kalendern gick från att bara visa event till en komplett
funktion: skapa, redigera, radera, klicka på en dag för att se schemat, egen verktygsrad
med pilar OCH riktig koptisk kalenderdata live från ett API. Jag lärde mig react-query
och try/catch på riktigt idag. Det kändes stort att se allt fungera i webbläsaren.

**➡️ Nästa steg:**
- Synka kalendern med Google Calendar (knappen finns redan, saknar funktion än)
- Bryta ut formulär-logiken till en hook (useEventForm)
- Aktivera EventCard (oanvänd) — t.ex. lista kommande händelser
- i18next för svenska/arabiska

---

### 🗓 Onsdag–Torsdag 29–30 juli 2026 — Dag 5

**🎯 Mål för dagen:** Dokumentera hela projektet och spara mitt designsystem

**✅ Vad jag gjorde:**
En stor dokumentations- och design-dag. Jag ville få allt samlat och konsekvent inför
redovisningen, och passade på att skapa en körbar design-prototyp.

- Utökade REDOVISNING.md med Kalender- och Medlemmar-sidorna + en motiverad teknik-tabell
- La till en empty-state i BirthdayList ("Ingen fyller år denna vecka") — matchar redovisningen
- Skrev en handlingsplan för AI-tolkningen (WebSocket, STT, DeepL — 7 steg)
- Skapade docs/DESIGN.md (designsystem: färger, typografi, komponenter, 11 skärmar)
- Byggde en körbar design-prototyp (client/src/design/DesignPreview.tsx) på route /design
- Anpassade prototypen till TypeScript och fixade en onClick-bugg i live-knappen
- Bytte "Pastor Erik" till "Fader Korollos" i prototypen
- Städade kommentarsreglerna i CLAUDE.md (5 punkter per funktion)
- Gjorde översättningstjänsten (DeepL) konsekvent i all dokumentation
- Kompletterade README (Felhantering, TypeScript-config, Testning + länkar)

**🎓 Lärdomar:**
- Design-tokens (CSS-variabler) gör ljust/mörkt läge till EN ändring
- RTL för arabiska: `dir="rtl"` + Cairo-font vänder hela layouten
- En prototyp kan avslöja hela appens roadmap (5 skärmar kvar att bygga)
- WebSocket i realtid kräver heartbeat, mikrobatching och backoff

**⚠️ Utmaningar:**
- Jag ville inte skriva över befintlig README/REDOVISNING rakt av — la bara till det som saknades
- Jag hittade påståenden i redovisningen som inte stämde med koden (BirthdayList-fallback, statusMap) — och rättade dem

**💡 Fel att komma ihåg:**
- Kontrollera att dokumentationen stämmer med koden innan redovisning
- Prototyp = referens med inline-styles; riktig kod använder Tailwind

**📝 Reflektion:**
Nu har projektet en komplett och sammanhängande dokumentation, och ett tydligt designsystem
med en roadmap. Det känns skönt att ha allt samlat och konsekvent inför redovisningen —
lite som att städa skrivbordet innan man börjar på riktigt.

**➡️ Nästa steg:**
- Bygga nästa skärm från prototypen (Gudstjänst eller Kommunikation)
- Sätta upp i18next (svenska/arabiska med RTL)
- Synka kalendern med Google Calendar

---

### 🗓 Torsdag 30 juli 2026 — Dag 6

**🎯 Mål för dagen:** Full CRUD för medlemmar, gudstjänst-modul med närvaro, samt säkerhet, tester och CI

**✅ Vad jag gjorde:**
En enorm dag. Två hela moduler blev fullständiga, och appen fick riktig säkerhets-arkitektur
ovanpå det.

Medlemmar (full CRUD):
- AddMemberModal med Zod-validering (regex på telefon, max-gränser, lowercase-e-post)
- Skapa/redigera/radera — medlemmar ligger nu i state
- Adress-fält (typ, schema, mockdata, formulär, kort)
- MemberProfileModal: klick på en rad öppnar profil med all info + Redigera/Radera
- Bekräftelse ("Är du säker?") innan radering (även i kalenderns EventModal)

Gudstjänst-modul:
- Service-typ + AddServiceModal (namn-förslag + eget namn för Fasta/Jul)
- Start- och sluttid (sluttid valfri), dagens datum som standard
- Services-sida med gruppering Kommande/Tidigare, datum-box och status-badge
- Närvaro: AttendanceModal — bocka av Närvarande/Frånvarande, `markedAt` för spårbarhet

Tillgänglighet:
- Verifierade mina a11y-påståenden mot koden (jag vill vara ärlig i redovisningen)
- Klickbara rader blev tangentbords-nåbara (role="button", tabIndex, Enter/Space)
- Listor gjordes semantiska (`<ul>`/`<li>`)

Säkerhet och arkitektur:
- Nya regler i CLAUDE.md (a11y, "förklara innan du kör", "verifiera innan du påstår", Frontend/TS-säkerhet)
- lib/errorHandler.ts (logError) + lib/api.ts (safeFetch med Zod)
- Koptiska API-svaret valideras nu i runtime
- ErrorBoundary runt hela appen (class — det enda undantaget)

Kvalitet:
- Vitest + mitt första enhetstest (bevisar att ErrorBoundary inte läcker interna detaljer)
- eslint-plugin-security + CI-workflow (tsc + lint + test + npm audit)
- npm audit fix — fixade en DoS-sårbarhet (brace-expansion)

**🎓 Lärdomar:**
- `Omit<Type, "id">` ger formulär-typen automatiskt (ändrar jag Member följer NewMemberData med)
- Modal-mönstret (state + handler) fungerar för event, medlem OCH närvaro
- Error Boundaries MÅSTE vara class components — det enda undantaget
- `safeFetch<T>(url, schema)` samlar fetch + felhantering + runtime-validering på ett ställe
- En klickbar rad behöver role="button" + tabIndex + Enter/Space för tangentbord
- Testa att fel INTE läcker (generellt meddelande, inte stack trace)

**⚠️ Utmaningar:**
- Påståenden i redovisningen stämde inte med koden (a11y) — jag fick verifiera och rätta
- Nya säkerhets-paket drog in sårbarheter — jag fixade den säkra och lät den brytande vara

**💡 Fel att komma ihåg:**
- Verifiera alltid mot koden innan man påstår att något är klart
- Klickbara rader behöver tangentbords-stöd
- react-router-sårbarheten gäller RSC-läge som appen inte använder — låg risk

**📝 Reflektion:**
Ett enormt produktivt pass. Medlemmar och Gudstjänster är nu fullständiga moduler med
CRUD och närvaro, och appen har fått riktig säkerhets-arkitektur, tillgänglighet, tester
och CI. Det jag tar med mig mest är värdet av att verifiera mot koden och vara ärlig om
vad som faktiskt är kvar.

**➡️ Nästa steg:**
- i18next (svenska/arabiska + RTL)
- Backend (Express + Prisma) — då blir data delad mellan sidorna
- Fler enhetstester (formulär-validering, CRUD-logik)

---

### 🗓 Måndag 3 augusti 2026 — Dag 7

**🎯 Mål för dagen:** Fem sammanhängande sprintar — tvåspråkighet, mörkt läge + Fas 1-klart, frånvaro-orsak + Clean Architecture, strict-flaggor + WCAG-plan, kodstruktur + prestanda

**✅ Vad jag gjorde:**
Det här blev ett gigantiskt arbetspass i fem pass. Jag delade upp det så att jag orkade
hålla ordning.

Pass 1 — Tvåspråkighet (i18next + RTL):
- Satte upp i18next + react-i18next (src/i18n.ts, locales/sv.ts, locales/ar.ts)
- Språkväxlare i headern (SV / AR) + automatisk RTL för arabiska (`dir="rtl"`)
- Inter-font för svenska, Cairo-font för arabiska
- useDateTime returnerar nu en hälsnings-nyckel (morning/day/evening) i stället för färdig text
- Migrerade alla sidor och komponenter: Dashboard, Medlemmar (+MemberCard, AddMemberModal, MemberProfileModal, GroupMessageModal), Kalender (+EventModal, AddEventModal, CalendarToolbar), Gudstjänster (+AddServiceModal, AttendanceModal)
- DRY-städning på vägen: kategori-texter, WhatsApp-mallar och event-kategori-texter samlade i översättnings-nycklar

Pass 2 — Mörkt läge + Fas 1 komplett:
- Tema-knapp (sol/måne) + useTheme-hook som minns valet i localStorage (validerat)
- `dark:`-klasser kopplade till `data-theme="dark"` på html (Tailwind @custom-variant)
- `color-scheme` så webbläsarens native-kontroller följer temat
- Samlade ALLA ljus/mörk-färger i ca 15 semantiska klasser i index.css (surface, text-strong/soft/faint, text-accent, modal-backdrop, modal-panel, field, field-label, field-error, btn-primary, btn-secondary m.fl.)
- Gjorde om alla sidor, komponenter och modaler till att använda klasserna
- Mörka regler för react-big-calendar-rutnätet
- Byggde en egen Dropdown-komponent (native select gick inte att färga mörk i Chrome/macOS)
- Kortnotering per gudstjänst (använder notes-fältet som redan fanns)
- Profilbild per medlem: ny Avatar-komponent (initialer i färgcirkel) + Ta foto (mobilkamera) / Välj bild (base64, max 1 MB)
- FAS 1 KLAR: mörkt läge, flerspråkighet, profilbild, kortnotering

Pass 3 — Frånvaro-orsak + Prettier + Clean Architecture:
- Frånvaro-orsak (sjuk/resa/okänd/annat) + kontaktstatus (Ej kontaktad/Försökt/Svarat) i närvaro-modalen
- Chips visas bara för frånvarande; sparas per gudstjänst
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
- DOMPurify: en påminnelse sparad till senare (ingen kod nu, inga rich-text-fält än)

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
- Tailwind v4: `@custom-variant dark` ger manuell toggle
- `@apply` funkar i egna klasser (@layer components) — samlar färgkombinationer på ett ställe
- FileReader.readAsDataURL ger base64 data-URL (hålls i minnet tills backend finns)
- `capture="environment"` på ett fil-fält öppnar kameran på mobil
- exactOptionalPropertyTypes: optionella datafält som får hålla "inget värde" typas som `T | undefined`
- noUncheckedIndexedAccess fångar riktiga undefined-buggar vid array/objekt-indexering
- focus-trap-react fångar fokus i modaler (WCAG 2.4.3) — krav för offentlig sektor
- sonner har inbyggd a11y (role=status / aria-live)
- @axe-core/react körs bara i `import.meta.env.DEV` — aldrig i prod-bundlen
- React.memo hjälper bara om props är stabila — annars behövs useCallback på handlers
- lazy() med named export kräver `.then(m => ({ default: m.X }))`
- I TypeScript 6 är `baseUrl` deprecated — `paths` funkar ändå men målen måste vara relativa

**📝 Reflektion:**
Ett gigantiskt arbetspass, och jag är stolt. Appen gick från "svensk enkelspråkig" till
komplett tvåspråkig (svenska + arabiska + RTL), fick fullt mörkt läge, familjekoppling +
WhatsApp, profilbilder, frånvaro-orsak, en egen designsystem-arkitektur (domain +
use-cases + repositories), maxad typsäkerhet med riktiga latenta buggar åtgärdade, hela
WCAG-planen på plats (focus-trap, semantik, skeleton, toast, axe) och prestanda-optimeringar
(lazy, memo, code-splitting). Fas 1 är komplett, och bygget är fortfarande grönt: tsc 0 fel,
lint 0, 11 tester, build ✅.

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
- Analysera mot en rekommenderad best-practice verktygs-stack

**✅ Vad jag gjorde:**
En lång men viktig dag där jag mest jobbade med dokumentation och kvalitet.

- Skrev CHANGELOG 0.4.0 med allt sedan 30 juli (i18n, mörkt läge, Clean Architecture, WhatsApp, Avatar, Skeleton, sonner, axe-core, focus-trap, strict-flaggor)
- 18 doc-fixar på 8 filer (README, CHANGELOG, CV-BULLETS, DESIGN, TROUBLESHOOTING, dokumentationen och dagboken + client/README)
- STT-beslut fastställt: Speechmatics valdes efter dialektanalys — 11 filer synkade
- Skrev tre parallella att-göra-listor som stegvis guidar mig genom UX/a11y-arbetet, kodstrukturen och färg/design-arbetet
- WCAG-kontrast räknad på 19 kombinationer — en kritisk fail hittad: röd-mörkt #A05858 = 2.98:1
- Verktygs-stack-analys mot rekommenderad best-practice-stack — 8 saknade punkter identifierade

**💡 Vad jag lärde mig:**
- Doc-städ tar längre tid än man tror, men är superviktigt inför LIA
- WCAG-kontrast måste testas i BÅDA lägen (ljust + mörkt), inte bara ljust
- Semgrep fångar säkerhetsmönster som ESLint missar
- shadcn/ui är battle-tested men matchar inte varje designspråk

**🔧 Fel jag löste:**
- Datum-fel i CHANGELOG (0.3.0 vs verkligt datum)
- Motsägelse mellan STT-valet (Speechmatics) och gamla omnämnanden av Deepgram i andra filer
- 7 kosmetiska fel i README, CV-BULLETS och dagboken

**📝 Reflektion:**
Idag var en stor dokumentations-dag. Jag har nu tre parallella att-göra-listor som guidar
mig steg för steg genom UX-, kod- och designarbetet. Jag fastnade lite på Snyk-diskussionen —
skönt att jag vågade fråga i stället för att gissa.

**➡️ Nästa steg:**
- Fixa röd-mörkt-fail (kontrast-steget)
- Börja med bottennavigering
- Committa alla docs-ändringar

---

### 🗓 Måndag 4 augusti 2026 — Dag 12

**🎯 Mål för dagen:** UX/design-steg + felhantering + radera-gudstjänst

**✅ Vad jag gjorde:**
En stor design- och UX-dag. Appen känns mer färdig efteråt.

Textstorlek (a11y):
- Inställbar textstorlek (80–200 %) via useFontScale + CSS-variabeln `--font-scale` (WCAG 1.4.4)

Färg och design (6 steg):
- Bottennavigering för mobil (BottomNav, md:hidden, fasta ikon-flikar)
- Färgblindhet: ikoner på status-badges (kontaktstatus + närvaro)
- Toast vid fel (toast.error + try/catch i alla CRUD-handlers)
- EmptyState-komponent (Members + Services)
- Formulär-förenkling: expanderbara valfria fält i AddMemberModal + inputMode
- Visuell hierarki: Cormorant Garamond på rubriker (implementerar designsystemet)

Ny funktion + fixar:
- Radera gudstjänst genom alla fyra Clean Architecture-lager + bekräftelse på raden
- Suspense flyttad in i Layout (header + main står kvar under laddning; fixade axe-landmark)
- Flera kontrast-fixar (text-faint → text-soft där texten låg på beige bakgrund + ikon-knappar)

**🎓 Lärdomar:**
- text-faint (stone-500) klarar 4.80:1 på vitt men bara 4.40:1 på beige (stone-100) — under AA
- Suspense ovanför Routes byter ut HELA appen; lägg den runt Outlet så skalet står kvar
- Status via ikon + text = färgblind-säkert (WCAG 1.4.1)
- Cormorant saknar arabiska tecken → arabiska rubriker faller tillbaka till Cairo
- Clean Architecture gör en ny CRUD-metod enkel: interface → mock → hook → sida

**⚠️ Utmaningar:**
- Kontrast-fyndet återkom flera gånger — löstes genom att räkna exakt kontrast per bakgrund
- Färg-stegen i planen byggde på CSS-variabler som inte fanns i koden → jag fick översätta dem

**💡 Fel att komma ihåg:**
- Verifiera kontrast mot RÄTT bakgrund (kort = vitt, sida = beige) — inte bara "på vitt"
- Radering bör städa relaterad data (närvaro-poster) — inte lämna föräldralösa rader

**📝 Reflektion:**
Appen känns mer färdig nu: mobilnav, tydliga tomma vyer, feedback vid fel, snabbare
formulär, elegant rubrik-typsnitt och skarpare kontraster. Radera-gudstjänst var ett fint
exempel på hur enkelt Clean Architecture gör en ny funktion.

**➡️ Nästa steg:**
- Beslut om färgsystemet (så färg-stegen kan göras rätt mot Tailwind)
- Eller: börja på backend (Express + Prisma)

---

### 🗓 Måndag 4 augusti 2026 — Dag 13 (forts.)

**🎯 Mål:** Typad felhantering (ErrorBase) + slutföra kontrast-fixar

**✅ Vad jag gjorde:**
Jag byggde ut felhanteringen så att den är redo för backend, och jag ville äntligen bli
klar med kontrast-jakten.

ErrorBase-mönster (typad felhantering):
- Felklasser i lib/errors.ts (AppError, ValidationError, NetworkError, AuthError)
- safeFetch kastar NetworkError; getErrorMessageKey (DRY) ger rätt toast-meddelande per feltyp
- Alla 10 CRUD-handlers använder hjälpfunktionen; nya nycklar errorValidation/errorAuth

Kontrast (WCAG AA):
- text-faint mörkad centralt i index.css (#726a60) → klarar 4.5:1 på alla bakgrunder
- Tog bort opacity-75 på StatCard-etiketterna — opaciteten sänkte kontrasten under 4.5

**🎓 Lärdomar:**
- Parameter-properties (`constructor(public x)`) funkar INTE med erasableSyntaxOnly — deklarera fält explicit
- Opacitet på liten text = klassisk kontrast-fälla (blandar färgen mot bakgrunden)
- instanceof-check kräver riktiga klasser — därför ErrorBase
- Samla instanceof-logiken på ETT ställe (getErrorMessageKey) = DRY

**⚠️ Utmaningar:**
- Kontrast-fyndet återkom flera gånger — men jag löste det systematiskt (grep efter `opacity-` på text hittade boven)

**📝 Reflektion:**
Felhanteringen är nu förberedd för backend: när api-repositories via safeFetch kommer får
användaren automatiskt rätt meddelande (nätverk/validering/auth). Kontrast-jakten lärde mig
att gräva systematiskt i stället för att gissa — en riktigt nyttig läxa.

**➡️ Nästa steg:**
- Committa (ErrorBase + kontrast-fixar)
- Färgsystem-beslut eller backend

---

### 🗓 Onsdag 5 augusti 2026 — Dag 14

**🎯 Mål för dagen:** Bli klar med dashboarden mot riktig data (frontend-först)

**✅ Vad jag gjorde:**
Idag väckte jag liv i startsidan. Jag gick igenom dokumentationen och rätade upp den
(hittade 6 motsägelser att rätta), och kopplade sedan Dashboard till riktig data.

- Dashboard kopplad till riktig data via use-case + hook (bort med de hårdkodade 47/38/5)
- Två nya widgets: Kommande gudstjänster (klickbara) + Senaste kontakter
- Veckonärvaro-graf med Recharts (tema-reaktiv, a11y via role=img + sammanfattning)
- Kontaktknappar Ring/Mejla/WhatsApp på varje kontakt (återanvänder lib/whatsapp)
- Frånvaro-regel: "Att kontakta" genereras automatiskt från närvaro (ej närvarat 4 veckor)
- DRY-städning: .date-box-klass, delad contactStatus, formatShortDate, ContactActions
- 22 tester gröna, tsc + ESLint + bygge rent

**🎓 Lärdomar:**
- Ren logik i use-cases gör allt testbart utan React
- Recharts blir tema-reaktiv via `currentColor` + befintliga temaklasser (inte JS-tema)
- Vites HMR klarar inte när en export försvinner — då krävs full omladdning

**⚠️ Utmaningar:**
- HMR-cachen hängde sig efter att en export togs bort (löstes med hård-omladdning)
- Axe visade två a11y-fel som inte fanns i koden — troligen gamla logg-rader i konsolen

**📝 Reflektion:**
Dashboarden gick från statiska siffror till en levande vy som svarar på frågor: vem kommer,
vem saknas, vem behöver kontaktas. Frånvaro-regeln knyter ihop hela flödet
närvaro → påminnelse → kontakt. Ren arkitektur (use-cases → hook → sida) gjorde varje
steg litet och hanterbart. Skönt att se den bli levande.

**➡️ Nästa steg:**
- Fixa dokumentations-motsägelserna (backend-vecka m.m.)
- Steg C: snooza/klar + "dagens X kontakter"
- Fortsätta resten av frontend mot mockdata

---

### 🗓 Torsdag 6 augusti 2026 — Dag 15

**🎯 Mål för dagen:** Komma så långt som möjligt mot att frontend är klar — bygga vidare på dashboarden, starta Modul 2, och till slut få AI-tolkningen på plats

En riktigt lång dag som jag delade upp i flera pass. Jag samlar allt här.

**✅ Vad jag gjorde:**

Dashboard + Modul 2 (Gudstjänst):
- Steg C: "Att kontakta" blev en arbetslista (Klar/Snooza + dagens X, sorterad efter frånvaro)
- Flyttade närvaro-avprickningen till Dashboard (eget Närvaro-kort)
- DRY-städning: bröt ut AddButton, ModalCloseButton, DeleteEditActions och Chip (7 modaler + 3 sidor)
- Strukturerade om Gudstjänst-sidan: klick → egen detaljsida (planering), ingen närvaro där
- Ny modul: Noteringar per gudstjänst (typ + privat/offentlig + sök) via Clean Architecture
- Planering-panel: högtid + bibeltexter på gudstjänsten
- Predikobibliotek: ny Predikningar-sida med metadata, sök och filter (5:e nav-fliken)

Sakrament + medlemmar + kalender-synk:
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

Sista frontend-funktionerna:
- Cirkeldiagram på startsidan (medlemsfördelning per kategori) — klick på ett segment
  öppnar medlemslistan filtrerad på kategorin (via ?kategori= i URL:en)
- Juliansk datum-konvertering (utils/calendarConvert) — visar juliansk motsvarighet
  i händelse-modalen när juliansk kalender är vald
- Sammanfattningsrapport per gudstjänst — närvarograd jämförd med snittet av alla
  gudstjänster (över/under/lika, med ikon och färg)
- Zod-fel via i18n — global felkarta (zodErrorMap) översätter valideringsfel efter
  feltyp; hårdkodade svenska meddelanden borttagna ur alla 6 formulär-schemana

AI-tolkning live (mock):
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

Kvalitet över hela dagen:
- Testerna växte i takt med bygget: 30 → 47 → 61 gröna
- tsc + lint + bygge rent hela dagen

**🎓 Lärdomar:**
- Tydlig ansvarsdelning (Dashboard = närvaro, Gudstjänst = planering) gör appen lättare att navigera
- Att bryta ut återkommande knappar tidigt sparar mycket dubblering senare
- Samma mönster (domän → repository → hook → sida) gör varje ny modul snabb och trygg att bygga
- Axe-felen (button-name, tabindex) kom från react-big-calendar, inte min egen kod
- Bikt visar hur sekretess byggs in i datamodellen (innehållet lagras aldrig)
- Zod 4 sätter en global felkarta med z.config; ett schema-eget meddelande vinner alltid
  över kartan, så meddelandena måste bort ur schemana för att översättningen ska slå igenom
- Samma återanvändbara diagram-komponent kan visa flera fördelningar (DRY)
- Var realistisk för användaren: en präst vet inte vad en JSON-fil är — dokument/PDF passar
- Förberedd text som visas direkt gör AI-tolkningen både billigare och mer korrekt
- Normaliserad data (sentences + relations) måste joinas ihop, precis som i en databas

**⚠️ Utmaningar:**
- Stor omstrukturering i flera faser (bl.a. medlemsmodal → detaljsida) — löstes fas för fas med verifiering (tsc/lint/tester) efter varje steg
- Mycket ocommittat mellan varven — jag måste komma ihåg att committa oftare

**📝 Reflektion:**
En enorm dag, men jag är riktigt stolt. Frontend är nu nära komplett: Dashboard, Medlemmar
(+detaljsida), Kalender, Gudstjänster (+detaljsida), Predikningar och Sakrament. Appen känns
äntligen som en riktig produkt med flera tydliga delar. AI-tolkningen blev en helhet:
förberedd liturgi + live-AI för predikan, och eftersom jag byggt mot mock först behöver
backend sen bara byta ut datakällan. Nästa stora fas är backend — allt som återstår
(multi-kyrka, auth, kryptering, AI, SMS, Google-synk) är samlat i BACKEND-ATT-GORA.md.

**➡️ Nästa steg:**
- Committa dagens arbete
- Normalisera fler liturgi-samlingar (katameros, kholagy, stilla-veckan)
- Fixa dokumentations-motsägelserna (backend-vecka m.m.)
- Backend: STT + DeepL + WebSocket enligt AI-TOLKNING.md, och Prisma enligt BACKLOG + BACKEND-ATT-GORA

---

### 🗓 Fredag 7 augusti 2026 — Dag 16

**🎯 Mål för dagen:** Höja kodkvaliteten och planera databasen inför backend

**✅ Vad jag gjorde:**
Idag städade jag koden på djupet och la grunden för databasen. Skönt att få göra ett
kvalitetspass innan backend.

- Läsbarhet: ~110 enbokstavs-namn i hela koden bytta till hela ord (event, member,
  record, service, sacrament ...); `t` (i18n) och typparametrar behållna
- Skärpte kommentarerna att förklara VARFÖR (t.ex. Escape-stängning motiverad med WCAG)
- Delade upp stora komponenter: AddMemberModal 425 → 186, MemberDetail 354 → 159
- Nya återanvändbara delar (DRY): Card, FormField, FormDropdown, PhotoPicker,
  schemas/fields.ts, use-cases/formErrors.ts (collectFieldErrors)
- Utökade testerna till 100 (alla use-cases + 19 hooks) med DRY-helpers
- Kvalitets-granskning mot 6 principer (läsbarhet, enkelhet, säkerhet, DRY,
  hållbarhet, stabilitet) — inga farliga fynd (inga console.log/any/hemligheter)
- Dokumentation: ny docs/BESLUT.md (varför-beslut), SECURITY utökad (beroende-rutin +
  rå-HTML-regler), CLAUDE.md-regler, CHANGELOG 0.5.1
- Databas-planering: ny docs/DATABAS-ATT-GORA.md — alla tabeller backend behöver

**🎓 Lärdomar:**
- Kod ska gå att läsa som meningar — enbokstavs-namn är dålig kod för en nybörjare
- En delegerad agent som verifierar (tsc/lint/tester) gör stora mekaniska pass trygga
- Att planera databasen utifrån en färdig frontend gör tabellerna enkla att härleda

**📝 Reflektion:**
Frontend är nu ren, läsbar, testad och dokumenterad. Det känns som en bra ordning: bygga
klart, städa, och först därefter planera databasen. Databas-listan ger mig en tydlig
startordning (kyrkor + auth först).

**➡️ Nästa steg:**
- Committa allt
- Börja backend: Prisma-schema enligt DATABAS-ATT-GORA (churches + users + auth först)

---

### 🗓 Söndag 10 augusti 2026 — Dag 17 (städdag)

**🎯 Mål för dagen:** Göra projektet privat mot Claude och städa dokumentation + assets

**✅ Vad jag gjorde:**
En skön städdag där jag rensade och ordnade upp både historik och dokumentation.

- Gjorde Claude-filerna privata: `.claude/` + `CLAUDE.md` i `.gitignore` (kvar lokalt, borta från GitHub)
- Tog bort Claude som bidragsgivare på GitHub — skrev om git-historiken (strök Co-authored-by-raden
  ur alla commits) + force-push. Lokala backuper rensade efteråt
- Dokumentations-städning: slog ihop dokument till färre, tydligare filer (vision + faser
  samlade i BACKLOG.md), tog bort gamla arkiv- och exempel-mappar samt dubbletter
- Fixade ALLA döda länkar och kontrollerade alla 23 egna .md-filer (0 brutna länkar kvar)
- Rensade oanvända Vite-mall-assets: `react.svg`, `vite.svg`, `App.css`, `hero.png` + tom `src/assets/`

**🎓 Lärdomar:**
- `Co-authored-by`-raden i commit-meddelanden gör att GitHub visar medförfattare — måste bort ur
  ALLA commits (annars återkommer den), och GitHubs Contributors-widget är cachad
- Att lägga en fil i `.gitignore` räcker inte om den redan spåras — `git rm --cached` krävs också
- Färre, sammanslagna docs är mycket lättare att hålla konsekventa än många överlappande

**📝 Reflektion:**
En riktigt skön städdag. Projektet känns rent och överskådligt nu — både koden och
dokumentationen. Bra känsla att gå in i backend-fasen med ordning på skrivbordet.

**➡️ Nästa steg:**
- Committa städningen
- Börja backend (Prisma-schema enligt DATABAS-ATT-GORA)

---

### 🗓 Tisdag 12 augusti 2026 — Dag 18 (backend-start!)

**⏱ Tid:** 6 h (stor dag)
**🎯 Mål för dagen:** Installera databas-verktygen och få igång backend

**✅ Vad jag gjorde:**
Dagen då backend gick från idé till något som faktiskt körde.

- Installerade PostgreSQL 16 + DBeaver lokalt (via Homebrew) och skapade databasen `parishhub`
- Byggde grunden för backend i `server/`: projekt + TypeScript (Steg A), Express-server som
  svarar (Steg B), Prisma kopplad till databasen (Steg C)
- Såg backend live i webbläsaren: `localhost:3000` → "ParishHub API lever!"
- Skapade en pedagogisk backend-manual (`docs/BACKEND-GRUNDER.md`) som växer för varje steg
- Skapade övnings-databas `parishhub_ovning` + separat kurs-mapp `databaskurs/` (sandlåda för lektioner)
- Granskade och förbättrade min parallell-studieplan (databaskurs ↔ ParishHub) — modellen
  "lär för hand, bygg med Prisma"
- Faktakollade alla 8 föreläsnings-anteckningar mot PDF:erna, fyllde i luckor (F2 SQL-funktioner,
  F4 Execution Plans, F6 säkerhetsprinciper) och organiserade dem per föreläsning

**🎓 Lärdomar:**
- Backend måste vara igång (`npm run dev`) för att webbläsaren ska nå den — annars "connection refused"
- `npm run dev` gör olika saker beroende på mapp: `server/` = backend (3000), `client/` = frontend (5173)
- En migration = sparad instruktion som bygger databasens struktur; Prisma skriver SQL:en åt mig
  (samma SQL som lärs för hand i kursen)
- Handskriven SQL och Prisma får inte styra samma databas — därför övnings-databas för kursen,
  Prisma för projektet

**⚠️ Utmaningar:**
- Terminalen och att hitta rätt mapp var pilligt i början — men det löste sig
- Att hålla kurs och projekt synkade utan att det blir rörigt (löst med tydlig uppdelning + en sanning: planen)

**💡 Fel att komma ihåg:**
- "ERR_CONNECTION_REFUSED" = servern är inte igång (eller fel mapp) — inte trasigt, bara ett stängt kök

**📝 Reflektion:**
Stor och rolig dag. Backend kändes läskigt innan, men steg-för-steg med liknelser (kök, skafferi,
Excel-ark) gjorde det begripligt. Jag vill verkligen förstå det här — och idag började det klicka.
Skönt att ha en manual att gå tillbaka till.

**➡️ Nästa steg:**
- Steg D: skriva första tabellerna (Church + User) via Prisma → se dem i DBeaver
- Committa dagens arbete (server-setup + nya docs)
- Börja plugga F1–F2 inför kursen

---

## 📋 Mall för nya dagar

Kopiera detta block och klistra in högst upp under "Dag-för-dag":

```markdown
### 🗓 [Veckodag] [DD månad] 2026 — Dag [N]

**⏱ Tid:**
**🎯 Mål för dagen:**

**✅ Vad jag gjorde:**
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

- [x] Första ParishHub-sidan på skärmen — **22 juli 2026** ✅
- [x] Första CRUD-funktionen klar (kalender: skapa/läsa/redigera/radera) — **28 juli 2026** ✅
- [x] Fullständig projektdokumentation + säkerhetsstandard klar — **28 juli 2026** ✅
- [x] Medlems-CRUD + Gudstjänst-modul med närvaro klara — **30 juli 2026** ✅
- [x] Säkerhets-arkitektur, tillgänglighet, tester och CI på plats — **30 juli 2026** ✅
- [x] Tvåspråkig app (svenska/arabiska + RTL) på alla sidor — **3 augusti 2026** ✅
- [x] Mörkt läge på hela appen (tema-knapp + DRY färgklasser + egen dropdown) — **3 augusti 2026** ✅
- [x] Fas 1 komplett (mörkt läge, flerspråkighet, profilbild, kortnotering) — **3 augusti 2026** ✅
- [x] Clean Architecture på alla sidor (domän · repository · hook) — **3 augusti 2026** ✅
- [x] Backend startad — server + Express + Prisma kopplad till PostgreSQL — **12 augusti 2026** ✅
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
- [x] Kodkvalitets-pass (läsbara namn, uppdelade komponenter, DRY-helpers, 100 tester) + databas-plan för backend — **7 augusti 2026** ✅
- [ ] Första Express-servern igång
- [ ] Första databaskopplingen till PostgreSQL
- [ ] Första JWT-inloggningen fungerar
- [ ] Första AI-tolkningen live via Speechmatics
- [ ] Första gången någon annan använder appen
- [ ] Appen används i riktig gudstjänst
- [ ] Appen släppt i App Store / Google Play

---
