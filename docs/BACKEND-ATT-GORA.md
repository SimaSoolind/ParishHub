# Backend — att göra (krav från frontend-modulerna)

**Uppdaterad:** 2026-08-06
**Syfte:** `docs/BACKLOG.md` har den övergripande backend-planen (server, databas, REST, auth,
AI). Denna fil fångar de KONKRETA backend-krav som frontend byggd i augusti 2026 skapat — det
som måste kopplas in när backend byggs. Varje punkt pekar på vilken frontend-del som väntar.

---

## 0. Prioritering (beslut 2026-08-06)

- **Multi-kyrka är prio 1 i backend-fasen — byggs FRÅN DAG 1.** `churchId` måste finnas på ALLA
  entiteter direkt (medlemmar, gudstjänster, sakrament, påminnelser ...). Att lägga till det i
  efterhand kräver smärtsam datamigrering, och utan det blandas medlemmar mellan kyrkor. UI:t för
  att växla kyrka kan komma strax efter, men databas-isoleringen måste vara på plats direkt.
- **Full UI-översättning** till fler språk görs **on demand** — i slutet av projektet eller efter
  lansering, styrt av kundefterfrågan. i18n-infrastrukturen finns redan (react-i18next); ett nytt
  språk = en ny språkfil. Lansera med **svenska + arabiska**. Medlemmens språk*preferens* lagras
  redan (sv, ar, en, el, ru, syr) så datan är redo den dagen ett språk läggs till.
- **Meddelande på rätt språk per medlem** byggs i backend-fasens meddelande-modul.

---

## 1. Delad state / React Context (kräver auth + multi-kyrka)

- Frontend har medvetet INGEN React Context än (bekräftat — hooks + repositories räcker nu).
- **Live-synk saknas idag** eftersom varje hook har egen state:
  - Närvaro-avprickning på Dashboard uppdaterar inte grafen/KPI-korten förrän omladdning.
  - Siffran "påminnelser" i "Att göra idag" uppdateras vid omladdning.
- När backend finns: inför Context (eller React Query mot API) för **inloggad användare** och
  **vald kyrka**, så alla vyer delar samma levande data.

## 2. Multi-kyrka (Modul 3, avsnitt 6.3)

- `member_churches` (mång-till-mång) + `user_church_roles`.
- churchId-context: växla kyrka i headern → alla vyer och rapporter filtreras per kyrka.
- Filter per kyrka i alla listor (medlemmar, sakrament, påminnelser, kalender).
- Inställningar per kyrka (t.ex. frånvaro-regelns "X veckor", tradition, tema, bakgrund).

## 3. Auth + roller (RBAC)

- Bara **präst-roll** får skapa/redigera sakrament (rollcheck i backend; döljs i UI).
- Inloggning styr "av vem" på kontakter och närvaro (`markedBy` finns i datamodellen).

## 4. Sakrament

- **Kryptering i vila** (AES-256 / pgcrypto), särskilt bikt-anteckningar.
- **Bikt:** bara datum lagras, aldrig innehåll — UI garanterar det redan, backend måste också.
- **GDPR-samtycke** (art. 9) sparas vid registrering (UI har kryssrutan; spara samtycke + tid).
- **PDF-generering** av officiella intyg (UI har bara ett länk-fält idag).
- **Export** av sakramentsöversikten (till stiftet).
- Äktenskap: `partnerId` finns — verifiera/spegla relationen i databasen.

## 5. Predikningar

- **AI-transkription/sammanfattning** (Speechmatics/DeepL/LLM) — UI har en notis om att det kommer.
- **Fil-uppladdning** för ljud/video (UI har URL-fält idag).
- **Publicera för medlemmar** (medlemsportal).

## 6. Gudstjänst / Streaming

- YouTube-streaming: **CSP måste tillåta `frame-src https://www.youtube.com`** (helmet) i
  produktion, annars blockeras den inbäddade spelaren. I dev fungerar den.
- Predikan-arkiv per gudstjänst (metadata) om det ska vara skilt från predikobiblioteket.

## 7. Påminnelser & regler

- **Spara snooza/klar-status** (idag UI-state som nollställs vid omladdning).
- **Sökbar historik** över påminnelser och kontakter.
- **Schemalagd notis** vid specifik tid (påminnelse-datum finns; själva notisen kräver backend/push).
- **Konfigurerbart "X veckor"** för frånvaro-regeln per kyrka.
- Kontaktuppföljning: spara vem som kontaktade + när.

## 8. Massmeddelanden (Modul 3, avsnitt 6.4)

- **SMS-kanal** (t.ex. Twilio).
- **E-post massutskick** server-sänt (inte bara `mailto:`).
- **Äkta WhatsApp-grupputskick** via WhatsApp Business API (alla på en gång).
- **Riktiga segment:** nya besökare, nyligen givna, slutat komma, volontärer, föräldrar till barn
  under 12 — kräver besöks-, gåvo- och ålders-data.
- Historik över utskick + respektera samtycke och språkpreferens per mottagare.

## 9. Kalender

- **Google Calendar-synk** (OAuth) — knapp finns i UI, funktion saknas.
- Outlook-synk (senare).

## 10. Medlemmar

- **Namn i separata delar** (förnamn/mellannamn/efternamn) — idag ett `name`-fält + föredraget
  namn. Kräver datamigrering.
- **Språkpreferens** (`language`) ska användas vid utskick — välj mall-språk efter medlemmens språk.
- Riktiga **parvisa familjerelationer** (idag: en roll per medlem i hushållet via `familyRole`).

## 11. Allmänt — byte från mock till API

- Alla `data/mock/*Repository.ts` byts mot `data/api/*Repository.ts` med samma metoder
  (fetch via `lib/api.ts` + Zod). En import-rad per hook, noll ändringar i sidor/komponenter.
- Validera ALLA API-svar i runtime med Zod — samma scheman som formulären (`schemas/`) återanvänds.

## 12. AI-tolkning live (frontend-mock klar, backend saknas)

Frontend är byggd mot mock (se `docs/AI-TOLKNING.md` för full plan). Backend kvar:

- **Riktig speech-to-text + översättning:** Speechmatics (STT) + DeepL, via egen
  WebSocket-server. Nycklar ALDRIG i frontend (bara `server/.env`).
- **Ljud i webbläsaren:** mikrofon → AudioWorklet omsampling till 16 kHz → PCM16 →
  binära WS-ramar. Ersätter mockens `streamTranscript`.
- **WebSocket-protokoll:** JSON-kontroll + binära ljud-ramar + `sequence` för
  deduplicering (samma fält som `TranscriptSegment` redan har).
- **Talar-diarisering:** Speechmatics upptäcker präst/diakon automatiskt (idag turas de
  om i mocken).
- **Cross-tab-synk:** mocken använder `BroadcastChannel` (`lib/liveChannel.ts`). I drift
  ersätts den av WS-broadcast från servern till projektor/YouTube-vy.
- **YouTube-vyn** (`/watch`) visar en platshållare — koppla riktig stream-URL.

## 13. Liturgi-manus (bibliotek + dokument + manuellt)

Frontend klar mot mock (`data/liturgy/`, `mockLiturgyRepository`). Backend kvar:

- **Normalisera fler samlingar:** bara Agbeya joinas idag (`mockLiturgyRepository.ts`).
  Katameros, Kholagy, Stilla veckan, Liturgiboken behöver varsin adapter (samma mönster:
  joina `sentences` + `*_relations` till block-formatet `{kind, ar, sv, bibleRef}`).
- **Bibliotek i databas:** flytta liturgierna från inbäddade JSON-filer till servern
  (idag bäddas de in i klient-bundeln — gör sidan tung, bör lazy-laddas eller hämtas via API).
- **Spara manuellt inskriven liturgi** per gudstjänst (idag mock i minnet, `mockLiturgyDraftRepository`,
  nollställs vid omladdning).
- **Dokument-uppladdning:** idag visas PDF/bild lokalt (object-URL, sparas inte). Backend
  ska lagra dokumentet per gudstjänst. Ev. konvertera PowerPoint/Word → PDF på servern.
- **Koppling till live:** operatören kan visa förberedda rader på projektorn (utan AI).
  I drift bör den valda liturgin kopplas till sessionen så AI bara körs för predikan
  (kostnads- och kvalitetsvinst — se `docs/AI-TOLKNING.md`).

---

> Se `docs/BACKLOG.md` för den fullständiga backend-checklistan (server, databas, REST, auth, drift).
