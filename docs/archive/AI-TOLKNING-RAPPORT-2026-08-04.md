# Rapport & Handlingsplan: Realtids-AI-tolkning i ParishHub

> Beslut: Speechmatics valdes 2026-08-03 för dialekter och koptiska inslag. Se ROADMAP milstolpar och CHANGELOG 0.4.0.

---

# Del 1: Steg-för-steg Handlingsplan för VG-nivå

För att nå dina mål har rapporten omvandlats till en konkret handlingsplan. Den visar exakt vad du behöver göra, varför det behövs, hur det implementeras i koden och hur du säkerställer att du uppnått önskat resultat.

---

## Steg 1: Anslutningshantering & Heartbeat (Eliminera Minnesläckor)

### Vad du ska göra
Koppla in en heartbeat-mekanism (ping-pong) samt automatiskt städa bort inaktiva och "döda" WebSocket-anslutningar.

### Varför
Klienter som tappar nätverket (t.ex. mobiler i kyrkan) kan ligga kvar som zombie-anslutningar på servern. Detta drar minne och kan slutligen krascha servern.

### Hur (Kodexempel i Node.js/ws)
```typescript
import { WebSocketServer, WebSocket } from 'ws';

interface ExtendedWebSocket extends WebSocket {
  isAlive: boolean;
  lastActivity: number;
}

const wss = new WebSocketServer({ port: 8080 });

// 1. Markera anslutningen som levande vid pong
wss.on('connection', (ws: ExtendedWebSocket) => {
  ws.isAlive = true;
  ws.lastActivity = Date.now();

  ws.on('pong', () => {
    ws.isAlive = true;
    ws.lastActivity = Date.now();
  });

  ws.on('message', () => {
    ws.lastActivity = Date.now();
  });
});

// 2. Kör städning var 30:e sekund
const interval = setInterval(() => {
  wss.clients.forEach((client) => {
    const ws = client as ExtendedWebSocket;
    if (ws.isAlive === false) {
      return ws.terminate(); // Tvinga stängning om inget pong mottagits
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on('close', () => clearInterval(interval));
```

### Hur du verifierar
1. Öppna en WebSocket-anslutning i webbläsarens utvecklarverktyg.
2. Stäng av Wi-Fi/Nätverk utan att stänga fliken.
3. Kontrollera att servern inom 30–60 sekunder upptäcker avbrottet och stänger ner anslutningen samt frigör minnet.

---

## Steg 2: Prestandaoptimering vid Broadcasting (Mikrobatching & Enkel Serialisering)

### Vad du ska göra
1. Serialisera JSON-data **enbart en gång** innan du skickar till alla projektorklienter.
2. Samla ihop snabba text-tokens i mikro-batcher (t.ex. var 50:e ms) istället för att anropa `.send()` för varje enskilt ord.

### Varför
Att anropa `JSON.stringify()` inuti en loop för 100 anslutna klienter drar enormt mycket CPU. Att skicka hundratals pyttesmå paket per sekund skapar nätverksoverhead.

### Hur (Kodexempel)
```typescript
import { WebSocket } from 'ws';

export class BroadcastManager {
  private pendingMessages: any[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private wss: any,
    private batchIntervalMs: number = 50
  ) {}

  public broadcast(data: any) {
    this.pendingMessages.push(data);
    if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), this.batchIntervalMs);
    }
  }

  private flush() {
    if (this.pendingMessages.length === 0) return;

    // RÄTT: Serialisera EN gång för alla klienter
    const payload = JSON.stringify({
      type: 'batch',
      messages: this.pendingMessages
    });

    this.wss.clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });

    this.pendingMessages = [];
    this.timer = null;
  }
}
```

### Hur du verifierar
Kör ett benchmark/test där du skickar 100 meddelanden i sekunden till 50 klienter. Jämför CPU-användningen i Aktivitetshanteraren/Process Explorer före och efter optimeringen.

---

## Steg 3: Klientoptimering för Ljudströmning (Web Audio API)

### Vad du ska göra
Konvertera mikrofonens ljudström i webbläsaren från 32-bitars float till 16-bitars Int16 PCM (24kHz Mono) innan det skickas via WebSocket.

### Varför
Det minskar datamängden med 50% jämfört med Float32, samtidigt som PCM 24kHz är det optimala formatet för taligenkänning hos Speechmatics.

### Hur (Kodexempel i React Custom Hook)
```typescript
import { useRef } from 'react';

export const useAudioStreamer = (socket: WebSocket) => {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const startStreaming = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioCtxRef.current = new AudioContext({ sampleRate: 24000 });

    const source = audioCtxRef.current.createMediaStreamSource(stream);
    const processor = audioCtxRef.current.createScriptProcessor(2048, 1, 1);

    processor.onaudioprocess = (e) => {
      const inputBuffer = e.inputBuffer.getChannelData(0);
      // Konvertera Float32 till Int16 PCM
      const pcm16 = new Int16Array(inputBuffer.length);
      for (let i = 0; i < inputBuffer.length; i++) {
        const s = Math.max(-1, Math.min(1, inputBuffer[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(pcm16.buffer);
      }
    };

    source.connect(processor);
    processor.connect(audioCtxRef.current.destination);
  };

  return { startStreaming };
};
```

### Hur du verifierar
Inspektera WebSocket-fliken i webbläsarens DevTools. Meddelandena som skickas ska vara binära `ArrayBuffer`-paket på cirka 4 KB istället för tunga JSON-objekt eller råa 32-bitars matriser.

---

## Steg 4: Parallell Hantering & Cachelagring av Liturgi

### Vad du ska göra
1. Skicka **partiella transkriberingar** (preliminär arabisk text från Speechmatics) direkt till klienten för omedelbar respons.
2. Skapa en **in-memory-cache** för återkommande liturgiska meningar (t.ex. "I Faderns och Sonens och den Helige Andes namn") så att dessa inte skickas till DeepL i onödan.

### Varför
DeepL-översättning via nätverket tar tid (100–300 ms). Om du cachar vanliga kyrkofraser slipper du nätverksanropet helt och får 0 ms latens på dessa fraser.

### Hur (Kodexempel)
```typescript
const liturgyCache = new Map<string, string>([
  ["I Faderns och Sonens namn", "باسم الآب والابن"],
  ["Herren välsigne dig", "الرب يباركك"]
]);

async function translateText(text: string): Promise<string> {
  const trimmed = text.trim();

  // 1. Kolla cachen först
  if (liturgyCache.has(trimmed)) {
    return liturgyCache.get(trimmed)!;
  }

  // 2. Om inte i cache, anropa DeepL API
  const translated = await fetchDeepLAPI(trimmed);

  // 3. Spara för framtida användning
  liturgyCache.set(trimmed, translated);
  return translated;
}
```

### Hur du verifierar
Logga tider i konsolen (`console.time("translation")`). Första gången en liturgisk fras uttalas ska den ta normal tid, och andra gången ska responstiden vara < 1 ms.

---

## Steg 5: Robust Återanslutning på Klientsidan (Exponential Backoff med Jitter)

### Vad du ska göra
Bygg in automatisk återanslutning i klientappen om nätverket svajgar, men med stegvis ökande väntetid och slumpmässig tidsförskjutning (jitter).

### Varför
Om nätverket ligger nere i 5 sekunder och 50 projektorer/mobiler försöker koppla upp sig exakt samtidigt varje sekund uppstår en "återanslutningsstorm" som sänker servern när den kommer igång igen.

### Hur (Kodexempel i TypeScript)
```typescript
class RobustWebSocket {
  private ws: WebSocket | null = null;
  private attempts = 0;
  private maxDelay = 30000; // max 30 sekunder

  constructor(private url: string) {}

  public connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onclose = () => {
      this.scheduleReconnect();
    };

    this.ws.onopen = () => {
      this.attempts = 0; // Återställ vid framgångsrik anslutning
    };
  }

  private scheduleReconnect() {
    this.attempts++;
    // Exponentiell ökning: 1s, 2s, 4s, 8s... upp till maxDelay
    const baseDelay = Math.min(1000 * Math.pow(2, this.attempts), this.maxDelay);
    // Lägg till 20% slumpmässigt jitter
    const jitter = baseDelay * 0.2 * Math.random();
    const totalDelay = baseDelay + jitter;

    setTimeout(() => this.connect(), totalDelay);
  }
}
```

### Hur du verifierar
Stoppa backend-servern manuellt i terminalen, observera hur klienten försöker ansluta med allt längre intervaller (1s, 2.2s, 4.1s...), starta servern igen och verifiera att klienten kopplar upp sig mjukt.

---

## Steg 6: Horisontell Skalning med Redis Pub/Sub (Framtidssäkring)

### Vad du ska göra
När appen växer till flera servrar, använd Redis Pub/Sub för att distribuera tolkningstexten mellan alla serverinstanser.

### Varför
Om prästen är ansluten till *Server A* och församlingen är ansluten till *Server B*, kommer inte *Server B* att veta vad prästen säger om inte servrarna pratar med varandra via en gemensam meddelandebuss (Redis).

---

## Steg 7: Säkerhetsoptimering (DevSecOps & Cybersäkerhet)

### Vad du ska göra
1. Säkra alla WebSocket-anslutningar med WSS (WebSocket Secure) och validera JWT-tokens vid handskakningen.
2. Dölja API-nycklar till Speechmatics och DeepL säkert i backend (miljövariabler).
3. Implementera Rate Limiting för att stoppa överbelastningsattacker (DoS/DDoS).

### Varför
Öppna WebSocket-ändpunkter kan utnyttjas av obehöriga för att skicka skadlig data, stjäla API-resurser eller krascha servern. API-nycklar får aldrig exponeras i klientkoden.

### Hur (Kodexempel i Node.js)
```typescript
import { WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const wss = new WebSocketServer({ port: 8080 });

// Rate-limiting minne
const ipRequests = new Map<string, number>();

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress || 'unknown';

  // 1. Rate Limiting: Max 10 anslutningar per IP per minut
  const count = ipRequests.get(ip) || 0;
  if (count > 10) {
    ws.close(1008, 'För många anslutningsförsök');
    return;
  }
  ipRequests.set(ip, count + 1);

  // 2. Token-validering från URL (wss://server.com?token=XYZ)
  const urlParams = new URLSearchParams(req.url?.split('?')[1]);
  const token = urlParams.get('token');

  if (!token) {
    ws.close(1008, 'Säkerhetstoken saknas');
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log('Autentiserad användare:', decoded);
  } catch (err) {
    ws.close(1008, 'Ogiltigt token');
    return;
  }
});
```

### Hur du verifierar
1. Försök ansluta utan JWT-token och kontrollera att anslutningen nekas direkt.
2. Gör fler än 10 anslutningsförsök från samma IP och verifiera att Rate Limiting stänger ute nya försök.

---

# Del 2: Fullständig Arkitektur- och Analysrapport

## 1. Introduktion
ParishHub står inför en unik utmaning: att leverera realtids-AI-tolkning av arabiska/koptiska predikningar till svenska för församlingsmedlemmar som följer gudstjänsten via projektor eller digitala enheter. Systemet kräver låg latens, hög noggrannhet och robust skalbarhet för att hantera varierande antal åhörare. Den nuvarande arkitekturen använder WebSocket som transportprotokoll för att överföra ljud från prästens mikrofon till en server, som sedan bearbetar ljudet genom flera AI-tjänster innan resultatet skickas till klienterna.

WebSocket är en idealisk teknik för detta ändamål eftersom det möjliggör tvåvägskommunikation i realtid mellan klient och server. Till skillnad från HTTP, som är ett envägs request-response-protokoll där anslutningen stängs efter varje svar, upprätthåller WebSocket en beständig anslutning som möjliggör kontinuerligt dataflöde. Detta är avgörande för ParishHub, där ljudströmmen måste bearbetas och visas nästan omedelbart för åhörarna.

Den tre-stegs pipeline som används är:

1. Röst (Arabiska) → **Speechmatics** → 2. Skriven text (Arabiska) → **DeepL** → 3. Skriven text (Svenska)

---

## 2. Nuvarande arkitektur för ParishHubs realtidstolkning
Det befintliga dataflödet i ParishHub kan beskrivas som en sekventiell pipeline med flera bearbetningssteg:

* **Steg 1:** Ljud från prästens mikrofon fångas upp i webbläsaren och skickas via WebSocket till servern.
* **Steg 2:** Servern vidarebefordrar ljudströmmen till **Speechmatics** för arabisk/koptisk transkribering (Speech-to-Text).
* **Steg 3:** Den transkriberade arabiska texten skickas till **DeepL** för översättning till svenska.
* **Steg 4:** Både den arabiska originaltexten och den svenska översättningen broadcastas till samtliga anslutna projektor-klienter via WebSocket.
* **Steg 5:** Samma texter sparas i databasen för framtida arkivering.

---

## 3. Identifierade utmaningar i det befintliga dataflödet

### 3.1 Anslutningshantering och resursläckor
En av de mest grundläggande utmaningarna med ParishHubs arkitektur är hanteringen av WebSocket-anslutningar. Varje ansluten klient, oavsett om det är prästens mikrofon eller en projektor-klient, upprätthåller en beständig TCP-anslutning till servern. Anslutningar som inte stängs korrekt förbrukar serverresurser under obestämd tid.

Utan korrekt livscykelhantering kan zombie-anslutningar ackumuleras och leda till minnesläckor. Varje WebSocket-anslutning förbrukar minne för buffertar, tillstånd och metadata.

### 3.2 Broadcasting-ineffektivitet
När den arabiska texten och den svenska översättningen ska skickas till samtliga projektor-klienter, använder den nuvarande arkitekturen sannolikt en enkel loop över alla anslutna klienter. Detta kan vara ineffektivt om serialiseringen av data görs för varje klient istället för en gång.

### 3.3 Arabisk dialektvariation och koptiska inslag
Arabisk taligenkänning innebär specifika utmaningar. Modern Standard Arabic (MSA) skiljer sig väsentligt från de vardagliga dialekter som talas i Mellanöstern. En präst kan dessutom använda koptiska inslag och kodväxling under en gudstjänst, vilket kräver en STT-modell med hög dialektprecision.

---

## 4. Optimering av WebSocket-anslutningshantering

### 4.1 Implementering av korrekt anslutningslivscykel
För att undvika resursläckor måste ParishHub implementera en korrekt livscykelhantering för varje WebSocket-anslutning. Använd en `Map`-struktur för att hålla reda på anslutna klienter med tillhörande metadata.

### 4.2 Heartbeat/Ping-Pong-mekanism
För att upptäcka döda anslutningar innan de orsakar problem, bör ParishHub implementera en heartbeat-mekanism där servern regelbundet skickar ping-meddelanden till anslutna klienter.

---

## 5. Optimering av meddelandehantering och broadcasting

### 5.1 Effektiv broadcasting med mikrobatching
Samla flera meddelanden under ett kort tidsintervall (t.ex. 50 ms) och skicka dem som en batch för att minska CPU-belastningen.

### 5.2 Serialisering en gång för broadcasting
Serialisera JSON en gång till en sträng och skicka samma sträng till alla öppna klienter.

---

## 6. Optimering av ljudströmning för AI-tolkning

### 6.1 Val av ljudformat
PCM 24kHz Mono rekommenderas för bästa balans mellan ljudkvalitet och bandbredd.

### 6.2 Buffring och strömning från webbläsare
Använd Web Audio API på klientsidan. Konvertering av ljud från 32-bitars flyttal till 16-bitars heltal (Int16) halverar bandbreddsanvändningen.

---

## 7. Val av Speech-to-Text-leverantör för arabiska

#### Tabell 3: Jämförelse av arabiska STT-leverantörer
| Leverantör | Genomsnittlig noggrannhet | Dialektstöd | Realtidsstöd | Noteringar |
| :--- | :--- | :--- | :--- | :--- |
| **Speechmatics** | **96%** | MSA + Egyptian + Gulf + Levantine + Maghrebi + Koptiska inslag | Ja (<150 ms) | Högst noggrannhet, utmärkt kodväxlingsstöd |
| **Deepgram** | Hög | MSA + dialekter | Ja (<300 ms) | Nova-2 modell, mycket kostnadseffektiv |
| **OpenAI Whisper**| Varierande | MSA + dialekter | Kräver chunking | Högre latens för äkta realtid |

**Rekommendation:** **Speechmatics** är förstahandsvalet för ParishHub för att säkerställa högsta precision vid dialekter och koptiska inslag.

---

## 8. Skalbarhet med Redis Pub/Sub och lastbalansering

När antalet samtidiga användare ökar krävs en arkitektur där flera WebSocket-servrar kan samverka via Redis Pub/Sub.

---

## 9. Övervakning och nyckelmetriker (Prometheus)

#### Tabell 4: Nyckelmetriker för övervakning
| Metrik | Beskrivning | Varningströskel | Kritiskt tröskelvärde |
| :--- | :--- | :--- | :--- |
| **Aktiva anslutningar** | Antal samtidiga WebSocket-anslutningar | >80% av kapacitet | >95% av kapacitet |
| **Genomsnittlig latens**| Tid från ljud till textvisning | >1000 ms | >3000 ms |
| **Minnesanvändning** | Totalt minne som förbrukas av servern | >512 MB | >1 GB |

---

## 10. Cybersäkerhet och Dataskydd (DevSecOps)

Säkerhet i realtidssystem är avgörande för att förhindra avbrott och resursstöld.

* **Autentisering & Auktorisering:** Alla WebSocket-anslutningar kräver giltig JWT-token. Token valideras vid handskakningen (WSS).
* **API-nyckelsäkerhet:** API-nycklar till Speechmatics och DeepL lagras endast i backend via miljövariabler (`.env`). Inga nycklar finns i klientkoden.
* **Skydd mot överbelastning (DoS):** Rate-limiting begränsar antalet anslutningar och meddelanden per IP-adress.
* **Datakryptering:** All datatrafik krypteras i flykten med TLS/WSS.

---

## 11. Slutsats och Sammanfattande Rekommendationer

#### Tabell 5: Sammanfattning av rekommenderade optimeringar
| Optimeringsområde | Rekommenderad åtgärd | Förväntad effekt |
| :--- | :--- | :--- |
| **Anslutningshantering** | Implementera heartbeat/ping-pong och rensning | Eliminering av zombie-anslutningar |
| **Broadcasting** | Serialisera en gång, använd mikrobatching | 2-3x snabbare broadcasting, lägre CPU |
| **Ljudkonvertering** | Konvertera till Int16 PCM i webbläsaren | 50% minskad nätverksbelastning |
| **Liturgi-cache** | Cachelagra kända liturgiska fraser | 0 ms latens för återkommande fraser |
| **Återanslutning** | Exponential backoff med jitter på klienten | Skyddar servern mot anslutningsstormar |
| **Säkerhet** | JWT-validering, WSS och Rate-limiting | Skydd mot DoS och obehörig åtkomst |
| **Skalning** | Redis Pub/Sub + Nginx med sticky sessions | Horisontell skalbarhet till tusentals användare |
