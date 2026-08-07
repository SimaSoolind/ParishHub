# ParishHub — Master Backlog

> **Syfte:** Enda platsen med checkbox-tasks — vad som är klart och vad som är kvar.
> **Använd när:** du vill veta nästa steg, bocka av klara uppgifter.
> **Se även:** [`INDEX.md`](./INDEX.md) för hitta-rätt-guide, [`ROADMAP.md`](../ROADMAP.md) för högnivå-vision.

**Uppdaterad:** 2026-08-06
**Bygg dagligen:** 8-10 timmar = realistisk tidsram nedan.

Denna fil är den **ENDA sanningskällan** för scope och tasks.
Alla andra docs beskriver ARKITEKTUR eller KRAV — inte checkbox-tasks.

**Regel:** varje checkbox-task finns HÄR. Om du hittar en dubblett i
annan fil → ta bort den och lägg referens till BACKLOG-sektionen.

**Källor:** Sima's exakta lista (2026-08-05), ROADMAP.md, docs/AI-TOLKNING.md,
Deep Research-spec, Dokument 2 (PARISHHUB-app) från Drive.

---

## Läge just nu

| Del | Status |
|---|---|
| Frontend | ~70 % (Dashboard, Members, Calendar, Services byggda mot mockdata) |
| Backend | 0 % (v.7-14 enligt ROADMAP, 15-20 h/vecka) |
| Deploy | 0 % (v.15+) |
| Testning | ~11 tester (use-cases + utils + ErrorBoundary) |
| Docs | Nästan komplett — CLAUDE, ROADMAP, AI-TOLKNING, SECURITY, DESIGN klara |

---

## v1 MVP — Frontend (kritiskt för LIA)

### Inloggning + Auth
- [ ] Inloggningssida (`/login`)
- [ ] Glömt lösenord
- [ ] Återställ lösenord (`/reset-password/:token`)
- [ ] 2FA-sida (`/2fa`) — SMS-kod
- [ ] Skyddade routes (RequireAuth-komponent)
- [ ] Olika menyer för präst/admin/volontär — se `docs/RBAC.md`
- [ ] Automatisk utloggning vid inaktivitet (30 min)
- [ ] "Kom ihåg mig"-checkbox (längre refresh-token)
- [ ] Aktivitetslogg (`/audit`) — vem loggade in när

### Flera kyrkor
- [ ] Välj aktuell kyrka (dropdown i header)
- [ ] Skapa och redigera kyrka (`/churches`)
- [ ] Kyrkans logotyp och inställningar (`parish_profile`)
- [ ] Filtrera alla sidor efter vald kyrka (`churchId`-context)
- [ ] Multi-kyrka-relation: en medlem = EN församling (se `docs/MULTI-KYRKA.md`)
- [ ] Prästen kan ha åtkomst till flera kyrkor via roll-tabell

### Medlemmar (85 % klart)
- [x] Visa lista med medlemmar
- [x] Sök på namn
- [x] Filtrera på kategori (Vuxen/Ungdom/Ledare/Övrig)
- [x] Ring och Mejla direkt från listan
- [x] Lägg till ny medlem (formulär med Zod-validering)
- [x] Redigera medlem
- [x] Radera medlem (med bekräftelse)
- [x] Adress + anteckningar per medlem
- [x] Profil-modal (klick på medlem)
- [x] Grupputskick (bocka flera → WhatsApp)
- [x] Profilbild via mobilkamera + Välj bild (base64, max 1 MB)
- [ ] Fullständig familje-/hushållsvy (roller make/maka/barn/förälder/syskon)
- [ ] Sakramentsflik per medlem (se `docs/SAKRAMENT.md`)
- [ ] Samtycke och kontaktpreferenser (per medlem)
- [ ] Importera CSV (för migration)
- [ ] Exportera CSV/PDF (för backup)
- [ ] Närvarograf per medlem (Recharts, senaste månader)
- [ ] GDPR-export och radering (per medlem)

### Familjekoppling (60 % klart)
- [x] Koppla medlemmar till samma familj (`familyId`)
- [x] Se familjemedlemmar i profilen (klickbara)
- [x] Kontakta familjemedlemmar från profilen (WhatsApp)
- [x] Lägg till fler familjemedlemmar
- [x] Ta bort ur familjen
- [ ] Skilja på roller (make/maka, barn, förälder, syskon)
- [ ] Se hela familjens närvaro på en plats
- [ ] Familj som hushålls-entitet med gemensam adress

### Dashboard
- [x] Antal medlemmar totalt
- [x] Antal närvarande idag
- [x] Antal som väntar på kontakt
- [x] Prioriterad kontaktlista högst upp
- [x] Veckans födelsedagspåminnelser
- [ ] Statistik från riktig databas (byt mockdata)
- [ ] Automatiska frånvarovarningar (regel-baserat)
- [ ] Skapa kontaktuppgift automatiskt vid frånvaro
- [ ] Snooza och avsluta uppgift
- [ ] Kontakthistorik (vem ringde/mejlade när)
- [ ] Grafer över närvaro (senaste veckor + månader, Recharts)
- [ ] Roll-specifika vyer (präst vs volontär vs admin)
- [ ] "Dagens 3-5 prioriterade kontakter"-widget
- [ ] Filter per kyrka (när multi-kyrka finns)

### Kalender (byggd, kräver utökning)
- [x] React-big-calendar med koptiska högtider
- [x] CRUD för egna händelser
- [x] Egen verktygsrad (CalendarToolbar)
- [x] Klick på dag → dag-vy
- [ ] Juliansk kontra reviderad juliansk kalender (13 dagars förskjutning)
- [ ] Namnsdagar (koptiska helgon)
- [ ] Patronala fester per kyrka
- [ ] Sync med Google Calendar (OAuth)
- [ ] Sync med Outlook (OAuth)
- [ ] Återkommande händelser (varje söndag osv)

### Gudstjänster (90 % klart)
- [x] Skapa gudstjänst (namn-förslag + fritext för Fasta/Jul)
- [x] Start- och sluttid (sluttid valfri)
- [x] Gruppering Kommande/Tidigare
- [x] Datum-box + status-badge
- [x] Bocka av Närvarande/Frånvarande per medlem
- [x] Frånvaro-orsak (sjuk/resa/okänd/annat)
- [x] Kontaktstatus per frånvarande
- [x] Kortnotering per gudstjänst
- [ ] Detaljsida för varje gudstjänst
- [ ] Prästens privata anteckningar per gudstjänst
- [ ] Predikoarkiv (metadata: titel, datum, bibeltext, högtid)
- [ ] Bibelreferenser per predikan (Bibel-appen-koppling framtida)
- [ ] Tjänstgörande präst och diakon (schemaläggning per gudstjänst)
- [ ] Ljud-/video-/dokumentuppladdning per gudstjänst
- [ ] YouTube-spelare + live-status
- [ ] PDF-export av predikan

### Sakrament (NY MODUL)
- [ ] Sida för dop
- [ ] Sida för krismation
- [ ] Sida för vigsel (två medlemmar kopplas)
- [ ] Sida för prästvigning (biskop + grad)
- [ ] Formulär för sakrament (officiant/vittnen/plats/datum)
- [ ] Dokumentuppladdning per sakrament (foto/scan av intyg)
- [ ] PDF-intyg (auto-genererat officiellt intyg)
- [ ] Sakramentsflik per medlem (samlad tidslinje)
- [ ] Sök efter medlem via sakraments-metadata
- [ ] Juliansk-datum för sakrament (13 dagars stöd)

#### Arkitektur (från SAKRAMENT.md)

Ortodoxa kyrkan har fyra centrala sakrament som ska följa en medlem
genom hela livet. ParishHub lagrar dessa som förstklassiga entiteter
i databasen — inte som anteckningar.

**De fyra sakramenten:**

| Sakrament | När sker det | Vem officierar |
|---|---|---|
| **Dop** | Barndop (oftast) eller vuxendop | Präst |
| **Krismation** | Direkt efter dopet (koptisk tradition) | Präst |
| **Vigsel** | Bröllop | Präst eller biskop |
| **Prästvigning** | När diakon/präst vigs | Biskop |

**Fält per sakrament:**
- Datum (både civil OCH juliansk kalender — 13 dagars förskjutning stöds)
- Officiant (präst eller biskop — kopplas till `users`-tabellen)
- Vittnen (fritext eller kopplas till medlemmar)
- Plats (kyrka/adress)
- Officiellt intyg (PDF-mall genereras vid registrering)

**Speciella regler:**
- **Vigsel:** kopplas till TVÅ medlemmar (make + maka)
- **Prästvigning:** kräver biskop + grad (diakon/präst/biskop)

**GDPR + integritet:**
Sakrament är personuppgifter enligt GDPR art. 9 (särskilda kategorier —
religiös övertygelse). Extra skydd:
- Kryptering i vila (AES-256 via pgcrypto)
- Samtycke från medlem för lagring (art. 9.2(a))
- Audit-logg för all åtkomst
- Retention: sakrament sparas permanent (kyrkorättslig grund)

Se `docs/SECURITY.md` sektion 12 för kryptering-implementation.

### Kommunikation
- [x] Ring-knapp (`tel:`-länk)
- [x] Mejla-knapp (`mailto:`-länk)
- [x] WhatsApp direkt från profilen (färdiga mallar, `{namn}` fylls i)
- [x] Grupputskick via WhatsApp (bocka flera, skicka en i taget)
- [ ] Kommunikationssida (`/messages`) — central hub
- [ ] E-post-utskick (backend + frontend)
- [ ] SMS-utskick (backend + frontend)
- [ ] WhatsApp Business-utskick (äkta massutskick via API)
- [ ] Mottagargrupper och filter (segmentering)
- [ ] Meddelandemallar (färdiga snabbmeddelanden)
- [ ] Schemalagda utskick (skicka vid specifik tid)
- [ ] Leveransstatus per utskick (skickat/mottaget/läst)
- [ ] Avregistrering (opt-out per medlem)
- [ ] Historik för alla utskick
- [ ] Respektera samtycke + språkpreferens per mottagare

### Historikkort per medlem (40 % klart)
- [x] Klick på medlem → visa profil-modal (all info)
- [x] Familjemedlemmar visas i profilen (klickbara)
- [x] Anteckningar per medlem
- [ ] Närvaro senaste månader (visuell graf via Recharts)
- [ ] Datum för senaste kontakt
- [ ] GDPR-samtyckesstatus + datum
- [ ] Alla sakrament (tidslinje)
- [ ] Kontakthistorik (vem ringde/mejlade när)

### Krypterade privata anteckningar (post-MVP)
- [ ] Anteckningsfält per medlem
- [ ] Anteckningar krypteras i databasen (AES-256)
- [ ] Endast prästen kan läsa (efter inloggning + roll-check)
- [ ] Även vid databashack kan ingen läsa (nyckel på server)
- [ ] Förberedelser inför samtal

### AI-tolkning (frontend)
Fullständig teknisk plan: `docs/AI-TOLKNING.md`. Startpunkt: `docs/POC-VECKA-1.md`.

- [ ] Kontrollpanel (`/live-interpretation`)
- [ ] Talarväxling präst/diakon (automatisk diarization + manuell override)
- [ ] Språkväxling AR↔SV (manuell toggle)
- [ ] Mikrofonval (val av inmatnings-enhet)
- [ ] Start/paus/stopp-knappar
- [ ] Ljudnivå-mätare (VU-meter)
- [ ] Projektorvy (`/projector/:sessionId`)
- [ ] Publik-vy bredvid YouTube (`/watch/:sessionId`)
- [ ] WebSocket-klient (protokoll enligt AI-TOLKNING.md)
- [ ] Återanslutning vid nätverksbortfall (exponential backoff)
- [ ] AudioWorklet omsampling 44.1/48 → 16 kHz + Int16 PCM
- [ ] Session state machine
- [ ] Deduplicering på `sequence`-nummer
- [ ] Alt A: översätt även partials
- [ ] Automatisk sång-detektering → `[sång pågår]`-tag

### GDPR-hantering
- [ ] Sekretesspolicy publicerad
- [ ] Samtycke-checkboxar vid onboarding (medlem + präst + diakon)
- [ ] Samtyckesformulär för AI-tolkning (GDPR art. 6.1(a))
- [ ] Datum för samtycke sparas per person
- [ ] Automatisk flagg för inaktiva medlemmar (radera-förslag)
- [ ] Export till Excel/PDF för säkerhetskopiering
- [ ] Tydligt val för att radera all data
- [ ] "Rätten att bli glömd"-knapp per medlem
- [ ] Data-retention-policy (konfigurerbart per församling)

---

## v1 MVP — Backend (0 %)

### Server
- [ ] Init `server/` med TypeScript strict
- [ ] Node.js + Express
- [ ] Miljövariabler (`server/.env` + `.env.example`)
- [ ] CORS-allowlist (INTE `*`)
- [ ] Säkerhetsheaders (helmet)
- [ ] Central felhantering (AppError-hierarki, se `client/src/lib/errors.ts` som mall)
- [ ] Strukturerad loggning (pino)
- [ ] Health-endpoint (`GET /health`)
- [ ] CI för backend (samma GitHub Actions-flöde som client/)

### Databas
- [ ] PostgreSQL på Railway
- [ ] Prisma init + schema
- [ ] Migrationer (`prisma migrate`)
- [ ] Seed/testdata för utveckling
- [ ] Backup och återställning (automatiska dagliga backuper)
- [ ] Test-databas för CI
- [ ] Databas-användare med minsta privilegium
- [ ] `pgcrypto`-tillägg för AES-256 (privata anteckningar + predikningar)

### Databasmodeller (17 st)
- [ ] `User` (id, email, password_hash, role, church_id)
- [ ] `Church` (id, name, address, tradition, settings JSON, parish_profile JSON)
- [ ] `UserChurch` (mång-till-mång — präst kan ha roll i flera kyrkor)
- [ ] `Member` (id, church_id, first_name, last_name, email, phone, language, status, family_id, photo_url)
- [ ] `MemberChurch` (mång-till-mång — en medlem kan besöka flera kyrkor)
- [ ] `Family` (id, name, address, church_id)
- [ ] `FamilyRelation` (id, family_id, member_id, relation_type)
- [ ] `Service` (id, church_id, date, type, notes, start_time, end_time)
- [ ] `Attendance` (id, member_id, service_id, status, absence_reason, contact_status, marked_at)
- [ ] `CalendarEvent` (id, church_id, date, type, is_julian, is_recurring)
- [ ] `ContactTask` (id, member_id, user_id, due_date, channel, status, notes)
- [ ] `ContactHistory` (id, member_id, user_id, channel, timestamp, outcome)
- [ ] `Sacrament` (id, member_id, type, date, officiant, witnesses, place, certificate_url)
- [ ] `Sermon` (id, service_id, title, bible_ref, encrypted_content, consent_signed_at)
- [ ] `Message` (id, church_id, subject, body, channel, sent_at, sent_by)
- [ ] `Consent` (id, member_id, consent_type, given_at, revoked_at)
- [ ] `AuditLog` (id, user_id, action, resource_type, resource_id, ip, timestamp)

### REST API (14 st endpoints)
- [ ] `/auth` — login, refresh, logout, forgot-password, reset-password
- [ ] `/users` — CRUD för användare (admin)
- [ ] `/churches` — CRUD för församlingar (admin)
- [ ] `/members` — CRUD för medlemmar (RBAC-skyddat)
- [ ] `/families` — CRUD för familjer
- [ ] `/services` — CRUD för gudstjänster
- [ ] `/attendance` — bocka av närvaro per medlem/gudstjänst
- [ ] `/calendar` — kalender-händelser + juliansk-hantering
- [ ] `/contacts` — kontakthistorik + uppgifter
- [ ] `/sacraments` — CRUD för sakrament + PDF-intyg
- [ ] `/sermons` — predikan-arkiv (krypterat innehåll)
- [ ] `/messages` — kommunikations-utskick
- [ ] `/files` — filuppladdning (bilder, dokument, ljud)
- [ ] `/gdpr` — export + radering per medlem

### Inloggning + Säkerhet
- [ ] JWT access-token (15 min)
- [ ] Refresh-token i httpOnly-cookie
- [ ] bcrypt saltRounds 12
- [ ] Roller/behörighet (RBAC — se `docs/RBAC.md`)
- [ ] 2FA (TOTP eller SMS-kod)
- [ ] Rate limiting på `/auth/*`
- [ ] Kontroll av `churchId` per resurs (auktoriserings-middleware)
- [ ] Audit-logg vid känsliga åtgärder
- [ ] Kryptering av privata anteckningar + predikningar (pgcrypto AES-256)
- [ ] Zod-validering på ALLA endpoints (body, params, query)
- [ ] Prisma utan `$queryRawUnsafe`

### Kommunikation (backend)
- [ ] E-postleverantör (t.ex. SendGrid, Resend)
- [ ] SMS-leverantör (t.ex. Twilio, 46elks)
- [ ] WhatsApp Business API (för äkta massutskick)
- [ ] Kö för stora utskick (BullMQ + Redis, eller Postgres-baserad)
- [ ] Leveransstatus-tracking (webhook från leverantör)
- [ ] Samtyckeskontroll före varje utskick
- [ ] Avregistrering-flöde (unsubscribe-token per meddelande)

### AI-backend (efter frontend v.1-6)
- [ ] WebSocket-server (`server/src/websocket/`)
- [ ] Ljudsessioner (session-per-klient med Speechmatics-koppling)
- [ ] Speechmatics-integration (`server/src/services/speechmatics.ts`)
- [ ] DeepL-integration (`server/src/services/deepl.ts`)
- [ ] AR↔SV bidirektionell översättning
- [ ] Liturgisk ordlista (koptisk glossary-cache + keyterms)
- [ ] Broadcast till projektor + publik (mikrobatching 500 ms)
- [ ] Heartbeat + återanslutning (server-side)
- [ ] Säker hantering av API-nycklar (`server/.env`, aldrig i klient)
- [ ] Speaker Diarization-hantering (2 taggar: Präst/Diakon)
- [ ] Sång-detektering + `[sång pågår]`-tag

---

## v1 MVP — Drift

### Publicering
- [ ] Frontend publicerad (Vercel)
- [ ] Backend publicerad (Railway)
- [ ] Produktionsdatabas (PostgreSQL på Railway)
- [ ] HTTPS/WSS överallt
- [ ] Custom domän + SSL-certifikat
- [ ] Miljövariabler i Railway/Vercel (från `.env.example`)
- [ ] Ingen source-map i produktion

### Övervakning + drift
- [ ] Automatisk backup (Railway hanterar PostgreSQL)
- [ ] Felövervakning (Sentry — se `docs/KODSTRUKTUR-INSTRUKTION.md` Steg 10)
- [ ] Uptime-monitoring (t.ex. UptimeRobot)
- [ ] Metrics för AI-tolkning (latens, kostnad, felfrekvens)
- [ ] Alerts för kritiska fel (Slack eller e-post)
- [ ] Log-aggregering (Railway inbyggd)

### Testning + kvalitet
- [ ] Stagingmiljö (separat Railway-projekt för test)
- [ ] Integrationstester (backend + databas)
- [ ] Test med riktig kyrka (Fader Korollos församling)
- [ ] Skarpt AI-tolkning-test i faktisk gudstjänst
- [ ] Krypteringsnyckel-backup i separat vault (1Password)
- [ ] Disaster recovery-plan dokumenterad

---

## 🆕 Tillägg — verifiera om detta är relevant

Extra items som INTE finns i Simas ursprungliga lista men som är
värda att ta ställning till. Bocka av eller stryk vid genomgång.

### Sannolikt viktiga för v1

- [ ] **Notifikationer** — in-app-notifiering vid nya kontaktuppgifter, meddelanden, sakrament
- [ ] **Globalsökning** — sök över medlemmar, sakrament, predikningar i en enda sökruta
- [ ] **Statistik/rapporter** — översikt per kyrka (medlemsantal per kategori, aktivitet över tid)
- [ ] **Google Calendar-sync** för prästens privata kalender (OAuth)
- [ ] **Terms of Service / Privacy Policy** — publika sidor + länk i footer
- [ ] **Cookie-consent-banner** (GDPR-krav om cookies används)
- [ ] **Sentry** för felövervakning i produktion (finns i KODSTRUKTUR Steg 10)
- [ ] **Undo-funktion** för destruktiva åtgärder (radera medlem/predikan)
- [ ] **Version-historik** för medlemsdata (vem ändrade vad när)
- [ ] **Batch-operationer** (radera/uppdatera flera medlemmar samtidigt)

### Post-MVP v1.5–v2

- [ ] **Konfession-schemaläggning** (biktstider med bokning)
- [ ] **Rum-bokning** (kyrko-sal för dop-firande, möten m.m.)
- [ ] **Mall-system** för utskick (spara egna mallar per kyrka)
- [ ] **Utskick-schemaläggning** (redan i Kommunikation ovan)
- [ ] **Onboarding-tour** för nya användare (driver.js — se FARG-OCH-DESIGN Steg 12)
- [ ] **Inbjudan-flöde** — admin bjuder in ny präst/volontär via e-postlänk
- [ ] **Medlem-överföring** mellan kyrkor (för besökare som flyttar)
- [ ] **Tidszon-hantering** per kyrka (för multi-tenant över landsgränser)
- [ ] **Engelska UI** som språk-alternativ (för internationella användare)

### Skippa v1 (inte prioriterat)

- ~~A/B-testning av UI~~
- ~~Performance monitoring på front-end~~ (Lighthouse i CI räcker)
- ~~Sitemap.xml + SEO-optimering~~ (inte publik marknadssida)
- ~~Native mobil-app~~ (webbappen är responsiv nog)

---

## Datamodell-luckor (audit 2026-08-06 mot "Mockdata + UI-hierarki"-dokumentet)

### Saknade domain-entities

- [ ] Skapa `client/src/domain/church.ts` (multi-tenant kärna)
- [ ] Skapa `client/src/domain/user.ts` (roller + inloggning)
- [ ] Skapa `client/src/domain/family.ts` (egen entity, inte bara `familyId` på member)
- [ ] Skapa `client/src/domain/attendance.ts` (egen entity, ~600 mock-poster)
- [ ] Skapa `client/src/domain/transcript.ts` (egen entity från liveSession)

### Fält att lägga till per befintlig entity

- [ ] `Member`: `firstName` + `lastName` separat (istället för `name`), `birthDate` som Date, `role`, `joinedAt`, `lastContactAt`, `priorityScore`
- [ ] `Service`: `churchId`, `liturgyType`, `officiantId`, `deaconIds`, `expectedCount`, `sermonId`, `streamStatus`
- [ ] `Sermon`: `bibleReferences` (array istället för `bibleText`), `feastId`, `churchIds`, `officiantId`, `tags`, `transcript`, `aiDraft`, `finalVersion`
- [ ] `Event`: `type` (istället för `category`), `memberIds`, `churchId`

### Mock-omfång att utöka (för realistisk demo)

- [ ] `members.mock.ts`: 5 → 60 poster (med pravatar.cc-avatarer)
- [ ] `sacraments.mock.ts`: 2 → 40 poster
- [ ] `sermons.mock.ts`: 3 → 12 poster
- [ ] `events.mock.ts`: 6 → 15 poster
- [ ] Skapa `churches.mock.ts`: 1 post
- [ ] Skapa `users.mock.ts`: 3 poster (präst, admin, viewer)
- [ ] Skapa `families.mock.ts`: 15 poster
- [ ] Skapa `attendance.mock.ts`: ~600 poster (60 medlemmar × 10 gudstjänster)

### Struktur att fixa

- [ ] Skapa `client/src/data/mock/seed/`-mapp
- [ ] Flytta befintliga mock-data-filer under `seed/`
- [ ] Skapa mock-repositories: `mockChurchRepository`, `mockUserRepository`, `mockFamilyRepository`, `mockAttendanceRepository`

### UI-luckor från audit

- [ ] Reducera `BottomNav` från 6 → 5 items
- [ ] Skapa "Mer"-dropdown med Predikningar + Sakrament + framtida sidor
- [ ] Klickbara cirkeldiagram på Dashboard (Recharts — redan installerat)
- [ ] "Nästa gudstjänst startar om X"-widget på Dashboard

---

## Kodstruktur + prestanda (från KODSTRUKTUR-INSTRUKTION.md)

Steg 1-10 klara. Kvar:

- [ ] useDebounce-hook för sökning (aktiveras när backend + Prisma används v.7-14). Wrap `useMemberSearch` med 300 ms debounce så filter-anrop inte triggas per tangenttryck.

## Färg + design (från FARG-OCH-DESIGN-ATT-GORA.md)

Steg 1-11 klara. Kvar:

- [ ] Steg 12: Interaktiv onboarding (driver.js) — välkomstguide vid första besöket
- [ ] Steg 13: Synka DESIGN.md med index.css-tokens
- [ ] Steg 14: Steg-för-steg-flöden i stora modaler (AddMemberModal ~10 fält)
- [ ] Steg 16: shadcn/ui — utvärdera + hoppa (beslut: behåll egna komponenter)

## v1.5 Post-MVP

- [ ] Hymn-bibliotek (dropdown-val av kända hymner) — från AI-TOLKNING v1.5
- [ ] Kyrko-upload av bakgrundsbild (foto/ikon/logo)
- [ ] Import/export CSV (medlemmar + sakrament) — utökning
- [ ] Manuell text-input för spontan kör (fritext under sång)
- [ ] Semi-transparent overlay + auto-validering av bakgrund-ljushet
- [ ] Familje-/hushållsvy komplett (roller make/maka/barn)
- [ ] Roller i familjekoppling

## v2

- [ ] Auto-sync sång med Speechmatics — highlightar aktuell rad
- [ ] Liturgiska säsong-bakgrunder (vardag/fasta/jul/påsk)
- [ ] Fler språk (EN, GR, RU, SYR via samma DeepL-anrop)
- [ ] Manuell hymn-override från operatör

## v3

- [ ] Karaoke-highlighting (word-level under sång)
- [ ] Sakramentregister-analys (statistik per församling)
- [ ] AI-sammanfattning av predikan
- [ ] Chattfunktion i appen
- [ ] Videohälsning till frånvarande

## Post-MVP (från Dokument 2)

- [ ] Gåvor + kollekt-modul (online giving + årsöversikter)
- [ ] Volontärplanering (schema + tjänstgöringstimmar)
- [ ] Barncheck-in (unika hämtningskoder + tidsstämplade loggar)
- [ ] Medlemsportal (medlemmar uppdaterar själva sina uppgifter)
- [ ] Donationsmodul
- [ ] Koppling till Bibel-appen via API

---

## Referenser

- Detaljerad AI-tolkning: `docs/AI-TOLKNING.md`
- Systemarkitektur: `docs/ARCHITECTURE.md`
- Säkerhet: `docs/SECURITY.md`
- Design: `docs/DESIGN.md`
- PoC vecka 1: `docs/POC-VECKA-1.md`
- Ursprunglig ROADMAP: `ROADMAP.md`
- Sakrament-detaljer: `docs/SAKRAMENT.md`
- Multi-kyrka-arkitektur: `docs/MULTI-KYRKA.md`
- RBAC-strategi: `docs/RBAC.md`
- Kodstruktur-att-göra: `docs/KODSTRUKTUR-INSTRUKTION.md`
- UX + a11y-att-göra: `docs/UX-A11Y-INSTRUKTION.md`
- Färg + design-att-göra: `docs/FARG-OCH-DESIGN-ATT-GORA.md`
