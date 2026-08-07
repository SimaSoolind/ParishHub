# 🧭 Beslut och motiveringar — ParishHub

> **Syfte:** Fånga VARFÖR viktiga tekniska val gjordes — inte bara vad.
> **Använd när:** du (eller någon annan) undrar "varför är det byggt så här?" innan du bygger vidare eller ändrar.
> **Uppdatera:** när ett större val görs eller ändras.

Varje post: **Beslut** · **Varför** · (ev.) **Alternativ / Status**.

---

## Arkitektur

### Frontend först, mot mockdata
**Beslut:** Bygg hela frontend mot mock-repositories innan backend byggs.
**Varför:** UI-flödet kan verifieras direkt utan att vänta på server/databas. När backend
kommer byts EN import-rad per hook (mock → api) — inga ändringar i sidor/komponenter.

### Clean Architecture (domain → repository → hook → sida)
**Beslut:** All data går via ett gränssnitt (`domain/repositories/`) med en mock-implementation.
**Varför:** UI:t blir oberoende av datakällan. Lätt att testa (ren logik i `use-cases/`) och
lätt att byta mock mot API senare. Se `docs/ARCHITECTURE.md`.

### Ingen global state/Context än
**Beslut:** Enkla localStorage-hookar (`useTheme`, `useFontScale`, `useCalendarSystem`) i stället
för React Context.
**Varför:** Appen har en användare i taget nu. Context behövs först vid inloggning + multi-kyrka
(delad state mellan användare). Skjuts till backend-fasen (se `docs/BACKEND-ATT-GORA.md`).

## Validering och formulär

### Zod som ENDA valideringskälla
**Beslut:** Ett schema per entitet i `schemas/`, återanvänt i formulär nu och i API-svar senare.
Gemensamma fält-byggare i `schemas/fields.ts` (`requiredText`, `optionalText` …).
**Varför:** Ingen dubblerad valideringslogik (DRY). Samma regel gäller i klient och (framtida)
backend — ändras på ett ställe.

### Översatta valideringsfel via global felkarta
**Beslut:** `schemas/zodErrorMap.ts` översätter fel efter feltyp; scheman har inga hårdkodade
meddelanden.
**Varför:** En arabisktalande präst ska se arabiska fel automatiskt. I Zod 4 vinner ett schema-eget
meddelande över felkartan — därför måste meddelandena bort ur schemana.

## AI-tolkning och liturgi

### AI-tolkning byggd mot mock + BroadcastChannel
**Beslut:** Två/tre vyer (kontroll, projektor, YouTube) synkas via `BroadcastChannel` i mock-läget.
**Varför:** Hela UI-flödet kan byggas och demas utan att betala för STT/DeepL. I drift ersätts
kanalen av WebSocket-broadcast från servern.

### Förberedd liturgi som komplement till AI
**Beslut:** Fasta delar av liturgin visas direkt på projektorn; AI-tolkning körs bara för predikan.
**Varför:** Live-STT kostar per minut och är dålig på mässande/sång. Förberedd + föröversatt text
är gratis att visa och alltid korrekt. AI behövs bara för det som är nytt varje gång (predikan).

### Liturgi: bibliotek + dokument (PDF) + manuellt — inte JSON för prästen
**Beslut:** Prästen väljer ur bibliotek, laddar upp PDF, eller skriver manuellt. JSON är bara
internt biblioteks-format.
**Varför:** En präst vet inte vad en JSON-fil är; de har PDF/PowerPoint. Realistiskt gränssnitt
väger tyngre än teknisk bekvämlighet.

### Öppet val: Speechmatics vs Deepgram (STT)
**Status:** Ej fastställt. Rapporten rekommenderar Speechmatics (diarisering, koptiska inslag),
men README/CLAUDE.md nämner Deepgram. Reconcile dokumentationen när beslutet tas.

## Design

### Amiri för arabiska rubriker, Cairo för brödtext
**Beslut:** Arabiska rubriker använder Amiri (klassiskt naskh-serif), brödtext Cairo (modern sans).
**Varför:** Svenska rubriker använder Cormorant Garamond (klassisk serif) — Amiri matchar den
känslan; Cairo ger lättläst brödtext. Arabiska får även större radavstånd (tätare skrift).

### Projektorn alltid mörk "Varm Olivsten"
**Beslut:** Projektor-vyn är alltid mörk, oberoende av appens tema, med AAA-kontrast + textskugga.
**Varför:** Projektorn står i en dunkel kyrksal; ljus text på mörk botten är mest läsbar på håll.

### Återanvändbara komponenter (Card, Badge-wrappers, SegmentedControl …)
**Beslut:** Bryt ut kort-skalet till `Card`; behåll däremot semantiskt namngivna wrappers
(`LiveStatusBadge`, `SpeakerTag`) separata.
**Varför:** Nästan identisk struktur (kort-skalet, 30 ggr) ska vara EN komponent. Men två
komponenter med tydliga, olika syften (status vs talare) hålls isär även om de ser lika ut.

## Kvalitet

### Tester på use-cases och hooks, med DRY-helpers
**Beslut:** Ren logik testas i `use-cases/`; hookar testas med `renderHook` + gemensamma helpers
(`test/hookHelpers.ts`, `test/factories.ts`).
**Varför:** Ren affärslogik är mest värdefull och lättast att testa. Helpers gör testerna korta
och lätta att underhålla (samma DRY-princip som i app-koden).

### Beroenden hålls uppdaterade
**Beslut:** `npm audit` som fast rutin; skilj dev-/CI-sårbarheter från produktions-beroenden.
**Varför:** Gamla beroenden blir snabbt en säkerhetsrisk. Se `docs/SECURITY.md` sektion 11.
