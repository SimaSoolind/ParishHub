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

---

## 📅 Dag-för-dag

---

### 🗓 Tisdag 22 juli 2026 — Dag 1

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

### 🗓 Onsdag 23 juli 2026 — Dag 2

**⏱ Tid:**
**🎯 Mål för dagen:**
- Lägga till alla komponenter
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

### 🗓 LÖrdag 25 juli 2026 — Dag 3

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

- [ ] Första ParishHub-sidan på skärmen — **22 juli 2026** ✅
- [ ] Första Express-servern igång
- [ ] Första databaskopplingen till PostgreSQL
- [ ] Första JWT-inloggningen fungerar
- [ ] Första AI-tolkningen live via Deepgram
- [ ] Första gången någon annan använder appen
- [ ] Appen används i riktig gudstjänst
- [ ] Appen släppt i App Store / Google Play

---
