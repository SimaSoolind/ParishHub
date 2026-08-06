# Live-tolkning i ParishHub — Konsoliderad plan

Baserat på **Deep Research-spec (2026-08-05)**.

Denna fil är den **enda aktuella källan**. Gamla planer ligger i
`docs/archive/`.

Ingen kod duplicerad här — länkar till `docs/examples/live-interpretation-mock/`
för mock-referens och `client/src/domain/live-interpretation/` för
produktions-kod.

Uppdaterad: 2026-08-05

---

## 1. Fastställd kravbild

| Område | Beslut |
|---|---|
| Primärt språkflöde | Arabiska → svenska |
| Sekundärt språkflöde | Svenska → arabiska |
| Talare | ENDAST Fader Korollos + diakon (kör INGÅR EJ i AI-tolkning) |
| Lokal visning | Projektor |
| Distansvisning | YouTube |
| Frontend | Befintlig Vite/React 19/TS/Tailwind (INGET nytt projekt) |
| Arkitektur | Befintlig Clean Architecture |
| Design | Varm Olivsten, koppar `#8B5E3C` |
| Typografi | Cormorant Garamond/Inter för SV, Cairo för AR |
| Latens (realistiskt) | 0.5–1.5 sek preliminär, **<2 sek stabil** |
| Översättning | **Även partials** (Alt A) — parallell realtids-visning på båda språk |
| Talaridentifiering | **Automatisk Speaker Diarization** (Speechmatics) — 2 taggar: Präst/Diakon |
| Arbetstid | 8–10 h/vecka |
| Lagring | **Krypterat med explicit samtycke** — AES-256 pgcrypto, 5 år standard |

---

## 2. 9 kritiska korrigeringar (Deep Research)

1. **INTE nytt Vite-projekt** — bygg i befintlig monorepo (`client/src/`)
2. **AudioWorklet omsampling** — webbläsaren ger 44.1/48 kHz, MÅSTE omsampla till backendformat (16 kHz)
3. **Binärt ljud som binära WS-ramar** — INTE ArrayBuffer i JSON
4. **Översätt även PARTIALS (Alt A)** — parallell realtids-visning på båda språk. Extra kostnad ~2 kr/mån (DeepL överskrider gratisnivån med ~100k tecken).
5. **Bidirektionell v1 = manuell riktningsväljare** (AR→SV / SV→AR), ingen auto-detect
6. **Automatisk Speaker Diarization** — Speechmatics upptäcker talare, 2 taggar: Präst/Diakon. Manuell override som fallback (dold knapp för teknisk operatör)
7. **YouTube v1 = video + text bredvid** (inte native captions till YouTube Live)
8. **Latens-mål:** 0.5–1.5 sek preliminär, <2 sek stabil (INTE 700 ms som tidigare)
9. **Predikan sparas KRYPTERAT** (AES-256 pgcrypto) med explicit samtycke från präst. 5 års retention standard.

---

## 3. Arkitektur — hybrid (edge + cloud)

**Edge (webbläsaren i kyrkan):**
- Mikrofon-upptagning (44.1 eller 48 kHz beroende på webbläsare)
- **AudioWorklet omsampling** till 16 kHz mono
- **PCM16-konvertering** (Float32 → Int16)
- Voice Activity Detection (VAD) — filtrera tystnad

**Cloud (backend på Railway):**
- WebSocket-server (proxy mot Speechmatics + DeepL)
- Broadcast till alla klienter
- **Ingen persistens** av transkriptioner (integritetsprincip)

**Presentation:**
- Operatörens kontrollpanel (`/live-interpretation`)
- Projektorvy (`/projector/:sessionId`)
- YouTube-vy (`/watch/:sessionId`)

Fullständig dataflödesbild i `docs/ARCHITECTURE.md`.

---

## 4. Frontend-struktur (Deep Research)

**INTE ny mapp — läggs in i befintlig `client/src/`:**

```
client/src/
├── domain/live-interpretation/
│   ├── entities/
│   │   ├── InterpretationSession.ts
│   │   └── TranscriptSegment.ts
│   ├── repositories/
│   │   └── InterpretationRepository.ts
│   └── types/
│       └── interpretation.types.ts
├── application/live-interpretation/
│   ├── startInterpretation.ts
│   ├── stopInterpretation.ts
│   └── updateSessionSettings.ts
├── infrastructure/live-interpretation/
│   ├── MockInterpretationRepository.ts
│   ├── WebSocketInterpretationRepository.ts
│   ├── BrowserAudioSource.ts
│   └── audio/
│       ├── pcm16.ts
│       └── audio-processor.worklet.ts
├── features/live-interpretation/
│   ├── hooks/
│   │   ├── useInterpretationSession.ts
│   │   └── useMicrophone.ts
│   └── components/
│       ├── InterpretationControlPanel.tsx
│       ├── LanguageDirectionSelector.tsx
│       ├── SpeakerSelector.tsx
│       ├── ConnectionStatus.tsx
│       ├── TranscriptFeed.tsx
│       └── AudioLevelMeter.tsx
└── pages/
    ├── LiveInterpretationPage.tsx   // route: /live-interpretation
    ├── ProjectorPage.tsx             // route: /projector/:sessionId
    └── StreamViewerPage.tsx          // route: /watch/:sessionId
```

Notera: **`application/`** är ny mapp i din monorepo — Clean Architecture-lagret
för use cases som inte passar i `domain/` eller `features/`.

---

## 5. Centrala typer

Definieras en gång i `domain/live-interpretation/types/interpretation.types.ts`
och importeras överallt (DRY).

```ts
export type Language = "ar" | "sv"
export type Speaker = "priest" | "deacon"
export type SegmentStatus = "partial" | "final"

export interface LanguageDirection {
  source: Language
  target: Language
}

export interface TranscriptSegment {
  id: string
  sessionId: string
  speaker: Speaker
  sourceLanguage: Language
  targetLanguage: Language
  originalText: string
  translatedText?: string
  status: SegmentStatus
  sequence: number      // spar-nummer for deduplicering
  createdAt: string     // ISO-tid
}
```

---

## 6. Session state machine

Aktuell status för en tolkningssession — driver UI-visning och overgångar.

```ts
type SessionState =
  | "idle"
  | "requesting-microphone"
  | "connecting"
  | "live"
  | "reconnecting"
  | "stopping"
  | "error"
```

**Övergångar:**
- `idle` → `requesting-microphone` (klick Starta)
- `requesting-microphone` → `connecting` (mikrofontillstånd OK)
- `connecting` → `live` (WSS öppen)
- `live` → `reconnecting` (nätverksbortfall)
- `reconnecting` → `live` (återansluten) / `error` (max försök)
- `live` → `stopping` → `idle` (klick Stoppa)

Alla övergångar loggas för debug-syfte.

---

## 7. Manuell riktningsväljare + Automatisk talaridentifiering (v1)

### Riktningsväljare (manuell)

Operatören väljer riktning via UI — ingen auto-detektion i v1.

**Riktningsväljare** (`LanguageDirectionSelector.tsx`):
- Toggle-knapp: `AR → SV` eller `SV → AR`
- Ändras när prästen växlar språk mitt i predikan (manuellt)

Fördel: 0 % gissningsfel. Nackdel: kräver närvarande operatör.

**v2-plan** (post-MVP): auto-detektion med tröskel + manuell override.

### Talaridentifiering (automatisk)

**Speechmatics Speaker Diarization** upptäcker talare automatiskt utan
kalibrering. Systemet identifierar två generiska taggar:

- `Präst` — Fader Korollos (eller annan präst)
- `Diakon` — generisk för alla diakoner i församlingen

**Fördelar:**
- Ingen manuell talarval krävs under gudstjänsten
- Fungerar för alla diakoner utan enskild kalibrering
- Speechmatics hanterar röstkarakteristik automatiskt

**Fallback — manuell override:**
- Dold knapp för teknisk operatör om diarization misslyckas
- `SpeakerSelector.tsx` finns men är dold i standard-vyn
- Aktiveras via Ctrl+Shift+O (Operatör-läge)

**Data-modell:** `speaker: "priest" | "deacon"` (två taggar räcker för v1).

---

## 8. WebSocket-protokoll

**Klient → server (kontrollmeddelanden, JSON):**

```json
{
  "type": "session.start",
  "sessionId": "uuid",
  "speaker": "priest",
  "sourceLanguage": "ar",
  "targetLanguage": "sv"
}
```

```json
{ "type": "session.update", "speaker": "deacon" }
{ "type": "session.stop" }
```

**Klient → server (ljud, BINÄRA WS-ramar):**
- Efter `session.start` skickas ljud som **binära WebSocket-ramar** (raw Int16 PCM)
- **INTE inbäddat i JSON** — bandbredd + parsing-kostnad

**Server → klient:**

```json
{
  "type": "transcript.partial",
  "sequence": 17,
  "originalText": "...",
  "status": "partial"
}
```

```json
{
  "type": "transcript.final",
  "sequence": 18,
  "speaker": "priest",
  "originalText": "...",
  "translatedText": "...",
  "sourceLanguage": "ar",
  "targetLanguage": "sv"
}
```

```json
{ "type": "connection.status", "state": "live" }
{ "type": "error", "code": "ASR_UNAVAILABLE", "message": "..." }
```

**Deduplicering:** `sequence` monotont ökande. Klienten skippar duplicerade.

**Endast finaliserade segment översätts** (kostnadseffektivt). Partiella
visas som råtranskription utan översättning.

---

## 9. Latensbudget + Alt A (översätt partials)

Från Deep Research: **0.5–1.5 sek preliminär, <2 sek stabil**.

**Alt A vald:** översätt även partial-segment — parallell realtids-visning
på båda språk. Åhörarna ser svensk text nästan samtidigt som arabisk.

### Kostnad för Alt A
- DeepL överskrider gratisnivån (500 000 tecken/mån) med cirka 100 000 tecken
- Extra kostnad: **~2 kr/mån**
- Total DeepL-kostnad förblir under budget (<50 kr/mån för gudstjänsttid)

### Motivation
Endast final-översättning ger 1.5-2 sek fördröjning på svensk text —
det upplevs som "svensk text kommer efter". Med partial-översättning
uppdateras svensk text löpande som prästen pratar, precis som den arabiska.

### Budget

| Steg | Vad händer | Realistisk tid |
|---|---|---|
| 1 | Mikrofon → PCM (AudioWorklet) | 50–100 ms |
| 2 | Klient → server (WSS) | 50–200 ms |
| 3 | Speechmatics ASR (partial) | 300–700 ms |
| 4 | DeepL översättning (partial + final) | 200–500 ms |
| 5 | Server → alla klienter | 50–150 ms |
| 6 | Rendering | 20–50 ms |
| **Totalt (partial)** | | **~1 sek** |
| **Totalt (final)** | | **~1.5–2 sek** |

Under 2 sek stabilt = accepterat.

---

## 10. Sång och kör-hantering

Kören och gemensam sång ingår **inte** i AI-tolkningen (det är alltför
komplex akustik för ASR). Systemet hanterar det i fyra steg:

### v1 (MVP) — Automatisk sång-detektering
- Speechmatics-events triggar sång-läge när kör börjar sjunga
- UI visar `[sång pågår]` istället för transkribering
- Tolkningen pausar automatiskt tills talat språk återkommer
- Ingen försök att transkribera sång

### v1.5 (post-MVP) — Manuellt hymn-bibliotek
- Simas team levererar förhandslagda översättningar av kända hymner
- Operatör väljer aktuell hymn från dropdown i kontrollpanel under gudstjänst
- Text visas på projektorn parallellt med sången
- Ingen realtids-transkribering — statisk förhandsöversättning

### v2 — Auto-sync med Speechmatics
- Speechmatics highlightar aktuell rad i realtid som kören sjunger
- Systemet matchar sång-events mot hymnal-databasen
- Automatisk framflyttning genom hymnen

### v3 (långsiktig) — Karaoke-style highlighting
- Ord-för-ord highlighting synkat med sång
- Kräver mer avancerad tempo-detektering
- Post-MVP-mål

## 11. Koptiska liturgiska fraser (Simas team-tillägg)

Deep Research fokuserar på AR/SV. Sima har lagt till koptisk-hantering
via **keyterm-metoden**:

- **Additional vocab** till Speechmatics: kända koptiska ord som
  latinsk transkription (Kyrie eleison, Alleluia, Amen, Theotokos)
- **Förhandsöversatt cache** i backend: kända koptiska→svenska översättningar
- **Fallback:** okända koptiska ord → visas som `[koptisk liturgi]`

Exempel-tabell (utökas i `server/src/services/copticGlossary.ts` framtiden):

| Latinsk transkription | Svensk översättning |
|---|---|
| Kyrie eleison | Herre, förbarma dig |
| Alleluia | Halleluja |
| Amen | Amen |
| Pantokrator | Allhärskaren |
| Theotokos | Guds Moder |

Cachen håller på server, matchas mot ASR-output innan DeepL-anrop.

---

## 12. Bakgrundsbild per församling (SaaS multi-tenant)

Projektor- och YouTube-vyer får en anpassningsbar bakgrundsbild per
församling. Systemet är designat för multi-tenant SaaS.

### Bas-standarder (Simas team levererar)
- 10–15 färdiga bakgrunder per kyrko-tradition
- Kategoriseras per stil och säsong (se DESIGN.md sektion om bakgrundsbild)

### Kyrko-upload
- Varje församling kan ladda upp egen bakgrund
- Foto, ikon eller logo
- Konfigureras via admin-UI (sparas i församlingens "kyrko-profil")

### Overlay + läsbarhet
- Semi-transparent mörk overlay `rgba(0,0,0,0.4)` läggs på automatiskt
- Textskugga på transkriptionerna för kontrast
- Auto-validering vid upload: varning om bilden är för ljus

### Storleks-krav
- Minst 1920×1080 (Full HD) för projektorer
- Rekommenderat 3840×2160 (4K) för moderna projektorer

---

## 13. Simas teams affärsmodell — hymn-bibliotek

**Kärna:** Hymn-biblioteket är en prenumerations-service.

### Vad Simas team levererar
- Översatta liturgiska hymner på flera språk:
  - Koptiska (för koptiska ortodoxa församlingar)
  - Grekiska (för grekisk-ortodoxa)
  - Ryska (för ryska ortodoxa)
  - Syrianska (för syrisk-ortodoxa)
- Kvalitetskontrollerade av teologer + översättare
- Uppdateras löpande med nya hymner och traditioner

### Affärsmodell
- Församlingar prenumererar för tillgång till biblioteket
- Månadskostnad per församling (SaaS-modell)
- Bas-hymner ingår gratis, avancerade paket köps till

### Konkurrensfördel
Detta är ParishHubs **primära konkurrensfördel** — ingen annan
kyrkovård-plattform har liturgi-specifikt hymnbibliotek på så många
språk. Kombinerat med AI-tolkning gör det ParishHub oumbärlig för
mångspråkiga församlingar.

---

## 14. 8-veckors frontend-plan

| Vecka | Fokus | Milstolpe |
|---|---|---|
| 1 | Domänmodell + MockInterpretationRepository + 3 routes | Se `docs/POC-VECKA-1.md` |
| 2 | Operatörens kontrollpanel med state machine | Klick Starta/Stoppa fungerar mot mock |
| 3 | Projektorvy (mörk olivsten, AAA-kontrast, `lang="ar" dir="rtl"`) | Text från mock ramlar in vackert |
| 4 | Publik-/YouTube-vy (`/watch/:sessionId`) | Iframe-vänlig sida |
| 5 | Mikrofon + AudioWorklet + PCM16-konvertering | Ljud strömmar via WSS-mock |
| 6 | Mock-WebSocket med protokoll (JSON kontroll + binära ramar + `sequence`) | Deduplicering fungerar |
| 7 | Robusthet (heartbeat + exponential backoff + deduplicering) | 5 min bortfall = auto-återansluten |
| 8 | Tillgänglighet + 60-min mock-test | AAA-kontrast + skärmläsare OK |

**Backend** (Speechmatics + DeepL) byggs EFTER frontend är komplett mot mock.
**Redis införs INTE** förrän serverinstans blivit otillräcklig.

---

## 12. Prestandaoptimering

- **Endast finaliserade segment** skickas till DeepL (kostnadseffektivt)
- **Mikrobatching** (samla finala i 500 ms-fönster)
- **In-memory cache** för återkommande liturgiska fraser (TTL 24h)
- **Serialisering en gång** vid broadcast till 100 klienter
- **Redis Pub/Sub** — post-MVP, först när en instans inte räcker

---

## 13. Säkerhet + GDPR

**Säkerhet:**
- API-nycklar ALDRIG i frontend — endast `server/.env`
- WSS (WebSocket Secure) med TLS 1.3
- JWT-validering vid WebSocket-handskakning
- Rate-limit på anslutningar (max 10/IP/min)
- helmet + CORS-allowlist
- Speechmatics är HIPAA + SOC 2 Type II-efterlevande

**GDPR — Predikan-lagring:**
- **Samtycke från präst OCH diakon** innan session startar (GDPR art. 6.1(a))
- Prästen signerar samtycke en gång vid onboarding (gäller framtida sessioner)
- **Krypterat i vila:** AES-256 via Postgres pgcrypto
- **Retention:** 5 år standard, konfigurerbart per församling (1-10 år)
- **Rätt att radera specifik predikan** via admin-UI
- **Rätt att bli glömd:** knapp "Radera all min data"
- **Audit-logg:** vem startade session + vem läst arkiv, när, från vilken IP
- **Ingen delning med tredje part** utan explicit samtycke

Fullständig checklista: `docs/SECURITY.md`.

---

## 14. Definition of Done v1

Sammanfattning av vad som räknas som klart för v1. Fullständiga
implementeringstasks (checkbox-lista): se `docs/BACKLOG.md` sektionerna
**AI-tolkning** (frontend) + **AI-backend**.

Kärnkrav som ska vara uppfyllda:

- Rutt `/live-interpretation` startar/stoppar session + byter riktning + visar `SessionState`
- Rutt `/projector/:sessionId` — fullskärm, mörk olivsten-tema, Cormorant Garamond för SV, Cairo för AR med `lang="ar" dir="rtl"`, AAA-kontrast
- Rutt `/watch/:sessionId` — YouTube-video-embed + text bredvid
- Mock-WebSocket enligt protokoll (JSON kontroll + binära ramar)
- AudioWorklet omsampling 44.1/48 → 16 kHz + PCM16-konvertering
- Deduplicering på `sequence`
- Heartbeat + exponential backoff-reconnect
- 60-min mock-test klarat utan minnesläckor
- Tillgänglighet: `axe` 0 fel + AAA-kontrast

---

## 15. Referenser

**Kod (frontend):**
- Domän: `client/src/domain/live-interpretation/`
- Application: `client/src/application/live-interpretation/`
- Infrastructure: `client/src/infrastructure/live-interpretation/`
- Features: `client/src/features/live-interpretation/`
- Pages: `client/src/pages/{LiveInterpretationPage,ProjectorPage,StreamViewerPage}.tsx`

**Kod (backend, senare):**
- WebSocket-server: `server/src/websocket/` (Vecka 12-14, backend-fas)
- Speechmatics-service: `server/src/services/speechmatics.ts`
- DeepL-service: `server/src/services/deepl.ts`
- Koptisk glossary: `server/src/services/copticGlossary.ts`

**Aktuell dokumentation:**
- Startpunkt: `docs/POC-VECKA-1.md`
- Mock-referens: `docs/examples/live-interpretation-mock/`
- Systemarkitektur: `docs/ARCHITECTURE.md`
- Säkerhet: `docs/SECURITY.md`
- Design: `docs/DESIGN.md`

**Historiska docs:**
- `docs/archive/AI-TOLKNING-RAPPORT-2026-08-04.md`
- `docs/archive/AI-I-PARISHHUB-2026-08-04.md`
- `docs/archive/examples-poc-speechmatics-2026-08-04/` (tidigare feltänkt PoC)
