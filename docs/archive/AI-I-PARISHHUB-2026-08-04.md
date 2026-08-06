# 🤖 Hur AI används i ParishHub

En tydlig, teknisk förklaring av AI-funktionen: vad den gör, hur den fungerar
tekniskt, och exakt vilken teknik som används i **frontend** och **backend**.

> **Status:** ⚪ Planerad funktion. Frontend-skalet kan byggas nu (mot en
> mock-WebSocket), men den riktiga AI-pipelinen kräver backend. Den fullständiga
> rapporten med fler kodexempel finns i
> [AI-TOLKNING-RAPPORT.md](./AI-TOLKNING-RAPPORT.md).

---

## 1. Vad AI:n gör (i en mening)

AI:n **tolkar prästens tal live** — den lyssnar på den arabiska/koptiska
predikan, skriver ner den som text, översätter den till svenska, och visar båda
språken på en skärm i realtid.

Det är alltså **inte** en chatbot eller generativ AI som hittar på text. Det är
en **tal-till-text + översättnings-pipeline** som körs medan gudstjänsten pågår.

---

## 2. Varför funktionen behövs

Församlingen är blandad: en del förstår arabiska, andra bara svenska. Idag kan
den som inte kan arabiska inte följa med i predikan. Med AI-tolkningen visas
prästens ord samtidigt på **båda språk** på en projektor — så alla kan följa
gudstjänsten. Det är projektets viktigaste och mest avancerade funktion.

---

## 3. Översikt — pipelinen i tre steg

```
🎙️  Prästens röst (arabiska)
      │
      ▼
  ①  SPEECHMATICS   tal → arabisk text        (Speech-to-Text)
      │
      ▼
  ②  DEEPL          arabiska → svenska         (översättning)
      │
      ▼
  ③  SKÄRM          visar båda språken live    (projektor / OBS Studio)
```

Målet: texten dyker upp på skärmen under **~1 sekund** efter att prästen talat.

---

## 4. Så fungerar det tekniskt (steg för steg)

Det här är kärnan — hur ljudet färdas från prästens mun till församlingens skärm,
och vad som händer i varje steg.

### 4.1 Frontend fångar ljudet — Web Audio API

Webbläsaren har ett inbyggt ljud-API. Det fungerar så här:

1. `navigator.mediaDevices.getUserMedia()` frågar om **lov att använda mikrofonen**
   och ger tillbaka en ljudström.
2. Ett `AudioContext` (inställt på 24 kHz) tar emot strömmen och bearbetar den i
   små bitar.
3. Ljudet kommer som **Float32** (32-bitars flyttal). Vi gör om det till
   **Int16 PCM** (16-bitars heltal) — det är formatet taligenkänning vill ha, och
   det **halverar datamängden** som skickas.

```ts
// useAudioStreamer.ts — fångar mikrofonen och skickar ljud som PCM
const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
const audioCtx = new AudioContext({ sampleRate: 24000 })
const source = audioCtx.createMediaStreamSource(stream)
const processor = audioCtx.createScriptProcessor(2048, 1, 1)

processor.onaudioprocess = (e) => {
  const input = e.inputBuffer.getChannelData(0) // Float32 (-1 till 1)
  const pcm16 = new Int16Array(input.length) // görs om till 16-bit
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]))
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  socket.send(pcm16.buffer) // skickar binärt via WebSocket
}
```

### 4.2 Överföringen — WebSocket

Vanliga HTTP-anrop passar inte här: de öppnar en anslutning, får ETT svar och
stänger. Realtids-tolkning behöver en **öppen, tvåvägs-kanal** som hålls vid liv
hela gudstjänsten.

Det är precis vad **WebSocket** ger: prästens app skickar ljud *uppåt* och tar
emot text *nedåt* — samtidigt, i samma anslutning. All trafik går krypterat
(**WSS**) till **din egen backend** — aldrig direkt till AI-tjänsterna.

### 4.3 Backend transkriberar och översätter

Servern tar emot ljudet och kör de två AI-stegen:

1. **Speechmatics** (streaming): ljudet strömmas in, och texten kommer tillbaka
   i två varianter — *partiell* (preliminär, visas direkt) och *slutlig*
   (färdig mening). Det gör att text syns nästan omedelbart.
2. **DeepL** (REST-anrop): den arabiska texten skickas och den svenska
   översättningen kommer tillbaka.

```ts
// Backend (Node.js + ws) — förenklat
wss.on("connection", (ws, req) => {
  // 1. Släpp bara in inloggade — validera JWT vid anslutning
  const token = new URLSearchParams(req.url?.split("?")[1]).get("token")
  if (!isValidToken(token)) return ws.close(1008, "Ogiltig token")

  // 2. Ta emot ljud → strömma till Speechmatics
  ws.on("message", (audio) => speechmatics.sendAudio(audio))
})

// När arabisk text kommer tillbaka → översätt → sänd ut
speechmatics.on("transcript", async (arabiska) => {
  const svenska = await translate(arabiska) // DeepL (med cache)
  broadcast({ arabiska, svenska })
})
```

### 4.4 Backend sänder ut till alla skärmar — broadcast

Texten ska nå prästens skärm, projektorn och eventuella mobiler samtidigt. För
att inte belasta servern:

- JSON **serialiseras en gång** och samma sträng skickas till alla klienter.
- Snabba textbitar samlas i **mikro-batcher** (var 50:e ms) istället för ett
  paket per ord.

```ts
// Serialisera EN gång, skicka till alla öppna skärmar
const payload = JSON.stringify({ arabiska, svenska })
wss.clients.forEach((c) => c.readyState === WebSocket.OPEN && c.send(payload))
```

### 4.5 Frontend visar texten

Skärm-vyn tar emot meddelandet, **validerar det med Zod** (samma säkerhetsregel
som resten av appen), och renderar det. Arabiskan visas höger-till-vänster (RTL)
med Cairo-typsnitt, svenskan vänster-till-höger.

```ts
// useInterpretation.ts — tar emot och visar texten
socket.onmessage = (e) => {
  const rad = transcriptSchema.parse(JSON.parse(e.data)) // validera i runtime
  setLines((prev) => [...prev, rad]) // React renderar om skärmen
}
```

Texterna sparas dessutom i databasen → blir ett sökbart **predikanarkiv** efteråt.

---

## 5. Teknik som används — FRONTEND

| Teknik | Vad det är | Hur det används i ParishHub |
|---|---|---|
| **Web Audio API** (`getUserMedia`, `AudioContext`) | Webbläsarens inbyggda ljud-API | Fångar mikrofonen och gör om ljudet till kompakt PCM i realtid |
| **WebSocket API** | Öppen tvåvägs-anslutning i webbläsaren | Skickar ljud uppåt och tar emot text nedåt utan att ladda om |
| **React 19 + custom hooks** | UI-bibliotek | `useAudioStreamer` och `useInterpretation` kapslar logiken (Clean Architecture) |
| **Zod** | Runtime-validering | Kontrollerar all inkommande text innan den visas (säkerhet) |
| **Tailwind CSS v4** | Styling | Stor, läsbar skärm-vy + RTL-stöd för arabiska |
| **react-i18next** | Flerspråkighet | Etiketter i kontroll-vyn på svenska/arabiska |

**Frontend gör:** fångar ljud, skickar det, tar emot texten och visar den.
**Frontend gör INTE:** pratar med Speechmatics/DeepL eller ser deras nycklar.

---

## 6. Teknik som används — BACKEND

| Teknik | Vad det är | Hur det används i ParishHub |
|---|---|---|
| **Node.js + `ws`** | WebSocket-server | Tar emot ljud, håller anslutningar vid liv, sänder ut text |
| **Speechmatics** (realtids-API) | Tal-till-text (STT) | Strömmar in ljud → arabisk text (partiell + slutlig), 96 % precision |
| **DeepL** (REST-API) | Maskinöversättning | Arabisk text → svensk text |
| **jsonwebtoken (JWT)** | Autentisering | Validerar token vid WebSocket-handskakningen — bara inloggade får ansluta |
| **Map / in-memory cache** | Serverminne | Håller reda på anslutna klienter + cachar liturgiska fraser (0 ms) |
| **Prisma + PostgreSQL** | Databas | Sparar transkriberingar → predikanarkiv |
| **dotenv (`.env`)** | Miljövariabler | Förvarar API-nycklarna säkert, utanför koden |
| **Redis Pub/Sub** (framtid) | Meddelandebuss | Delar text mellan flera servrar vid skalning |

**Backend gör:** allt det tunga och hemliga — AI-anropen, säkerheten,
utsändningen och lagringen.

---

## 7. Var i koden (frontend-struktur)

AI:ns frontend följer samma Clean Architecture som resten av appen.

| Fil | Ansvar |
|---|---|
| `hooks/useAudioStreamer.ts` | Mikrofon → Int16 PCM → WebSocket |
| `lib/robustWebSocket.ts` | Auto-återanslutning (exponential backoff + jitter) |
| `hooks/useInterpretation.ts` | Tar emot `{ arabiska, svenska }`, ger live-text som state |
| `domain/transcript.ts` | Entitet för en textrad / sparad predikan |
| `schemas/transcriptSchema.ts` | Zod-schema som validerar inkommande data |

### Tre vyer

| Vy | Route | Vad |
|---|---|---|
| Prästens kontroll | `/tolkning` | Starta/stoppa, mikrofon-status, latens |
| Skärm-vy (projektor) | `/skarm` | Fullskärm, stor live-text på båda språk (utanför Layout, för OBS) |
| Predikanarkiv | `/predikningar` | Sparade transkriberingar i efterhand |

---

## 8. Säkerhet

- **API-nycklar** (Speechmatics, DeepL) lagras bara i backend (`.env`) — aldrig i frontend
- **WSS** (krypterad WebSocket) för all trafik
- **JWT** valideras när anslutningen öppnas — bara inloggade får ansluta
- **Rate-limiting** skyddar mot överbelastning
- All inkommande data **valideras med Zod** innan den används

---

## 9. Prestanda — så hålls fördröjningen låg

| Teknik | Effekt |
|---|---|
| PCM 16-bit-ljud | Halverar datamängden som skickas |
| Partiella transkriberingar | Preliminär text visas direkt, innan meningen är klar |
| Liturgi-cache | Återkommande fraser översätts aldrig om (0 ms) |
| Mikro-batching | Färre, större nätverkspaket → lägre CPU-last |
| Heartbeat (ping/pong) | Städar bort döda anslutningar så servern inte läcker minne |
| Auto-återanslutning | Om nätet svajar kopplar klienten upp sig mjukt igen |

---

## 10. Vad som är byggt vs planerat

| Del | Status |
|---|---|
| Frontend-vyer + hooks mot **mock**-WebSocket | ⚪ Kan byggas nu (utan backend) |
| WebSocket-server (Node + ws) | ⚪ Kräver backend |
| Speechmatics + DeepL-integration | ⚪ Kräver backend + konton/nycklar |
| Skärm-vy för projektor/OBS | ⚪ Planerad |
| Predikanarkiv (sparade tolkningar) | ⚪ Kräver databas |

**Rekommenderad ordning:** bygg först **frontend-skalet** (de tre vyerna +
`useAudioStreamer`/`useInterpretation` mot en simulerad ström). Då är UI:t klart
och väntar bara på att kopplas in när backend + Speechmatics finns.

---

## Vidare läsning

- [AI-TOLKNING-RAPPORT.md](./AI-TOLKNING-RAPPORT.md) — full teknisk rapport med
  fler kodexempel (server, ljudkonvertering, återanslutning, säkerhet, skalning)
- [TEKNISK-DOKUMENTATION.md](./TEKNISK-DOKUMENTATION.md) — hela projektets översikt
- [ARCHITECTURE.md](./ARCHITECTURE.md) — systemarkitektur
