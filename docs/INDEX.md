# 📚 ParishHub Dokumentation — Hitta rätt

Osäker på var du ska leta? Denna sida visar exakt vilket dokument du
öppnar för varje fråga.

**Öppna denna först** varje gång du är osäker.

Uppdaterad: 2026-08-06

---

## 🎯 "Vad gör jag idag?"

**→ Öppna:** [`docs/BACKLOG.md`](./BACKLOG.md)
**Innehåller:** Enda listan över allt som är kvar (280+ checkboxes).
**Använd när du:** vill veta nästa steg, bocka av klara uppgifter.

## 🏛 "Hur fungerar systemet arkitekturmässigt?"

**→ Öppna:** [`docs/ARCHITECTURE.md`](./ARCHITECTURE.md)
**Innehåller:** Överblick, dataflöde, multi-tenant, tekniska val.
**Använd när du:** funderar på hur delarna hänger ihop, planerar ny funktion.

## 🔒 "Säkerhet, GDPR, roller?"

**→ Öppna:** [`docs/SECURITY.md`](./SECURITY.md)
**Innehåller:** JWT, roller (RBAC), kryptering, audit-loggar, filuppladdning.
**Använd när du:** ska bygga inloggning, hantera användarrätt, uppladdning.

## 🎨 "Design, färger, typografi?"

**→ Öppna:** [`docs/DESIGN.md`](./DESIGN.md)
**Innehåller:** Varm Olivsten-palett, typografi, komponenter, bakgrundsbilder.
**Använd när du:** ändrar färg, väljer font, designar ny sida.

## 🤖 "AI-tolkningen?"

**→ Öppna:** [`docs/AI-TOLKNING.md`](./AI-TOLKNING.md)
**Innehåller:** Speechmatics + DeepL, arkitektur, PoC-Vecka-1-plan.
**Använd när du:** bygger tolknings-funktioner, integrerar mikrofonen.

## 📖 "Redovisa för LIA-läraren?"

**→ Öppna:** [`docs/REDOVISNING.md`](./REDOVISNING.md)
**Innehåller:** Sida-för-sida-beskrivning, teknik-motiveringar.
**Använd när du:** ska presentera projektet, förklara val.

## ❓ "Något gick fel — vad gjorde jag förra gången?"

**→ Öppna:** [`docs/TROUBLESHOOTING.md`](./TROUBLESHOOTING.md)
**Innehåller:** Fel du löst tidigare + lösningar.
**Använd när du:** har samma fel som förut, letar snabb lösning.

## 📝 "Vad gjorde jag igår?"

**→ Öppna:** [`DAGBOK.md`](../DAGBOK.md)
**Innehåller:** Dags-loggar, milstolpar.
**Använd när du:** vill komma ihåg vad som hände, se din progress.

## 🗺 "Vad är projektets vision?"

**→ Öppna:** [`ROADMAP.md`](../ROADMAP.md)
**Innehåller:** 12 funktioner, faser, tidslinje.
**Använd när du:** förklarar för någon, planerar långsiktigt.

## 📋 "Vad har jag redan gjort? (version-historik)"

**→ Öppna:** [`CHANGELOG.md`](../CHANGELOG.md)
**Innehåller:** 0.1.0, 0.2.0, 0.3.0, 0.4.0 med detaljer.
**Använd när du:** rapporterar framsteg, ska skriva CV.

## 💼 "CV-material?"

**→ Öppna:** [`CV-BULLETS.md`](../CV-BULLETS.md)
**Innehåller:** Konkreta punkter för LIA-CV.
**Använd när du:** söker LIA-plats, uppdaterar CV.

## 🧑‍💻 "Regler för Claude att följa?"

**→ Öppna:** [`CLAUDE.md`](../CLAUDE.md)
**Innehåller:** Kodregler, kommentarsstil, säkerhet, arbetssätt.
**Använd när du:** startar en ny session med Claude, vill påminna om regler.

## 📘 "Mall för nästa projekt?"

**→ Öppna:** [`docs/MALL-SETUP.md`](./MALL-SETUP.md)
**Innehåller:** 14-stegs mall för att sätta upp Claude Code + docs i nytt projekt.
**Använd när du:** startar ett nytt projekt och vill ha samma setup.

---

## 🗂 Struktur — hur mapparna hänger ihop

```
ParishHub/
├── README.md           ← Startpunkt för nya besökare
├── CLAUDE.md           ← Instruktioner för Claude Code
├── ROADMAP.md          ← Vision + faser
├── CHANGELOG.md        ← Vad har ändrats när
├── DAGBOK.md           ← Din dagliga logg
├── CV-BULLETS.md       ← LIA-material
├── NOTES.md            ← Privat teknisk logg (i .gitignore)
├── client/             ← All React-kod
├── server/             ← All backend-kod (v.7+)
└── docs/
    ├── INDEX.md        ← DU ÄR HÄR (hitta rätt)
    ├── BACKLOG.md      ← Enda tasks-listan
    ├── ARCHITECTURE.md ← Systemarkitektur
    ├── SECURITY.md     ← Säkerhet + RBAC
    ├── DESIGN.md       ← Design
    ├── AI-TOLKNING.md  ← AI-tolkning + PoC-Vecka-1
    ├── REDOVISNING.md  ← För LIA
    ├── TROUBLESHOOTING.md ← Fel + lösningar
    ├── MALL-SETUP.md   ← Mall för nya projekt
    ├── examples/       ← Körbar mock-kod
    └── archive/        ← Gamla/klara docs
```

---

## 🌅 Slutet av dagen — dokumentations-flöde

Vid slutet av varje kod-dag:

1. **Öppna** [`DAGBOK.md`](../DAGBOK.md) (alltid — även korta dagar)
2. **Bocka av** klara tasks i [`docs/BACKLOG.md`](./BACKLOG.md)
3. **Berätta för Claude** vad du gjort — den ställer reflektionsfrågor
   och hjälper skriva rätt filer

Se [`CLAUDE.md`](../CLAUDE.md) sektion **"📝 Dagens dokumentation"** för
fullständig lista av frågor + regler.

**Regel:** aldrig hoppa DAGBOK.md — även 30 min-dagar loggas för
komplett LIA-historik.

---

## 🎓 Pedagogisk princip

Varje dokument har ett tydligt syfte + "använd när"-guide. Om du är
osäker vart något ska ligga, öppna denna INDEX först.

**Regel:** BACKLOG.md är den enda platsen med checkbox-tasks. Alla
andra docs beskriver ARKITEKTUR, KRAV eller BAKGRUND — inte tasks.
