# 🗺 ROADMAP — ParishHub (Kyrko-appen)

> **Syfte:** Vision + faser + 12 funktioner på hög nivå.
> **Använd när:** du förklarar för någon, planerar långsiktigt.
> **Se även:** [`docs/BACKLOG.md`](./docs/BACKLOG.md) för konkreta tasks, [`docs/INDEX.md`](./docs/INDEX.md) för alla docs.

**Byggd av:** Sima Soolind
**Uppdaterad:** 3 augusti 2026
**Syfte:** En SAMLAD plats för alla funktioner och deras status

**Status-symboler:**
- ✅ **KLART** — fungerar
- 🔵 **PÅGÅR** — arbetar på nu
- ⏳ **NÄSTA** — snart planerad
- ⚪ **KVAR** — inte startad
- 🚫 **VÄNTAR** — kräver något annat först

---

## 📊 Övergripande status

| Del | Status | Kommentar |
|-----|--------|-----------|
| Frontend (client/) | 🔵 70% | Dashboard, Medlemmar (CRUD+familj+WhatsApp), Kalender, Gudstjänster+närvaro klara |
| Backend (server/) | ⚪ 0% | Startar vecka 7-14 (15-20 h/vecka) |
| Databas (PostgreSQL) | ⚪ 0% | Startar vecka 7-9 |
| Auth (JWT) | ⚪ 0% | Startar vecka 10-11 |
| AI-tolkning (Speechmatics) | ⚪ 0% | Startar vecka 12-14 |
| Publicering | ⚪ 0% | Efter LIA |

---

## 🎯 12 HUVUDFUNKTIONER — Status per funktion

---

### 1. 🔐 Inloggning & Säkerhet — ⚪ KVAR (vecka 10-11)

**Vad:** Prästen loggar in säkert med 2FA

**Delfunktioner:**
- ⚪ E-post + lösenord-inloggning
- ⚪ 2FA (SMS-kod)
- ⚪ Automatisk utloggning vid inaktivitet
- ⚪ Aktivitetslogg (vem loggade in när)
- ⚪ Roll-baserad behörighet

**Beroenden:** Backend + JWT

> Se konkret backend-säkerhets-checklista under Fas 3 nedan.

---

### 2. 👥 Medlemsregister — 🔵 85% KLART

**Vad:** Hantera alla medlemmar i församlingen

**Delfunktioner:**
- ✅ Visa lista med medlemmar
- ✅ Sök på namn
- ✅ Filtrera på kategori (Vuxen/Ungdom/Ledare/Övrig)
- ✅ Ring och Mejla direkt från listan
- ✅ Lägg till ny medlem (formulär med Zod-validering)
- ✅ Redigera medlem
- ✅ Radera medlem (med bekräftelse)
- ✅ Adress + anteckningar per medlem
- ✅ Profil-modal (klick på medlem)
- ✅ Grupputskick (bocka flera → WhatsApp)
- ✅ Ladda upp profilbild (kamera + fil, base64)

**Beroenden:** Backend för att spara/hämta permanent

---

### 3. 👨‍👩‍👧 Familjekoppling — 🔵 60% KLART

**Vad:** Koppla familjemedlemmar till varandra

**Delfunktioner:**
- ✅ Koppla medlemmar till samma familj (familyId)
- ✅ Se familjemedlemmar i profilen (klickbara)
- ✅ Kontakta familjemedlemmar från profilen (WhatsApp)
- ✅ Lägg till fler familjemedlemmar
- ✅ Ta bort ur familjen
- ⚪ Skilja på roller (make/maka, barn)
- ⚪ Se hela familjens närvaro på en plats

**Beroenden:** Backend + databas med relationer för att spara kopplingarna permanent

---

### 4. 🎂 Födelsedagspåminnelser — 🔵 30% KLART

**Vad:** Prästen ser vem som fyller år

**Delfunktioner:**
- ✅ Visa födelsedagar på Dashboard (denna vecka)
- ✅ Ring direkt från påminnelsen
- ⚪ SMS direkt från påminnelsen
- ⚪ Inkludera familjemedlemmar (inte bara medlem själv)
- ⚪ Automatiska påminnelser i förväg
- ⚪ Ålder + datum

**Beroenden:** Familjekoppling + SMS-tjänst

---

### 5. ⛪ Gudstjänstvyer — 🔵 90% KLART

**Vad:** Registrera närvaro under gudstjänst

**Delfunktioner:**
- ✅ En vy per gudstjänst/samling (skapa med namn-förslag + start/sluttid)
- ✅ Vyerna grupperade och sorterade efter datum (Kommande/Tidigare)
- ✅ Bocka av Närvarande/Frånvarande per medlem
- ✅ Snabb registrering + status-badge (X närvarande)
- ✅ Vid frånvaro välja orsak (sjuk/resa/okänd/annat) — 3 aug 2026
- ✅ Kontaktstatus per frånvarande (Ej kontaktad/Försökt/Svarat) — 3 aug 2026

**Prioritering:** Hög — kärnfunktion

---

### 6. ⚠️ Smarta Påminnelser — 🔵 40% KLART

**Vad:** Automatisk att-göra-lista för prästen

**Delfunktioner:**
- ✅ Prioritetslista visas på Dashboard
- ✅ Kontaktstatus per person (Ej kontaktad / Försökt / Svarat)
- ⚪ Automatisk generering baserat på frånvaro
- ⚪ Uppdateras när prästen markerar kontakt
- ⚪ Uppföljningsdatum (påminn mig 1 juli)
- ⚪ Sortering efter prioritet

**Beroenden:** Gudstjänstvyer + backend

---

### 7. 📞 Direktkontakt — 🔵 70% KLART

**Vad:** Ring, mejla, WhatsApp direkt från appen

**Delfunktioner:**
- ✅ Ring-knapp öppnar telefonens uppringare
- ✅ Mejla-knapp öppnar e-postprogrammet
- ✅ WhatsApp direkt från profilen (färdiga mallar, {namn} fylls i)
- ✅ Grupputskick via WhatsApp — bocka flera, skicka en i taget (frontend)
- 🚫 Äkta grupp-blast (alla på en gång) — kräver WhatsApp Business API via backend
- ⚪ SMS direkt från appen
- ⚪ Färdiga e-postmallar

**Beroenden:** WhatsApp Business API + backend (för äkta grupputskick)

---

### 8. 📊 Dashboard & Statistik — 🔵 70% KLART

**Vad:** Startsida med översikt

**Delfunktioner:**
- ✅ Antal medlemmar totalt
- ✅ Antal närvarande idag
- ✅ Antal som väntar på kontakt
- ✅ Prioriterad kontaktlista högst upp
- ✅ Veckans födelsedagspåminnelser
- ⚪ Närvaro i procent per gudstjänst
- ⚪ Graf över närvaro senaste veckorna

**Beroenden:** Gudstjänstvyer + Recharts (redan installerat)

---

### 9. 📋 Historikkort per Medlem — 🔵 40% KLART

**Vad:** Detaljerad profilvy per medlem

**Delfunktioner:**
- ✅ Klick på medlem → visa profil-modal (all info)
- ✅ Familjemedlemmar visas i profilen (klickbara)
- ✅ Anteckningar per medlem
- ⚪ Närvaro senaste månader (visuell graf)
- ⚪ Datum för senaste kontakt
- ⚪ GDPR-samtyckesstatus

**Prioritering:** Mellan

---

### 10. 🔒 Krypterade Privata Anteckningar — ⚪ KVAR (vecka 10-11)

**Vad:** Prästens privata minnesanteckningar per person

**Delfunktioner:**
- ⚪ Anteckningsfält per medlem
- ⚪ Anteckningar krypteras i databasen
- ⚪ Endast prästen kan läsa (efter inloggning)
- ⚪ Även vid databashack kan ingen läsa
- ⚪ Förberedelser inför samtal

**Beroenden:** JWT + kryptering (crypto Node.js) + backend

---

### 11. ✅ GDPR-hantering — ⚪ KVAR

**Vad:** Följa GDPR-lag automatiskt

**Delfunktioner:**
- ⚪ Datum för samtycke sparas per person
- ⚪ Automatisk flagg för inaktiva medlemmar (radera-förslag)
- ⚪ Export till Excel för säkerhetskopiering
- ⚪ Tydligt val för att radera all data

**Beroenden:** Backend + databas + ExcelJS (redan installerat)

---

### 12. 🤖 Live-tolkning under gudstjänst — ⚪ KVAR (frontend v.1-6, backend v.12-14)

**Vad:** AI-tolkning: AR ↔ SV (bidirektionell). Koptiska liturgiska fraser
via keyterms. Framtida: fler språk.

**Vision:** Församlingen ska följa predikan i realtid på båda språk via
projektor + YouTube. Kärnfunktion för mångspråkiga församlingar.

Se `docs/AI-TOLKNING.md` för fullständig teknisk plan (Deep Research-spec).
Startpunkt: `docs/POC-VECKA-1.md`.

> **Alla tasks (v1/v1.5/v2/v3) finns i `docs/BACKLOG.md` under "AI-tolkning" + "AI-backend".**
> Denna sektion beskriver bara VAD funktionen är — inte HUR den byggs.

**Beroenden:** Frontend (v.1-6) klart FÖRE backend byggs. Backend = Speechmatics + DeepL + WebSocket-server + hymn-databas.

---

## 📱 FYRA UTVECKLINGSFASER

### 🌱 Fas 1 — Enkla tillägg ✅ KLAR
- ✅ Mörkt/ljust läge (tema-knapp + semantiska färgklasser) — 3 aug 2026
- ✅ Flera språk (svenska/arabiska via i18next + RTL) — 3 aug 2026
- ✅ Profilbild per medlem (initial-avatar + valfri länk) — 3 aug 2026
- ✅ Kortnotering per gudstjänst (redigeras i närvaro-modalen) — 3 aug 2026

### ⚙️ Fas 2 — Smartare funktioner
- ⚪ Automatiska SMS-påminnelser inför gudstjänst
- ⚪ Bönelista (privat)
- ⚪ Händelsekalender (dop, bröllop, begravning)
- ⚪ Dokument per medlem (scan av samtycken)
- ⚪ Uppföljningsdatum för kontakt
- ⚪ DOMPurify när rich-text-fält läggs till (privata anteckningar, predikan-arkiv)

### 🔧 Fas 3 — Avancerat
- ⚪ Flera admins med olika behörigheter
- ⚪ Stöd för flera församlingar
- ⚪ Statistik-dashboard med diagram per år
- ⚪ Koppling till Google Calendar
- ⚪ Automatisk GDPR-rensning

#### 🔒 Backend-säkerhet checklista (aktiveras Fas 3, vecka 7-14)

Konkreta säkerhetsuppgifter som MÅSTE göras när backend byggs.
Full beskrivning i `docs/SECURITY.md`.

**Cookies + Auth:**
- [ ] Refresh-token i httpOnly + Secure + SameSite=Strict-cookie
- [ ] Access-token kort livslängd (15 min)
- [ ] bcrypt saltRounds ≥ 10

**Input + validering:**
- [ ] Zod-validering på ALLA endpoints (body, params, query)
- [ ] Auktoriserings-middleware kollar `parishId` per resurs
- [ ] Prisma utan `$queryRawUnsafe`

**Filuppladdning:**
- [ ] Magic bytes-validering (inte MIME från webbläsaren)
- [ ] Sanera filnamn → UUID
- [ ] Storleksgräns även på server
- [ ] Antivirus-skanning (ClamAV) om disk-sparning
- [ ] Separat CDN-bucket för uppladdade filer

**Nätverk + headers:**
- [ ] helmet (CSP, HSTS, X-Frame-Options)
- [ ] cors med allowlist — aldrig `origin: "*"`
- [ ] express-rate-limit på /login (5 försök / 15 min)

**CI + drift:**
- [ ] Snyk sårbarhets-scan (KODSTRUKTUR Steg 9)
- [ ] Semgrep SAST (KODSTRUKTUR Steg 7)
- [ ] Inga source maps i produktion

Se `docs/SECURITY.md` för fullständiga kod-exempel och motiveringar.

### 🤖 Fas 4 — Framtid & AI
- ⚪ AI-sammanfattning: vem behöver extra omsorg denna vecka
- ⚪ Chattfunktion i appen
- ⚪ Kort videohälsning till frånvarande
- ⚪ Donationsmodul
- ⚪ Koppling till Bibel-appen via API

---

## 📅 STUDIEPLAN — plan-ordning

| Fas | Fokus | Status |
|-----|-------|--------|
| Nu | Frontend UI (Dashboard, Medlemmar, Kalender, Gudstjänster) | ✅ klart |
| Fas 3 | Express.js + REST API | ⚪ senare |
| Fas 4 | PostgreSQL + Prisma | ⚪ senare |
| Fas 5 | JWT + bcrypt | ⚪ senare |
| Fas 6 | Speechmatics + koppla frontend/backend | ⚪ senare |

---

## 🎯 NÄSTA 3 STEG

1. **⏳ Backend** — Express + Prisma så data sparas permanent (v.7-14)
2. **⏳ Historikkort med graf** (Recharts, redan installerat)
3. **⏳ Fas 2** — automatiska påminnelser, bönelista, uppföljningsdatum

---

## 💡 SÅ HÄR ANVÄNDER DU DENNA FIL

**Varje morgon när du börjar:**
1. Öppna ROADMAP.md
2. Titta i "NÄSTA 3 STEG"
3. Välj vilken du bygger idag
4. Efter dagens arbete — uppdatera statusen

**Varje fredag:**
1. Öppna hela ROADMAP.md
2. Uppdatera statusar (✅/🔵/⏳)
3. Fira det som blev klart

---

## 🏆 KLARA MILSTOLPAR

- ✅ **22 juli 2026** — Första ParishHub-sidan på skärmen
- ✅ **23 juli 2026** — Dashboard komplett
- ✅ **28 juli 2026** — Kalender med full CRUD + koptiska högtider + fullständig dokumentation
- ✅ **30 juli 2026** — Medlems-CRUD, Gudstjänst-modul + närvaro, säkerhet, tester & CI
- ✅ **3 augusti 2026** — Familjekoppling + WhatsApp (person, familj, grupputskick)
- ✅ **3 augusti 2026** — Hela appen tvåspråkig (svenska/arabiska + RTL)
- ✅ **3 augusti 2026** — Mörkt läge på hela appen (tema-knapp + DRY färgklasser)
- ✅ **3 augusti 2026** — Fas 1 komplett (mörkt läge, flerspråkighet, profilbilder, kortnoteringar)
- ✅ **3 augusti 2026** — Clean Architecture på alla sidor (domän · repository · hook)
- ⏳ **Nästa milstolpe:** Första riktiga API-anropet (backend, v.7-14)

---

*Uppdaterad av Sima. En sak i taget. En dag i taget. 💜✝*

---

> **Se `docs/BACKLOG.md` för fullständig checklista över allt som är kvar att göra.**
> BACKLOG-filen är den enda samlade "single source of truth" för scope och tasks.