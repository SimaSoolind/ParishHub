# 📔 Dagbok — ParishHub

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

**⏱ Tid:** _(fyll i)_
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

**⏱ Tid:** _(fyll i)_
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

**⏱ Tid:** _(fyll i)_
**🎯 Mål för dagen:** Göra hela appen tvåspråkig (svenska + arabiska) med i18next och RTL

**✅ Vad som gjordes:**

Grund (Steg 1):
- Satte upp i18next + react-i18next (src/i18n.ts, locales/sv.ts, locales/ar.ts)
- Språkväxlare i headern (SV / AR) + automatisk RTL för arabiska (dir="rtl")
- Inter-font för svenska, Cairo-font för arabiska
- useDateTime returnerar nu en hälsnings-nyckel (morning/day/evening) istället för färdig text
- Dashboard migrerad som bevis

Migrerade alla sidor (Steg 2):
- Dashboard-komponenter (BirthdayList, PriorityList)
- Medlemmar-sidan + MemberCard
- Medlemsmodalerna (AddMemberModal, MemberProfileModal, GroupMessageModal)
- Kalender-sidan + EventModal, AddEventModal, CalendarToolbar
- Gudstjänster-sidan + AddServiceModal, AttendanceModal

DRY-städning på vägen:
- Kategori-texter (Vuxen/Ungdom/...) hämtas nu från EN nyckel-grupp (members.filter) istället för tre ställen
- WhatsApp-mallarnas text flyttade från datafil till översättningarna (en per språk)
- Event-kategori-texter flyttade till översättningarna (eventCategories.ts blev bara en värde-lista)

**🎓 Lärdomar:**
- i18next slår på plural-logik om man skickar variabeln `count` — döpte om till total/n för vanlig text
- t("nyckel." + värde) gör dynamiska nycklar (kategori, status, mall) enkla
- Placeholder-token {namn} (enkel klammer) rör i18next inte — så fillTemplate kan byta den per person
- Översättningsnycklar kan återanvändas mellan komponenter → mindre dubbeltext (DRY)
- t() med { defaultValue } ger säker fallback när en nyckel saknas

**⚠️ Utmaningar:**
- Många "mellanlägen" i editorn mellan del-ändringar — tsc i slutet är alltid facit
- react-big-calendars egna knappar kräver ett messages-objekt som måste byggas i komponenten för att bli språkstyrt

**💡 Fel att komma ihåg:**
- Använd inte `count` som interpolations-variabel om du inte vill ha plural
- Kör alltid tsc -p tsconfig.app.json som sista kontroll — inte editor-varningarna
- Kalendern och datum-formaten är fortfarande svenska internt (date-fns sv) — förfina senare

**📝 Reflektion:**
Stort steg mot en app som fungerar för hela församlingen. Nu kan man klicka på AR och
hela gränssnittet — meny, sidor, formulär, WhatsApp-mallar — byter till arabiska och
vänds höger-till-vänster. Kändes extra bra att i18n-arbetet också tvingade fram
DRY-städning: texter som fanns på flera ställen samlades till ett. tsc grön och testet
passerar hela vägen.

**➡️ Nästa steg:**
- Datum-format per språk (arabiska månader och siffror)
- Zod-felmeddelanden via översättningar
- Backend (Express + Prisma)

---

### 🗓 Måndag 3 augusti 2026 — Dag 8 (senare pass)

**⏱ Tid:** _(fyll i)_
**🎯 Mål för dagen:** Mörkt läge (DRY) + sista Fas 1-funktionerna — profilbild och kortnotering (Fas 1 klar)

**✅ Vad som gjordes:**
- Tema-knapp (sol/måne) i headern + useTheme-hook som minns valet i localStorage (validerat)
- Kopplade dark:-klasser till data-theme="dark" på html (Tailwind @custom-variant)
- color-scheme så webbläsarens native-kontroller (datum/tid-väljare, scrollbar) följer temat
- Samlade ALLA ljus/mörk-färger i ca 15 semantiska klasser i index.css (DRY):
  surface, text-strong/soft/faint, text-accent, hover-accent, divide-rows, row-hover,
  modal-backdrop, modal-panel, field, field-label, field-error, btn-primary, btn-secondary
- Gjorde om alla sidor, komponenter och modaler att använda klasserna
- Mörka regler för react-big-calendar-rutnätet (biblioteket har egen ljus CSS)
- Byggde egen Dropdown-komponent — native select gick inte att färga mörk i Chrome/macOS
- Kortnotering per gudstjänst — visas på raden, redigeras i närvaro-modalen (använder notes-fältet som redan fanns)
- Profilbild per medlem — ny Avatar-komponent (initialer i färgad cirkel, färg från namnet); Ta foto (kamera på mobil) + Välj bild (base64, max 1 MB); URL-fältet togs bort på begäran
- FAS 1 KLAR: mörkt läge, flerspråkighet, profilbild, kortnotering

**🎓 Lärdomar:**
- Tailwind v4: @custom-variant dark (&:where([data-theme="dark"] *)) ger manuell toggle
- @apply funkar i egna klasser (@layer components) — samlar färgkombinationer på ett ställe
- color-scheme styr native-kontroller (datum/tid, scrollbar)
- Native select-popup går INTE att styla mörk pålitligt i Chrome/macOS → egen komponent
- localStorage måste valideras i runtime (bara "light"/"dark" tillåts)
- Nya globala CSS-regler kan kräva omstart av dev-servern (inte bara reload)
- Fil till bild: FileReader.readAsDataURL ger base64 data-URL (hålls i minnet tills backend finns)
- capture="environment" på ett fil-fält öppnar kameran på mobil (dator ignorerar det → filväljare)

**⚠️ Utmaningar:**
- Fastnade på att färga select-dropdownen mörk — color-scheme och option-styling räckte inte
  i Chrome/macOS. Löste det med en egen, återanvändbar Dropdown-komponent.
- Höll koden DRY: bröt ut färgerna till semantiska klasser istället för att upprepa
  dark:-strängar i tjugo filer

**💡 Fel att komma ihåg:**
- Upprepa inte dark:-klasser i varje fil — samla i semantiska klasser (DRY)
- Native form-kontroller går inte alltid att styla — bygg egen komponent vid behov
- Verifiera CSS med npm run build (tsc fångar inte CSS-fel)

**📝 Reflektion:**
Appen har nu ett komplett mörkt läge som minns sitt val och fungerar ihop med både svenska
och arabiska (RTL). Det bästa var att hålla det DRY — all färg bor på ett ställe, så en
ändring slår igenom överallt. Lärde mig också att inte allt går att styla i webbläsaren,
och att en egen komponent ibland är rätt väg. Med profilbild och kortnotering på plats är
HELA Fas 1 färdig — appen känns nu som en riktig produkt.

**➡️ Nästa steg:**
- Frånvaro-orsak + kontaktstatus i närvaron
- Backend (Express + Prisma)
- Testa profilbild-kameran på riktig mobil (påminnelse sparad)

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
- [ ] Första Express-servern igång
- [ ] Första databaskopplingen till PostgreSQL
- [ ] Första JWT-inloggningen fungerar
- [ ] Första AI-tolkningen live via Deepgram
- [ ] Första gången någon annan använder appen
- [ ] Appen används i riktig gudstjänst
- [ ] Appen släppt i App Store / Google Play

---
