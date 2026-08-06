# 🔒 Säkerhet — ParishHub

> **Syfte:** JWT, roller (RBAC), kryptering, audit-loggar, GDPR, filuppladdning.
> **Använd när:** du bygger inloggning, hanterar användarrätt, gör uppladdning.
> **Se även:** [`BACKLOG.md`](./BACKLOG.md) för säkerhets-tasks, [`ARCHITECTURE.md`](./ARCHITECTURE.md) för multi-tenant-isolation.

Detaljerad säkerhetschecklista för backend (server/) och frontend (client/).
CLAUDE.md innehåller kärnreglerna — denna fil förklarar VARFÖR och HUR med exempel.

Skriven på lätt svenska. Kod och identifierare på engelska.

---

## 🎯 Hotbild — varför detta är extra viktigt här

ParishHub hanterar två känsliga saker:

1. **Medlemsregister = personuppgifter** → GDPR gäller (namn, telefon, e-post, familj).
2. **AI-nycklar** (Speechmatics, DeepL) → kostar pengar och får aldrig läcka.

Om nycklar läcker kan någon annan använda dem på din faktura. Om medlemsdata läcker
är det ett GDPR-brott. Därför är säkerhet inte valfritt i detta projekt.

---

## 1. Hemligheter och nycklar

- Alla nycklar ligger i `.env` på servern — aldrig i koden, aldrig i frontend.
- `.env` ligger i `.gitignore` och committas ALDRIG. Committa istället `.env.example`
  med tomma värden så andra vet vilka variabler som behövs.
- Frontend anropar ALDRIG Speechmatics/DeepL direkt. Frontend anropar din egen backend,
  som i sin tur anropar tjänsten med nyckeln. Nyckeln lämnar aldrig servern.
- Separata nycklar för utveckling och produktion.
- Rotera (byt) nyckeln direkt om den läcker.

```ts
// FEL — nyckel i frontend, syns för alla i webbläsaren
const res = await fetch("https://api-free.deepl.com/v2/translate", {
  headers: { Authorization: `DeepL-Auth-Key ${import.meta.env.VITE_DEEPL_KEY}` },
})

// RÄTT — frontend anropar egen backend, nyckeln stannar på servern
const res = await fetch("/api/translate", { method: "POST", body })
```

---

## 2. Autentisering (vem är du?) med JWT + bcrypt

- Lösenord hashas med **bcrypt** innan de sparas — aldrig i klartext.
  Minst 10 salt rounds (12 är säkrare men långsammare).
- **Access-token** (JWT) har kort livslängd (t.ex. 15 minuter).
- **Refresh-token** lagras i en cookie med `httpOnly`, `Secure` och `SameSite=Strict`
  — INTE i localStorage (localStorage kan läsas av XSS-angripare).
- Signera JWT med en stark hemlighet från `.env`.

```ts
import bcrypt from "bcrypt"

// Hashar ett lösenord innan det sparas i databasen
async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}

// Jämför inskrivet lösenord med det hashade
async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}
```

---

## 3. Auktorisering (får du göra detta?)

Autentisering och auktorisering är INTE samma sak:

- **Autentisering** = vem är du (inloggad?).
- **Auktorisering** = får du göra just denna åtgärd på just denna resurs?

Kontrollera alltid att den inloggade användaren äger resursen. En präst ska bara
kunna se och ändra sin egen församlings data — inte någon annans.

```ts
// FEL — hämtar medlem utan att kolla vem som frågar
const member = await prisma.member.findUnique({ where: { id } })

// RÄTT — kontrollerar att medlemmen tillhör den inloggade prästens församling
const member = await prisma.member.findFirst({
  where: { id, parishId: req.user.parishId },
})
if (!member) return res.status(404).json({ error: "Hittades inte" })
```

---

## 4. Skydd mot upprepade inloggningsförsök

- **Rate-limit** hårdare på `/login` än på andra endpoints.
- Öka fördröjningen vid upprepade misslyckanden (brute-force-skydd).
- Avslöja inte om det var användarnamnet eller lösenordet som var fel
  (skriv "Fel e-post eller lösenord", inte "Lösenordet är fel").

```ts
import rateLimit from "express-rate-limit"

// Max 5 inloggningsförsök per 15 minuter per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "För många försök, försök igen senare.",
})
app.post("/api/login", loginLimiter, loginHandler)
```

---

## 5. Validera all input med Zod

- Validera `body`, `params` OCH `query` på VARJE endpoint.
- TypeScript-typer räcker inte — de finns bara vid kompilering, inte vid körning.
  Data utifrån (requests, JSON.parse, localStorage) måste valideras i runtime.

```ts
import { z } from "zod"

const createMemberSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().email(),
  phone: z.string().min(6),
})

function createMember(req, res) {
  const result = createMemberSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({ error: "Ogiltig indata" })
  }
  // result.data är nu validerad och typad
}
```

---

## 6. Databas (Prisma + PostgreSQL)

- Prisma parametriserar frågor automatiskt → skyddar mot SQL-injection.
- Undvik `$queryRawUnsafe` och strängkonkatenering i frågor.
- Databas-användaren ska ha minsta möjliga rättigheter (inte superuser).
- Kör schemaändringar via Prisma-migrationer, inte manuellt.
- Ha en backup-strategi för produktionsdatabasen.

```ts
// FEL — öppnar för SQL-injection
await prisma.$queryRawUnsafe(`SELECT * FROM members WHERE name = '${input}'`)

// RÄTT — Prisma parametriserar åt dig
await prisma.member.findMany({ where: { name: input } })
```

---

## 7. Nätverk och säkra headers

- **helmet** sätter säkra HTTP-headers (inklusive CSP mot XSS).
- **cors** med en allowlist av tillåtna origins — aldrig `origin: "*"` i produktion.
- **express-rate-limit** globalt för att bromsa missbruk.
- HTTPS överallt (Railway/Vercel ger detta automatiskt).

```ts
import helmet from "helmet"
import cors from "cors"

app.use(helmet())
app.use(cors({ origin: ["https://parishhub.vercel.app"], credentials: true }))
```

---

## 8. Felhantering och loggning

- Använd en **central felhanterare** (Express error middleware) sist i kedjan.
- Läck ALDRIG stack trace, SQL eller interna detaljer till klienten.
- Visa ett generiskt meddelande + ett referens-id; logga hela felet internt.
- Logga ALDRIG lösenord, tokens eller personuppgifter.
- Använd egna felklasser för tydlighet.

```ts
// Egen basklass för fel med tydliga namn
class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message)
  }
}

// Central felhanterare — sista middleware i Express
function errorHandler(err, req, res, next) {
  console.error(err) // full logg internt
  const status = err instanceof AppError ? err.statusCode : 500
  // generiskt meddelande till klienten — inga interna detaljer
  res.status(status).json({ error: "Ett fel uppstod. Referens: " + req.id })
}
```

---

## 9. Externa anrop (Speechmatics, DeepL, coptic.io)

- Samla alla externa anrop i `server/src/api/` (eller `services/`) med try/catch.
- Använd återförsök med exponentiell backoff + jitter vid tillfälliga fel.
- Ha en tidsgräns (timeout) så ett hängande anrop inte låser servern.
- Degradera snyggt: om översättningen misslyckas, visa originaltexten i stället
  för att krascha.

---

## 10. Personuppgifter och GDPR

Medlemsregistret innehåller personuppgifter → GDPR gäller:

- **Dataminimering:** spara bara det som behövs.
- **Samtycke:** ha stöd för att personen godkänt lagringen.
- **Rätt att bli glömd:** kunna radera en persons uppgifter helt.
- **Skydda känsliga fält** och logga inte personuppgifter i klartext.
- Tänk på var datan lagras (Railway/EU-region om möjligt).

---

## 11. Beroenden och byggprocess

- Kör `npm audit` regelbundet och åtgärda kända sårbarheter.
- Håll beroenden uppdaterade (men testa efter uppdatering).
- Publicera INTE source maps i produktion (de avslöjar källkoden).
- CI kör `tsc`, lint och tester innan kod slås ihop.

---

## 12. Frontend- och TypeScript-säkerhet

Reglerna nedan gäller klient-koden (React + TypeScript).

### unknown istället för any
`any` stänger av all typkontroll och döljer säkerhetshål. Använd `unknown` för
osäkra värden och smalna av typen med en kontroll innan värdet används.

```ts
// FEL — any stänger av typkontrollen
function handle(input: any) {
  return input.name
}

// RÄTT — unknown tvingar en kontroll först
function handle(input: unknown) {
  if (typeof input === "object" && input !== null && "name" in input) {
    return (input as { name: string }).name
  }
}
```

### Förbjud eval() och new Function()
Kör aldrig strängar som kod — det är en av de största riskerna i JavaScript
(kodinjektion). Det finns inget giltigt skäl att använda dem i ParishHub.

### Null-skydd och type guards
Kontrollera alltid att ett värde finns innan dess egenskaper läses, annars kan
appen krascha (null-reference).

```ts
const name = user?.name ?? "Okänd" // optional chaining + fallback
```

### Validera data i runtime (inte bara vid bygge)
TypeScript-typer finns bara vid kompilering. Data utifrån måste valideras när
koden körs — formulär, API-svar, WebSocket-meddelanden, localStorage och
`JSON.parse`. Använd Zod (se `schemas/`).

### React Error Boundaries
Bygg felfångare runt sidor och kort så att ett fel i EN komponent inte kraschar
hela appen. Visa ett generellt meddelande ("Något gick fel. Försök igen.") och
logga det fulla felet internt — aldrig till användaren.

### Content Security Policy (CSP)
Begränsa vilka resurser appen får ladda för att bromsa XSS. helmet sätter CSP på
servern; undvik att ladda skript från okända källor.

### strict mode
tsconfig kör redan `strict: true` (inkl. `strictNullChecks`). Behåll det — det
fångar buggar och saknade null-kontroller tidigt.

### Automatisk säkerhets-skanning (SAST)
Kör lint och `npm audit` (ev. OWASP Dependency-Check) i CI innan kod publiceras,
så kända sårbarheter fångas automatiskt.

---

## 12. Predikan-lagring (AI-tolkning)

Live-tolkade predikningar kan sparas krypterat efter explicit samtycke
från prästen. Detta är en aktiv opt-in — inget sparas som standard.

### Krav

- **Samtycke från präst** (GDPR art. 6.1(a)) — signeras en gång vid onboarding
- **Krypterat i vila:** AES-256 via Postgres `pgcrypto`
- **Retention:** 5 år standard, konfigurerbart per församling (1-10 år)
- **Ingen delning med tredje part** utan explicit samtycke
- **Audit-logg:** vem startade session + vem läst arkiv, när, från vilken IP

### Rättigheter (GDPR)

- **Rätt att radera specifik predikan** — via admin-UI
- **Rätt att bli glömd** — knapp "Radera all min data" raderar allt permanent
- **Rätt till dataportabilitet** — export till PDF eller JSON på begäran

### Kryptering — exempel (pgcrypto)

```sql
-- Aktivera pgcrypto-tillägget en gång per databas
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Kryptera vid INSERT (nyckeln kommer fran server .env, inte databasen)
INSERT INTO sermons (id, church_id, encrypted_content)
VALUES (
  gen_random_uuid(),
  $1,
  pgp_sym_encrypt($2, $3)  -- $3 = SERMON_ENCRYPTION_KEY fran .env
);

-- Dekryptera vid SELECT (endast prasten far dekrypterings-nyckeln)
SELECT id, pgp_sym_decrypt(encrypted_content::bytea, $1) AS content
FROM sermons
WHERE church_id = $2 AND deleted_at IS NULL;
```

### Nyckelhantering

- `SERMON_ENCRYPTION_KEY` i `server/.env` — 256-bitars slumpmässig
- Roteras vid varje major-release (kräver re-kryptering av arkivet)
- Backup av krypterings-nyckel i separat vault (t.ex. 1Password)
- Om nyckeln förloras är arkivet oåtkomligt (per design — säkerhet)

### Automatisk radering

Cron-jobb kör dagligen och raderar predikningar som passerat retention-perioden:

```sql
DELETE FROM sermons
WHERE created_at < NOW() - INTERVAL '5 years'
   OR (deleted_at IS NOT NULL AND deleted_at < NOW() - INTERVAL '30 days');
```

Soft-delete under 30 dagar innan permanent radering — ger präst tid
att ångra oavsiktlig borttagning.

---

## 13. Säker filuppladdning

Bilder (profilfoton) laddas upp i AddMemberModal. Just nu bara base64 i minnet
med 1 MB storleksgräns och `accept="image/*"`. **När backend kommer** måste
servern göra riktig validering — MIME-typ från webbläsaren kan spoofas.

### Servern måste
- **Validera magic bytes** (första 4 bytes) — inte lita på MIME-typen
  - PNG: `89 50 4E 47`
  - JPEG: `FF D8 FF`
  - WebP: `52 49 46 46`
- **Sanera filnamn** — ta bort `../`, specialtecken, ändra till UUID
- **Storleksgräns även på server** (inte bara i klienten — kan kringgås)
- **Antivirus-skanning** (t.ex. ClamAV) om filer sparas på disk
- **Separat CDN-bucket** för uppladdade filer — aldrig samma origin som API:t
- **Inga körbara filer** — bara whitelist av bild-format
- **Rate-limit på upload-endpoint** — förhindra DoS via storleks-spam

### Kod-exempel (server, framtida)

```ts
import { fileTypeFromBuffer } from "file-type"

// Validerar att en uppladdad fil verkligen ar en bild
// mimeType fran multipart racker inte — kolla filens verkliga innehall
async function validateImage(buffer: Buffer): Promise<boolean> {
  const detected = await fileTypeFromBuffer(buffer)
  const allowed = ["image/png", "image/jpeg", "image/webp"]
  return detected !== undefined && allowed.includes(detected.mime)
}
```

---

## ✅ Snabb checklista

- [ ] Inga nycklar i koden eller frontend — bara i `.env` på servern
- [ ] `.env` i `.gitignore`, `.env.example` committad
- [ ] Lösenord hashas med bcrypt
- [ ] JWT kort livslängd, refresh-token i httpOnly-cookie
- [ ] Rate-limit på `/login`
- [ ] Auktorisering: användaren äger resursen
- [ ] Zod-validering på varje endpoint
- [ ] Prisma utan `$queryRawUnsafe`
- [ ] helmet + cors (allowlist) + rate-limit
- [ ] Central felhanterare, inga läckta detaljer
- [ ] Inga personuppgifter/tokens i loggar
- [ ] GDPR: dataminimering + rätt att bli glömd
- [ ] npm audit rent, inga source maps i produktion
- [ ] `unknown` istället för `any`, inga `eval()`/`new Function()`
- [ ] Runtime-validering av API/WebSocket-svar (Zod)
- [ ] React Error Boundaries runt sidor/kort
- [ ] Filuppladdning: magic bytes-validering + sanera filnamn + antivirus

---

## 14. Rollbaserad åtkomst (RBAC)

ParishHub använder rollbaserad åtkomstkontroll (RBAC) för att styra
vem som får se och ändra vad. Baseras på principen om **lägsta behörighet**.

### De tre rollerna

| Roll | Beskrivning | Typiska användare |
|---|---|---|
| **admin** | Full åtkomst till en församlings all data | Kyrkoförvaltare |
| **präst** | Läsa/ändra medlemmar, sakrament, gudstjänster, predikningar | Fader Korollos, diakon |
| **volontär** | Begränsad läs-åtkomst till relevanta delar | Söndagsskolelärare, kör-ledare |

**Ingen roll är superuser** — även admin måste tillhöra en församling
(`user_church_roles`).

### Behörigheter per roll (utkast)

| Åtgärd | admin | präst | volontär |
|---|---|---|---|
| Läs medlemmar | ✅ | ✅ | ✅ (begränsat) |
| Ändra/lägga till medlemmar | ✅ | ✅ | ❌ |
| Radera medlem | ✅ | ✅ | ❌ |
| Läs sakramentsregister | ✅ | ✅ | ❌ |
| Ändra sakrament | ✅ | ✅ | ❌ |
| Skapa gudstjänst | ✅ | ✅ | ❌ |
| Bocka av närvaro | ✅ | ✅ | ✅ |
| Starta AI-tolkning | ✅ | ✅ | ❌ |
| Läsa predikan-arkiv | ✅ | ✅ | ❌ |
| Skicka massmeddelande | ✅ | ✅ | ❌ |
| Visa audit-logg | ✅ | ❌ | ❌ |
| Ändra kyrko-inställningar | ✅ | ❌ | ❌ |
| GDPR-radering | ✅ | ❌ | ❌ |

### Multi-kyrka + roller

En användare kan ha OLIKA roller i olika församlingar via `user_church_roles`:

- Fader Korollos = **präst** i församling A OCH församling B
- Söndagsskolelärare = **volontär** i församling A men inget i B

### Backend-middleware

Framtida `server/src/middleware/rbac.ts`:

- Läser JWT från Authorization-header
- Kollar `user_church_roles` för aktuell resurs
- Returnerar 403 Forbidden om rollen saknar behörighet
- Loggar alla nekade försök i `audit_log`

Se `docs/BACKLOG.md` sektion **Auth + Säkerhet** för implementeringstasks.

---

## Vidare säkerhetsdokumentation

- **Multi-kyrka-isolation:** se `docs/ARCHITECTURE.md` sektion "Multi-tenant-arkitektur"
- **Sakraments-hantering:** se `docs/BACKLOG.md` sektion **Sakrament** för GDPR art. 9 (särskilda kategorier — religiös övertygelse)
- **Generell audit-logg:** implementeras enligt `docs/BACKLOG.md` sektion **Auth + Säkerhet**
