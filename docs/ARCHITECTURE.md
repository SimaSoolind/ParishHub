# Arkitektur — ParishHub

## Översikt

ParishHub är en monorepo med två delar som pratar med varandra:

## Dataflöde — Vanligt anrop (t.ex. hämta medlemmar)

1. Användaren öppnar Medlemmar-sidan i klienten
2. Klienten skickar `GET /api/members` till servern
3. Servern hämtar från PostgreSQL via Prisma
4. Servern returnerar JSON med alla medlemmar
5. Klienten visar listan

## Dataflöde — Live-tolkning under gudstjänst (hybrid, Deep Research-spec)

Arkitekturen är **hybrid** — edge för förbehandling, cloud för tunga
AI-modeller. Baserat på Deep Research-spec (2026-08-05).

**Talare:** ENDAST Fader Korollos + diakon. Kör och församling ingår EJ.
**Riktning:** Bidirektionell AR ↔ SV, manuellt vald av operatör (ingen auto-detect).
**Talaridentifiering:** Automatisk Speaker Diarization via Speechmatics — 2 taggar (Präst/Diakon). Manuell override som fallback för operatör.
**Sång/kör:** Automatisk sång-detektering → `[sång pågår]`-tag + paus i tolkning. Hymn-bibliotek i v1.5.
**Multi-tenant:** Anpassningsbar bakgrundsbild per församling (SaaS-feature).

### Edge (webbläsaren i kyrkan)

1. Operatören öppnar `/live-interpretation` och väljer riktning + talare
2. Klienten öppnar WSS-anslutning till servern med `session.start` (JSON kontrollmeddelande)
3. Mikrofonen ger ljud i webbläsarens native samplerate (44.1 eller 48 kHz)
4. **AudioWorklet omsamplar** till 16 kHz mono (kravnivå för Speechmatics)
5. Konverterar Float32 → **Int16 PCM**
6. Voice Activity Detection (VAD) — filtrera tystnad
7. Strömmar Int16 PCM som **binära WS-ramar** (INTE ArrayBuffer i JSON)

### Cloud (backend på Railway)

8. Servern vidarebefordrar ljudet till **Speechmatics** med:
   - `additional_vocab` för liturgiska ord (Keyterm Prompting inkl. koptiska)
   - **Speaker Diarization** aktiverat — automatisk taggning av Präst/Diakon
9. **Alt A: översätt även PARTIALS** — parallell realtids-visning på båda språk
   (kostnad ~2 kr/mån extra men markant bättre UX)
10. Serverns koptiska glossary-cache matchar kända fraser före DeepL-anrop
11. Servern serialiserar EN gång och broadcastar med `sequence`-nummer
    till alla klienter (för deduplicering)

### Presentation (webbläsare)

12. `/projector/:sessionId` — kyrkans skärm, fullskärm, anpassningsbar bakgrundsbild
13. `/watch/:sessionId` — YouTube-vy (video + text bredvid, INTE native captions)
14. **Predikan lagras KRYPTERAT** (AES-256 pgcrypto) efter explicit samtycke
15. Retention 5 år standard, konfigurerbart per församling

### Latens-mål (realistiskt)

- **Preliminär text:** 0.5–1.5 sek
- **Stabil översatt text:** <2 sek

INTE 700 ms eller 480 ms som tidigare planer angav.

### Kaskadfel-hantering

- Speechmatics dör → `connection.status: reconnecting` + exponential backoff
- DeepL dör → visa endast originalspråk tills MT återkommer
- Nätverk dör → `SessionState: reconnecting`, senaste segment kvar på skärm
- Heartbeat (ping/pong) upptäcker döda anslutningar inom 30 sek

### WebSocket-protokoll

**Klient → server (JSON kontroll):**
```json
{"type": "session.start", "sessionId": "uuid", "speaker": "priest",
 "sourceLanguage": "ar", "targetLanguage": "sv"}
{"type": "session.update", "speaker": "deacon"}
{"type": "session.stop"}
```

**Klient → server (ljud):** binära WS-ramar (raw Int16 PCM) efter `session.start`.

**Server → klient:**
```json
{"type": "transcript.partial", "sequence": 17, "originalText": "...", "status": "partial"}
{"type": "transcript.final", "sequence": 18, "speaker": "priest",
 "originalText": "...", "translatedText": "...",
 "sourceLanguage": "ar", "targetLanguage": "sv"}
{"type": "connection.status", "state": "live"}
{"type": "error", "code": "ASR_UNAVAILABLE", "message": "..."}
```

Fullständig plan: `docs/AI-TOLKNING.md`.
Vecka 1-startpunkt (frontend + mock): `docs/POC-VECKA-1.md`.

## Viktiga tekniska beslut

### Varför PostgreSQL istället för MongoDB?
- Kyrko-appen har många relationer (medlem → familj → närvaro → anteckningar)
- PostgreSQL har starkare stöd för GDPR (radera + spåra samtycke)
- Prisma ORM ger säkra TypeScript-typer automatiskt

### Varför Speechmatics istället för Deepgram/Whisper?
- **96 % noggrannhet** för arabiska — högst av jämförda leverantörer
- **<150 ms latens** i realtid via WebSocket
- Stöd för MSA (Modern Standard Arabic) + dialekter (Egyptian, Gulf, Levantine, Maghrebi) + koptiska inslag
- Utmärkt kodväxlings-stöd (viktigt när prästen växlar mellan arabiska och koptiska under gudstjänsten)
- **HIPAA + SOC 2 Type II-efterlevnad** — viktigt för religiöst känsligt innehåll
- Se detaljerad jämförelse i `docs/AI-TOLKNING.md` sektion 4

### Varför DeepL istället för OpenAI för översättning?
- DeepL är specialiserad på europeiska språk
- Bättre svenska än OpenAI
- Har gratisnivå (500 000 tecken/månad)

### Varför monorepo istället för två separata repos?
- Enklare att hålla frontend och backend synkade
- En plats för dokumentation
- Delade TypeScript-typer

## Beroenden (externa tjänster)

- **PostgreSQL** — Databas (Railway)
- **Speechmatics** — Live speech-to-text för arabiska (MSA + dialekter + koptiska inslag)
- **DeepL API** — Arabisk → svensk översättning
- **Vercel** — Hosting för frontend
- **Railway** — Hosting för backend + databas

## Säkerhet

- Alla API-nycklar bor i `server/.env` — aldrig i klienten
- JWT-tokens skyddar alla skyddade routes
- bcrypt hashar alla lösenord (saltRounds: 12)
- Privata anteckningar krypteras i databasen (AES-256 pgcrypto)
- **Predikan-lagring:** krypterat (AES-256 pgcrypto) med explicit samtycke från präst (GDPR art. 6.1(a))
- **Retention:** 5 år standard, konfigurerbart per församling (1-10 år)
- **Rätt att radera:** specifik predikan via admin-UI, all data via "bli glömd"-knapp
- HTTPS/WSS överallt i produktion
- Speechmatics är HIPAA + SOC 2 Type II-efterlevande (viktigt för känsligt religiöst innehåll)