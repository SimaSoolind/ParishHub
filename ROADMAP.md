# 🗺 ROADMAP — ParishHub (Kyrko-appen)

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
| Backend (server/) | ⚪ 0% | Startar vecka 3-4 av studieplan |
| Databas (PostgreSQL) | ⚪ 0% | Startar vecka 5-6 |
| Auth (JWT) | ⚪ 0% | Startar vecka 7 |
| AI-tolkning (Deepgram) | ⚪ 0% | Startar vecka 8 |
| Publicering | ⚪ 0% | Efter LIA |

---

## 🎯 12 HUVUDFUNKTIONER — Status per funktion

---

### 1. 🔐 Inloggning & Säkerhet — ⚪ KVAR (vecka 7)

**Vad:** Prästen loggar in säkert med 2FA

**Delfunktioner:**
- ⚪ E-post + lösenord-inloggning
- ⚪ 2FA (SMS-kod)
- ⚪ Automatisk utloggning vid inaktivitet
- ⚪ Aktivitetslogg (vem loggade in när)
- ⚪ Roll-baserad behörighet

**Beroenden:** Backend + JWT

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
- ⚪ Ladda upp profilbild

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

### 5. ⛪ Gudstjänstvyer — 🔵 70% KLART

**Vad:** Registrera närvaro under gudstjänst

**Delfunktioner:**
- ✅ En vy per gudstjänst/samling (skapa med namn-förslag + start/sluttid)
- ✅ Vyerna grupperade och sorterade efter datum (Kommande/Tidigare)
- ✅ Bocka av Närvarande/Frånvarande per medlem
- ✅ Snabb registrering + status-badge (X närvarande)
- ⚪ Vid frånvaro välja orsak (sjuk, resa, okänd)
- ⚪ Kontaktstatus per frånvarande

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

### 10. 🔒 Krypterade Privata Anteckningar — ⚪ KVAR (vecka 7-8)

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

### 12. 🤖 AI-tolkning av Gudstjänsten Live — ⚪ KVAR (vecka 8)

**Vad:** Live-tolkning på skärm under gudstjänst

**Delfunktioner:**
- ⚪ Prästen startar via kyrkoappen
- ⚪ Mikrofonen fångar prästens tal
- ⚪ Deepgram konverterar tal → arabisk text (realtid)
- ⚪ DeepL översätter arabiska → svenska
- ⚪ Text visas på kyrkans skärm (BÅDA språk)
- ⚪ WebSocket för snabb överföring
- ⚪ OBS Studio-integration för YouTube-sändning
- ⚪ Predikan sparas i arkiv efteråt

**Beroenden:** Backend + WebSocket + Deepgram + DeepL

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

### 🔧 Fas 3 — Avancerat
- ⚪ Flera admins med olika behörigheter
- ⚪ Stöd för flera församlingar
- ⚪ Statistik-dashboard med diagram per år
- ⚪ Koppling till Google Calendar
- ⚪ Automatisk GDPR-rensning

### 🤖 Fas 4 — Framtid & AI
- ⚪ AI-sammanfattning: vem behöver extra omsorg denna vecka
- ⚪ Chattfunktion i appen
- ⚪ Kort videohälsning till frånvarande
- ⚪ Donationsmodul
- ⚪ Koppling till Bibel-appen via API

---

## 📅 STUDIEPLAN — vecka för vecka

| Vecka | Datum | Fokus | Status |
|-------|-------|-------|--------|
| — | Nu | Frontend UI (Dashboard, Medlemmar, Kalender) | 🔵 pågår |
| 3-4 | 15-28 juli | Express.js + REST API | ⚪ senare |
| 5-6 | 29 jul-11 aug | PostgreSQL + Prisma | ⚪ |
| 7 | 12-18 aug | JWT + bcrypt | ⚪ |
| 8 | 19-31 aug | Deepgram + koppla frontend/backend | ⚪ |

---

## 🎯 NÄSTA 3 STEG

1. **⏳ Frånvaro-orsak + kontaktstatus** i närvaron (funktion 5)
2. **⏳ Backend** — Express + Prisma så data sparas permanent (v.3-6)
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
- ⏳ **Nästa milstolpe:** Första riktiga API-anropet (backend, v.3-4)

---

*Uppdaterad av Sima. En sak i taget. En dag i taget. 💜✝*